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

function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers.get("authorization") ?? req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice("Bearer ".length).trim();
  return token || null;
}

async function hasActiveLicense(
  supabase: ReturnType<typeof createClient>,
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    // Generate cryptographically secure session token
    const sessionToken = crypto.randomUUID();
    const sessionHash = await hashToken(sessionToken);

    // Session expires in 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Store hashed session in database
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        user_id: userId,
        session_hash: sessionHash,
        expires_at: expiresAt,
      })
      .select('id')
      .single();

    if (error) {
      console.error("Error creating session:", error);
      throw new Error("Failed to create session");
    }

    // Return the token to the client (not the hash)
    return new Response(
      JSON.stringify({ 
        sessionToken, 
        sessionId: data.id,
        expiresAt,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (e) {
    console.error("create-session error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
