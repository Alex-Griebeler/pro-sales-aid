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
                  text: `Extraia todas as perguntas e respostas deste questionário PDF. 
Formate a saída de forma clara, identificando cada pergunta (P1, P2.1, P2.2, P3, P4, P5, P6, P7, P8) e sua respectiva resposta.
Se não encontrar as perguntas numeradas, identifique o conteúdo relevante sobre:
- Perfil de busca
- Condição física
- Autopercepção/satisfação corporal
- Objetivo
- Período do dia
- Frequência semanal
- Maior dificuldade
- Expectativa de resultado
- Dor ou lesão

Retorne APENAS o texto extraído formatado, sem explicações adicionais.`
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
