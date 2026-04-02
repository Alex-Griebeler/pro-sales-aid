import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionToken } = await req.json();

    // Validate session token format
    if (!sessionToken || !isValidUUID(sessionToken)) {
      return new Response(
        JSON.stringify({ error: "Sessão inválida" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

    // Hash the token and validate session
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

    // Fetch the latest consultation for this session using the session UUID
    const { data, error } = await supabase
      .from("ai_consultations")
      .select("id")
      .eq("session_uuid", sessionData.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // No consultation found is not an error
      if (error.code === 'PGRST116') {
        return new Response(
          JSON.stringify({ consultation_id: null }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Erro ao buscar consulta" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ consultation_id: data?.id || null }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("get-consultation error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
