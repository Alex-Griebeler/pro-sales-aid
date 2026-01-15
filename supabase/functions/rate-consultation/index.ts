import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validate session ID format (UUID v4)
const isValidSessionId = (sessionId: string): boolean => {
  if (!sessionId || typeof sessionId !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(sessionId);
};

// Validate UUID format
const isValidUUID = (uuid: string): boolean => {
  if (!uuid || typeof uuid !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

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
    const { consultation_id, rating, comment, sessionId } = await req.json();

    // Validate session ID
    if (!isValidSessionId(sessionId)) {
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

    // Verify ownership: Check that the consultation belongs to this session
    const { data: consultation, error: fetchError } = await supabase
      .from("ai_consultations")
      .select("session_id")
      .eq("id", consultation_id)
      .single();

    if (fetchError || !consultation) {
      return new Response(
        JSON.stringify({ error: "Consulta não encontrada" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the consultation belongs to this session
    if (consultation.session_id !== sessionId) {
      console.warn("Session mismatch:", { expected: consultation.session_id, received: sessionId });
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