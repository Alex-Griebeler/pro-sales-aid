import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const googleFormsUrl = formData.get("googleFormsUrl") as string | null;

    let extractedText = "";

    if (file && file.type === "application/pdf") {
      // Convert PDF to base64 and use AI to extract text
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
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
