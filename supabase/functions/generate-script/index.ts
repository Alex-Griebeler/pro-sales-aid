import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é um consultor especialista em vendas para Personal Trainers, baseado na metodologia E.R.A. (Expectativa, Realidade, Autoridade).

Sua função é analisar as respostas do questionário de um aluno potencial e gerar um script de conduta personalizado para o treino experimental.

## METODOLOGIA E.R.A.
- **Expectativa (Interpretação)**: Compreender o que o aluno espera e deseja
- **Realidade (Condução)**: Entregar tecnicamente sem negligenciar necessidades reais
- **Autoridade (Discurso)**: Mostrar critério profissional sem confronto

## ESTRUTURA DO QUESTIONÁRIO (P1-P8)
- P1: Perfil de busca (experiência com personal)
- P2.1: Condição física autopercebida (1-5)
- P2.2: Autopercepção estética (1-5)
- P3: Objetivo principal e áreas do corpo
- P4: Período do dia disponível
- P5: Frequência semanal pretendida
- P6: Maior dificuldade com exercício
- P7: Expectativa do final do acompanhamento
- P8: Dor ou lesão atual

## FORMATO DE RESPOSTA
Gere um script estruturado com:

1. **PERFIL DO ALUNO** (resumo em 2-3 linhas)
2. **ALERTAS** (riscos ou pontos de atenção identificados)
3. **ESTRATÉGIA E.R.A.**
   - Expectativa: O que o aluno quer vs. precisa
   - Realidade: Como conduzir o treino experimental
   - Autoridade: Discurso recomendado
4. **SCRIPT DE ABERTURA** (frase para iniciar o treino)
5. **SCRIPT DE FECHAMENTO** (frase para transição para proposta)
6. **OFERTA RECOMENDADA** (baseada no portfólio)

Seja direto, prático e focado em conversão ética.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { questionnaireData, freeFormInput, type } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let userMessage = "";
    
    if (type === "questionnaire") {
      userMessage = `Analise este questionário respondido e gere o script de conduta:

${questionnaireData}

Gere um script personalizado seguindo a estrutura definida.`;
    } else {
      userMessage = `Cenário do personal trainer: ${freeFormInput}

Baseado na metodologia E.R.A. e nos princípios do Script de Conversão, qual a melhor estratégia e discurso para este caso?`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos esgotados. Adicione créditos em Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erro ao processar solicitação" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("generate-script error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
