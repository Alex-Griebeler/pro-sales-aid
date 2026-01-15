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

// Validate input text length
const MAX_INPUT_LENGTH = 50000; // 50KB max

const SYSTEM_PROMPT = `Você é um consultor direto e prático de vendas para Personal Trainers, especialista na metodologia E.R.A.

## SUA FUNÇÃO
Analisar o cenário/questionário e entregar um PLANO DE AÇÃO EXECUTÁVEL para o treino experimental.

## PRINCÍPIOS INEGOCIÁVEIS
1. **Nunca confronte** - Valide primeiro, redirecione depois
2. **Objeção é sintoma** - Trate a causa (insegurança, desconfiança, falta de percepção de valor)
3. **Autoridade vem da técnica** - Mostre critério, não argumente
4. **Conversão é consequência** - Foque na experiência, não na venda

## INTERPRETAÇÃO DE QUESTIONÁRIO (quando aplicável)
Ao receber respostas de questionário (P1-P8, FABRIK ou outros formatos), interprete:

**DADOS BÁSICOS:**
- **Frequência/tempo disponível** → Define intensidade e formato do plano
- **Objetivo declarado** → Ancora todo o discurso e a experiência
- **Experiência prévia** → Calibra nível técnico e vocabulário
- **Limitações físicas/saúde** → Define cuidados e demonstra autoridade
- **Expectativas de resultado** → Identifica gaps de realidade a alinhar

**DADOS DEMOGRÁFICOS (se disponíveis):**
- **Idade** → Ajusta linguagem, ritmo e exemplos (60+ anos = mais pausado, referências de saúde)
- **Profissão** → Indica perfil decisório (engenheiro = analítico, valoriza dados; autônomo = flexibilidade)

**CONTEXTO COMERCIAL (se disponível):**
- **Como conheceu** → Canal de aquisição influencia expectativas (indicação = já confia; Instagram = precisa validar)
- **Prioridade qualidade vs preço** → ANTECIPA OBJEÇÃO DE VALOR (se marcou "preço", prepare resposta)
- **Proximidade/localização** → Pode ser barreira logística a endereçar

**SAÚDE DETALHADA / PAR-Q (se disponível):**
- **PAR-Q positivo em qualquer item** → OPORTUNIDADE DE AUTORIDADE: demonstre conhecimento técnico
- **Múltiplas condições** → Reforce segurança e acompanhamento individualizado
- **Lesões/cirurgias** → Mencione adaptações específicas durante o experimental

**EXPECTATIVAS TEMPORAIS (se disponível):**
- **Prazo curto (3 meses)** → Pode indicar expectativa irreal - alinhe com realidade gentilmente
- **Prazo longo (12+ meses)** → Cliente mais paciente, foque em processo não resultado imediato

## ESTRUTURA DE RESPOSTA (seja DIRETO)

### 🎯 DIAGNÓSTICO RÁPIDO
[2-3 linhas: perfil + principal barreira identificada]

### ⚠️ ALERTA DE OBJEÇÃO
[Se houver objeção previsível, liste qual e a CAUSA RAIZ]
- **Objeção provável:** [ex: "Está caro"]
- **Causa real:** [ex: Não percebeu valor / Comparou com box / Medo de compromisso]
- **Estratégia de quebra:** [resposta técnica, não argumentativa]

### 📋 PLANO DA SESSÃO EXPERIMENTAL

**ABERTURA (primeiros 2 min)**
> [Frase exata para usar - valide expectativa]

**DURANTE O TREINO**
- [ ] [Ação técnica específica 1]
- [ ] [Ação técnica específica 2]
- [ ] [Momento de mostrar autoridade - como]

**TRANSIÇÃO PARA PROPOSTA (últimos 5 min)**
> [Frase exata - conecte resultado à continuidade]

### 💼 OFERTA RECOMENDADA
**REGRA CRÍTICA:** SÓ inclua esta seção se houver dados concretos que justifiquem a recomendação.
Exemplos de dados que habilitam oferta:
- Tempo disponível limitado → Treinos time-efficient ou menor frequência
- Objetivo específico de emagrecimento → Pacote com acompanhamento nutricional
- Orçamento mencionado → Adequar produto ao ticket
- Preferência por treinar em dupla → Oferecer formato duo

Se NÃO houver informação suficiente para recomendar um produto específico, OMITA COMPLETAMENTE esta seção.

Quando houver dados:
- **Produto principal:** [do portfólio, com justificativa baseada nos dados]
- **Alternativa (se resistência):** [opção de entrada]
- **Frase de fechamento:** [direta, sem pressão]

### 🚫 O QUE NÃO FAZER
- [Erro comum a evitar neste perfil]

## REGRAS DE FORMATAÇÃO
- Use emojis como marcadores visuais
- Frases entre aspas são SCRIPTS PRONTOS para usar
- Seja telegráfico, não prolixo
- Cada seção em no máximo 3-4 linhas
- NUNCA invente dados que não foram fornecidos`;

// Helper to collect full response from SSE stream
async function collectStreamResponse(response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("No reader available");

  const decoder = new TextDecoder();
  let textBuffer = "";
  let fullContent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") break;

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) fullContent += content;
      } catch {
        // Incomplete JSON, skip
      }
    }
  }

  return fullContent;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { questionnaireData, freeFormInput, type, sessionId, sourceFilename, detectedFormat } = await req.json();
    
    // Validate session ID
    if (!isValidSessionId(sessionId)) {
      return new Response(
        JSON.stringify({ error: "Sessão inválida. Recarregue a página." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const inputType = type === "questionnaire" ? "questionnaire" : "scenario";
    const inputText = type === "questionnaire" ? questionnaireData : freeFormInput;

    // Validate input length
    if (!inputText || typeof inputText !== 'string') {
      return new Response(
        JSON.stringify({ error: "Texto de entrada é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (inputText.length > MAX_INPUT_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Texto muito longo. Máximo ${MAX_INPUT_LENGTH} caracteres.` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos esgotados. Adicione créditos em Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erro ao processar solicitação" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Clone response to both stream to client AND collect for DB
    const [streamForClient, streamForDB] = aiResponse.body!.tee();

    // Save to database in background (non-blocking) using service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (supabaseUrl && supabaseKey && sessionId) {
      // Process in background without blocking the stream
      (async () => {
        try {
          const fullResponse = await collectStreamResponse(new Response(streamForDB));
          
          const supabase = createClient(supabaseUrl, supabaseKey);
          
          const { data, error } = await supabase
            .from("ai_consultations")
            .insert({
              session_id: sessionId,
              input_type: inputType,
              input_text: inputText,
              source_filename: sourceFilename || null,
              detected_format: detectedFormat || null,
              ai_response: fullResponse,
            })
            .select("id")
            .single();

          if (error) {
            console.error("Error saving consultation:", error);
          } else {
            console.log("Consultation saved:", data.id);
          }
        } catch (e) {
          console.error("Background save error:", e);
        }
      })();
    }

    // Return stream immediately
    return new Response(streamForClient, {
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