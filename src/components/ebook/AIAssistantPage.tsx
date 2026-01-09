import { useState, useRef } from 'react';
import { Sparkles, Cpu, Loader2, Lightbulb, Upload, FileText, X, ClipboardList } from 'lucide-react';
import { EbookSection } from '@/types/ebook';
import { toast } from 'sonner';
import AIResponseRenderer from './AIResponseRenderer';

interface AIAssistantPageProps {
  section: EbookSection;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-script`;

const AIAssistantPage = ({ section }: AIAssistantPageProps) => {
  const [aiInput, setAiInput] = useState("");
  const [questionnaireText, setQuestionnaireText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<'scenario' | 'questionnaire'>('scenario');
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseSSEStream = async (
    response: Response,
    onDelta: (text: string) => void,
    onDone: () => void
  ) => {
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No reader available");

    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
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
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    onDone();
  };

  const handleGenerate = async () => {
    const input = mode === 'questionnaire' ? questionnaireText : aiInput;
    if (!input.trim()) {
      toast.error(mode === 'questionnaire' ? "Cole ou faça upload do questionário" : "Descreva o cenário");
      return;
    }

    setLoading(true);
    setError("");
    setAiResponse("");

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(
          mode === 'questionnaire'
            ? { questionnaireData: questionnaireText, type: "questionnaire" }
            : { freeFormInput: aiInput, type: "scenario" }
        ),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao gerar script");
      }

      let fullResponse = "";
      await parseSSEStream(
        response,
        (chunk) => {
          fullResponse += chunk;
          setAiResponse(fullResponse);
        },
        () => {
          setLoading(false);
        }
      );
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Erro desconhecido");
      setLoading(false);
      toast.error("Erro ao gerar script");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);

    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const text = await file.text();
      setQuestionnaireText(text);
      toast.success("Arquivo carregado!");
    } else if (file.type === "application/pdf") {
      toast.info("PDF detectado. Por favor, copie o texto do questionário e cole no campo abaixo.");
      setQuestionnaireText("");
    } else {
      const text = await file.text();
      setQuestionnaireText(text);
      toast.success("Arquivo carregado!");
    }
  };

  const handleExampleClick = (example: string) => {
    setMode('scenario');
    setAiInput(example);
  };

  const clearQuestionnaire = () => {
    setQuestionnaireText("");
    setUploadedFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6 animate-fade-in overflow-y-auto max-h-[580px] pr-4 scrollbar-thin">
      <header className="space-y-3">
        <h2 className="text-headline text-foreground">
          {section.title}
        </h2>
        <p className="text-body text-muted-foreground max-w-2xl">{section.content}</p>
      </header>

      {/* Mode Tabs */}
      <div className="flex gap-1 p-1 bg-muted/50 rounded-full w-fit">
        <button
          onClick={() => setMode('scenario')}
          className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
            mode === 'scenario'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 inline mr-2" strokeWidth={1.5} />
          Cenário
        </button>
        <button
          onClick={() => setMode('questionnaire')}
          className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
            mode === 'questionnaire'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="w-3.5 h-3.5 inline mr-2" strokeWidth={1.5} />
          Questionário
        </button>
      </div>

      {mode === 'scenario' && (
        <>
          {section.aiExamples && section.aiExamples.length > 0 && (
            <div className="space-y-3">
              <span className="text-caption text-muted-foreground uppercase tracking-wider">
                Exemplos
              </span>
              <div className="flex flex-wrap gap-2">
                {section.aiExamples.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => handleExampleClick(example)}
                    className="px-4 py-2 text-sm bg-muted/50 rounded-full hover:bg-muted transition-all text-foreground/80 hover:text-foreground"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <textarea
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Ex: Aluno de 45 anos com dor no ombro diz que está caro. O que dizer?"
              className="w-full bg-muted/30 border-0 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 h-28 resize-none transition-all text-foreground placeholder:text-muted-foreground"
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !aiInput.trim()}
              className="w-full bg-foreground text-background py-3.5 rounded-full flex items-center justify-center gap-2 hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-40 font-medium text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} /> : <Sparkles className="w-4 h-4" strokeWidth={1.5} />}
              Gerar Estratégia
            </button>
          </div>
        </>
      )}

      {mode === 'questionnaire' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-caption text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <ClipboardList className="w-3.5 h-3.5" strokeWidth={1.5} />
                Questionário do Aluno (P1-P8)
              </span>
              {uploadedFileName && (
                <button onClick={clearQuestionnaire} className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1">
                  <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {uploadedFileName}
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.csv"
                onChange={handleFileUpload}
                className="hidden"
                id="questionnaire-upload"
              />
              <label
                htmlFor="questionnaire-upload"
                className="flex items-center gap-2 px-4 py-2 text-sm bg-muted/50 rounded-full cursor-pointer hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
              >
                <Upload className="w-3.5 h-3.5" strokeWidth={1.5} />
                Upload .txt
              </label>
            </div>

            <textarea
              value={questionnaireText}
              onChange={(e) => setQuestionnaireText(e.target.value)}
              placeholder={`Cole aqui as respostas do questionário do aluno. Exemplo:

P1 - Perfil de busca: Já treinei com personal, mas busco algo mais organizado
P2.1 - Condição física (1-5): 3
P2.2 - Autopercepção estética (1-5): 2
P3 - Objetivo: Emagrecer e ganhar definição
P4 - Período: Manhã (7h-9h)
P5 - Frequência: 4x por semana
P6 - Dificuldade: Falta de regularidade
P7 - Expectativa: Ter um corpo definido em 6 meses
P8 - Dor/Lesão: Dor lombar ocasional`}
              className="w-full bg-muted/30 border-0 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 h-44 resize-none transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !questionnaireText.trim()}
            className="w-full bg-accent text-accent-foreground py-3.5 rounded-full flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition-all disabled:opacity-40 font-medium text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} /> : <FileText className="w-4 h-4" strokeWidth={1.5} />}
            Gerar Script Completo
          </button>
        </div>
      )}

      {error && <p className="text-destructive text-sm text-center">{error}</p>}

      {aiResponse && (
        <div className="space-y-4 animate-fade-in pt-2">
          <div className="flex items-center gap-2.5 text-accent">
            <Cpu className="w-4 h-4" strokeWidth={1.5} />
            <span className="font-semibold text-caption uppercase tracking-wider">
              {mode === 'questionnaire' ? 'Script Personalizado' : 'Estratégia'}
            </span>
          </div>
          <AIResponseRenderer response={aiResponse} />
        </div>
      )}
    </div>
  );
};

export default AIAssistantPage;
