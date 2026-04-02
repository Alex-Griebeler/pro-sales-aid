import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ACTIVE_LICENSE_STATUSES = new Set(["approved", "active", "complete"]);

// Hash a string using SHA-256
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Validate UUID format
const isValidUUID = (uuid: string): boolean => {
  if (!uuid || typeof uuid !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers.get("authorization") ?? req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice("Bearer ".length).trim();
  return token || null;
}

async function hasActiveLicense(
  supabase: any,
  userId: string,
): Promise<boolean> {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("hotmart_status")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile license:", error);
    throw new Error("Erro ao validar licença");
  }

  const status = String(profile?.hotmart_status ?? "").trim().toLowerCase();
  return ACTIVE_LICENSE_STATUSES.has(status);
}

// Sanitize comment - remove potential harmful content
const sanitizeComment = (comment: string | undefined): string | null => {
  if (!comment || typeof comment !== 'string') return null;
  // Limit length and remove HTML/script tags
  return comment
    .slice(0, 1000) // Max 1000 chars
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim() || null;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { consultation_id, rating, comment, sessionToken } = await req.json();

    // Validate session token format
    if (!sessionToken || !isValidUUID(sessionToken)) {
      return new Response(
        JSON.stringify({ error: "Sessão inválida" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate consultation_id
    if (!consultation_id || !isValidUUID(consultation_id)) {
      return new Response(
        JSON.stringify({ error: "consultation_id inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate rating
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return new Response(
        JSON.stringify({ error: "rating deve ser um número inteiro entre 1 e 5" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase configuration missing");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const accessToken = extractBearerToken(req);
    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: missing bearer token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !authData.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: invalid user session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = authData.user.id;
    const activeLicense = await hasActiveLicense(supabase, userId);
    if (!activeLicense) {
      return new Response(
        JSON.stringify({ error: "Acesso bloqueado: licença inativa" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate session token server-side
    const sessionHash = await hashToken(sessionToken);

    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .select('id, user_id, expires_at')
      .eq('session_hash', sessionHash)
      .single();

    if (sessionError || !sessionData) {
      return new Response(
        JSON.stringify({ error: "Sessão não encontrada" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (new Date(sessionData.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: "Sessão expirada" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (sessionData.user_id !== userId) {
      return new Response(
        JSON.stringify({ error: "Sessão não pertence ao usuário autenticado" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify ownership: Check that the consultation belongs to this session
    const { data: consultation, error: fetchError } = await supabase
      .from("ai_consultations")
      .select("session_uuid")
      .eq("id", consultation_id)
      .single();

    if (fetchError || !consultation) {
      return new Response(
        JSON.stringify({ error: "Consulta não encontrada" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the consultation belongs to this session (using session_uuid)
    if (consultation.session_uuid !== sessionData.id) {
      console.warn("Session mismatch:", { expected: consultation.session_uuid, received: sessionData.id });
      return new Response(
        JSON.stringify({ error: "Não autorizado a avaliar esta consulta" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update consultation with rating
    const { data, error } = await supabase
      .from("ai_consultations")
      .update({
        quality_rating: rating,
        rating_comment: sanitizeComment(comment),
        rated_at: new Date().toISOString(),
      })
      .eq("id", consultation_id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Erro ao salvar avaliação" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!data) {
      return new Response(
        JSON.stringify({ error: "Consulta não encontrada" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Avaliação salva com sucesso" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("rate-consultation error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
