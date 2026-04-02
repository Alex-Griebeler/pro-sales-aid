import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

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
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const googleFormsUrl = formData.get("googleFormsUrl") as string | null;
    const sessionToken = formData.get("sessionToken") as string | null;

    // Validate session token format
    if (!sessionToken || !isValidUUID(sessionToken)) {
      return new Response(
        JSON.stringify({ error: "Sessão inválida. Recarregue a página." }),
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

    // Validate session token server-side
    const sessionHash = await hashToken(sessionToken);

    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .select('id, user_id, expires_at')
      .eq('session_hash', sessionHash)
      .single();

    if (sessionError || !sessionData) {
      return new Response(
        JSON.stringify({ error: "Sessão não encontrada. Recarregue a página." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (new Date(sessionData.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: "Sessão expirada. Recarregue a página." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (sessionData.user_id !== userId) {
      return new Response(
        JSON.stringify({ error: "Sessão não pertence ao usuário autenticado." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let extractedText = "";

    if (file && file.type === "application/pdf") {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return new Response(
          JSON.stringify({ error: "Arquivo muito grande. Máximo 5MB." }),
          { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Convert PDF to base64 using chunked approach (avoids stack overflow)
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = "";
      const chunkSize = 8192;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode(...chunk);
      }
      const base64 = btoa(binary);
      
      const apiKey = Deno.env.get("LOVABLE_API_KEY");
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: "API key not configured" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Use Gemini to extract text from PDF
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analise este questionário de avaliação para Personal Trainer e extraia TODAS as informações disponíveis.

PRIMEIRO: Identifique o TIPO de questionário (P1-P8 padrão, FABRIK, ou outro formato).

DEPOIS: Extraia as informações organizadas nas seguintes CATEGORIAS (omita categorias que não existirem no documento):

## IDENTIFICAÇÃO
Nome, idade, profissão, contato, gênero

## CONTEXTO COMERCIAL
Como conheceu o personal, proximidade/localização, prioridade entre qualidade e preço

## EXPERIÊNCIA PRÉVIA
Já treinou com personal antes, onde treina atualmente, frequência anterior, tempo que pratica exercícios

## AUTOAVALIAÇÃO
Notas de condição física (escala 1-5), satisfação corporal (escala 1-5), como se sente em relação ao corpo

## OBJETIVOS
Objetivo principal, partes do corpo em foco, resultado específico esperado, motivação

## LOGÍSTICA
Período preferido para treino, frequência semanal desejada, disponibilidade de dias, local preferido

## DIFICULDADES
Maior obstáculo para se exercitar, dificuldades anteriores, o que fez desistir antes

## SAÚDE / PAR-Q
TODAS as respostas sobre saúde: problemas cardíacos, pressão arterial, dores, tonturas, medicamentos, condições que limitam atividade física, lesões, cirurgias, alergias, restrições médicas

## EXPECTATIVAS
Prazo esperado para resultados (3 meses, 6 meses, etc.), o que espera alcançar, expectativas sobre o serviço

REGRAS IMPORTANTES:
- Se uma resposta não estiver clara ou não foi marcada no formulário, indique: [NÃO IDENTIFICADO]
- Se for uma escala (1-5) e a marcação não estiver visível, indique: [ESCALA NÃO VISÍVEL]
- NÃO invente dados que não existem no documento
- Extraia números, datas e valores exatamente como aparecem
- Mantenha o formato organizado por categorias

Retorne APENAS a extração formatada, sem explicações adicionais.`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:application/pdf;base64,${base64}`
                  }
                }
              ]
            }
          ],
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI extraction error:", errorText);
        return new Response(
          JSON.stringify({ error: "Erro ao processar PDF. Tente copiar o texto manualmente." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      extractedText = data.choices?.[0]?.message?.content || "";
    } else if (googleFormsUrl) {
      // For Google Forms, we provide guidance since direct scraping is limited
      // The user needs to export responses or copy them
      return new Response(
        JSON.stringify({ 
          error: "Para questionários do Google Forms, exporte as respostas como CSV ou copie o texto diretamente.",
          hint: "Vá em 'Respostas' > 'Criar planilha' e exporte como CSV, ou copie as respostas individuais."
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Nenhum arquivo ou URL fornecido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ text: extractedText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing questionnaire:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao processar arquivo" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
