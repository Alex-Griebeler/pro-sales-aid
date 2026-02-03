import { useState, useRef, useEffect, useMemo } from 'react';
import { Sparkles, Cpu, Loader2, Lightbulb, Upload, FileText, X, ClipboardList, Link2, FileUp, RotateCcw, List, ArrowRight, History } from 'lucide-react';
import { EbookSection } from '@/types/ebook';
import { toast } from 'sonner';
import AIResponseRenderer from './AIResponseRenderer';
import RatingComponent from './RatingComponent';
import ConsultationHistoryPage from './ConsultationHistoryPage';
import { sections } from '@/data/ebookSections';

interface AIAssistantPageProps {
  section: EbookSection;
  onNavigate?: (page: number) => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-script`;
const PARSE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-questionnaire`;
const GET_CONSULTATION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-consultation`;
const CREATE_SESSION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-session`;

interface SessionData {
  sessionToken: string;
  sessionId: string;
  expiresAt: string;
}

// Get or create a persistent session using server-side validation
const getOrCreateSession = async (): Promise<SessionData | null> => {
  const storageKey = 'ai_consultation_session';
  // Clear old sessions from before migration (version key check)
  const versionKey = 'ai_session_version';
  const currentVersion = '2'; // Increment this when session schema changes
  
  if (localStorage.getItem(versionKey) !== currentVersion) {
    localStorage.removeItem(storageKey);
    localStorage.setItem(versionKey, currentVersion);
  }
  
  const storedSession = localStorage.getItem(storageKey);
  
  // Check if we have a valid stored session
  if (storedSession) {
    try {
      const parsed = JSON.parse(storedSession) as SessionData;
      // Check if session is not expired (with 1 hour buffer)
      if (new Date(parsed.expiresAt) > new Date(Date.now() + 60 * 60 * 1000)) {
        return parsed;
      }
    } catch {
      // Invalid stored session, will create new one
    }
  }
  
  // Create new server-side session
  try {
    const response = await fetch(CREATE_SESSION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to create session');
      return null;
    }

    const sessionData = await response.json() as SessionData;
    localStorage.setItem(storageKey, JSON.stringify(sessionData));
    return sessionData;
  } catch (e) {
    console.error('Error creating session:', e);
    return null;
  }
};

const AIAssistantPage = ({ section, onNavigate }: AIAssistantPageProps) => {
  const [aiInput, setAiInput] = useState("");
  const [questionnaireText, setQuestionnaireText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsingPdf, setParsingPdf] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<'scenario' | 'questionnaire'>('scenario');
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [googleFormsUrl, setGoogleFormsUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initSession = async () => {
      setSessionLoading(true);
      const session = await getOrCreateSession();
      setSessionData(session);
      setSessionLoading(false);
    };
    initSession();
  }, []);

  // If showing history, render history page
  if (showHistory) {
    return (
      <ConsultationHistoryPage 
        section={section} 
        onBack={() => setShowHistory(false)} 
      />
    );
  }

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

    if (!sessionData) {
      toast.error("Sessão não inicializada. Tente recarregar a página.");
      return;
    }

    setLoading(true);
    setError("");
    setAiResponse("");
    setConsultationId(null);

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(
          mode === 'questionnaire'
            ? { 
                questionnaireData: questionnaireText, 
                type: "questionnaire",
                sessionToken: sessionData.sessionToken,
                sourceFilename: uploadedFileName || null,
              }
            : { 
                freeFormInput: aiInput, 
                type: "scenario",
                sessionToken: sessionData.sessionToken,
              }
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
          // After stream completes, fetch the consultation ID via Edge Function
          fetchLatestConsultationId();
        }
      );
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Erro desconhecido");
      setLoading(false);
      toast.error("Erro ao gerar script");
    }
  };

  const fetchLatestConsultationId = async () => {
    if (!sessionData) return;
    
    try {
      // Small delay to ensure DB save completes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch(GET_CONSULTATION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ sessionToken: sessionData.sessionToken }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.consultation_id) {
          setConsultationId(data.consultation_id);
        }
      }
    } catch (e) {
      console.error('Error fetching consultation ID:', e);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check session before processing
    if (!sessionData?.sessionToken) {
      toast.error("Sessão não inicializada. Aguarde ou recarregue a página.");
      return;
    }

    setUploadedFileName(file.name);

    // Handle text files directly
    if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".csv") || file.name.endsWith(".md")) {
      const text = await file.text();
      setQuestionnaireText(text);
      toast.success("Arquivo carregado!");
      return;
    }

    // Handle PDF files
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      // Check file size client-side
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Arquivo muito grande. Máximo 5MB.");
        return;
      }

      setParsingPdf(true);
      toast.info("Processando PDF com IA...");

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("sessionToken", sessionData.sessionToken);

        const response = await fetch(PARSE_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erro ao processar PDF");
        }

        if (data.text) {
          setQuestionnaireText(data.text);
          toast.success("PDF processado com sucesso!");
        } else {
          throw new Error("Nenhum texto extraído do PDF");
        }
      } catch (e) {
        console.error("PDF parsing error:", e);
        toast.error(e instanceof Error ? e.message : "Erro ao processar PDF. Copie o texto manualmente.");
        setQuestionnaireText("");
      } finally {
        setParsingPdf(false);
      }
      return;
    }

    // Try to read as text for other file types
    try {
      const text = await file.text();
      setQuestionnaireText(text);
      toast.success("Arquivo carregado!");
    } catch {
      toast.error("Não foi possível ler este arquivo");
    }
  };

  const handleGoogleFormsUrl = () => {
    if (!googleFormsUrl.trim()) {
      toast.error("Cole o link do Google Forms");
      return;
    }

    // Validate Google Forms URL
    if (!googleFormsUrl.includes("docs.google.com/forms") && !googleFormsUrl.includes("forms.gle")) {
      toast.error("URL inválida. Use um link do Google Forms.");
      return;
    }

    toast.info(
      "Para questionários do Google Forms, exporte as respostas como CSV ou copie o texto diretamente. Vá em 'Respostas' > 'Criar planilha' e exporte como CSV.",
      { duration: 8000 }
    );
    setShowUrlInput(false);
  };

  const handleExampleClick = (example: string) => {
    setMode('scenario');
    setAiInput(example);
  };

  const clearQuestionnaire = () => {
    setQuestionnaireText("");
    setUploadedFileName("");
    setGoogleFormsUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in overflow-y-auto max-h-[calc(100dvh-180px)] sm:max-h-[580px] pr-2 sm:pr-4 scrollbar-thin">
      <header className="space-y-2 sm:space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h2 className="text-xl sm:text-headline text-foreground">
              {section.title}
            </h2>
            <p className="text-sm sm:text-body text-muted-foreground max-w-2xl mt-1">{section.content}</p>
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="shrink-0 p-2.5 rounded-full bg-muted/50 hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Ver histórico de consultas"
            title="Ver histórico de consultas"
          >
            <History className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Mode Tabs */}
      <div className="flex gap-0.5 sm:gap-1 p-1 bg-muted/50 rounded-full w-full sm:w-fit">
        <button
          onClick={() => setMode('scenario')}
          className={`flex-1 sm:flex-none px-3 sm:px-5 py-2.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all min-h-[44px] sm:min-h-0 ${
            mode === 'scenario'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 inline mr-1.5 sm:mr-2" strokeWidth={1.5} />
          Cenário
        </button>
        <button
          onClick={() => setMode('questionnaire')}
          className={`flex-1 sm:flex-none px-3 sm:px-5 py-2.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all min-h-[44px] sm:min-h-0 ${
            mode === 'questionnaire'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="w-3.5 h-3.5 inline mr-1.5 sm:mr-2" strokeWidth={1.5} />
          Questionário
        </button>
      </div>

      {mode === 'scenario' && (
        <>
          {section.aiExamples && section.aiExamples.length > 0 && (
            <div className="space-y-2 sm:space-y-3">
              <span className="text-[10px] sm:text-caption text-muted-foreground uppercase tracking-wider">
                Exemplos
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {section.aiExamples.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => handleExampleClick(example)}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-muted/50 rounded-full hover:bg-muted active:bg-muted/70 transition-all text-foreground/80 hover:text-foreground min-h-[40px]"
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
              className="w-full bg-muted/30 border-0 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 h-24 sm:h-28 resize-none transition-all text-foreground placeholder:text-muted-foreground"
              maxLength={50000}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !aiInput.trim()}
              className="w-full bg-foreground text-background py-3.5 rounded-full flex items-center justify-center gap-2 hover:bg-accent hover:text-accent-foreground active:scale-[0.98] transition-all disabled:opacity-40 font-medium text-sm min-h-[48px]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} /> : <Sparkles className="w-4 h-4" strokeWidth={1.5} />}
              Gerar Estratégia
            </button>
          </div>
        </>
      )}

      {mode === 'questionnaire' && (
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10px] sm:text-caption text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                <ClipboardList className="w-3.5 h-3.5" strokeWidth={1.5} />
                Questionário do Aluno (P1-P8)
              </span>
              {uploadedFileName && (
                <button onClick={clearQuestionnaire} className="text-xs sm:text-sm text-muted-foreground hover:text-destructive flex items-center gap-1 min-h-[36px]">
                  <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span className="truncate max-w-[120px]">{uploadedFileName}</span>
                </button>
              )}
            </div>

            {/* Upload Options */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.csv,.pdf,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="questionnaire-upload"
                disabled={parsingPdf || sessionLoading || !sessionData}
              />
              <label
                htmlFor="questionnaire-upload"
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-muted/50 rounded-full cursor-pointer hover:bg-muted active:bg-muted/70 transition-all text-muted-foreground hover:text-foreground min-h-[40px] ${(parsingPdf || sessionLoading || !sessionData) ? 'opacity-50 cursor-wait' : ''}`}
              >
                {parsingPdf ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.5} />
                ) : (
                  <FileUp className="w-3.5 h-3.5" strokeWidth={1.5} />
                )}
                {parsingPdf ? 'Processando...' : 'Upload PDF / TXT'}
              </label>

              <button
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-muted/50 rounded-full hover:bg-muted active:bg-muted/70 transition-all text-muted-foreground hover:text-foreground min-h-[40px]"
              >
                <Link2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                Google Forms
              </button>
            </div>

            {/* Google Forms URL Input */}
            {showUrlInput && (
              <div className="flex flex-col sm:flex-row gap-2 animate-fade-in">
                <input
                  type="url"
                  value={googleFormsUrl}
                  onChange={(e) => setGoogleFormsUrl(e.target.value)}
                  placeholder="Cole o link do Google Forms..."
                  className="flex-1 bg-muted/30 border-0 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-foreground placeholder:text-muted-foreground min-h-[44px]"
                />
                <button
                  onClick={handleGoogleFormsUrl}
                  className="px-4 py-2.5 text-sm bg-accent text-accent-foreground rounded-full hover:bg-accent/80 active:scale-[0.98] transition-all font-medium min-h-[44px]"
                >
                  Importar
                </button>
              </div>
            )}

            <textarea
              value={questionnaireText}
              onChange={(e) => setQuestionnaireText(e.target.value)}
              placeholder={`Cole aqui as respostas do questionário do aluno...`}
              className="w-full bg-muted/30 border-0 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 h-36 sm:h-44 resize-none transition-all text-foreground placeholder:text-muted-foreground"
              disabled={parsingPdf}
              maxLength={50000}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !questionnaireText.trim() || parsingPdf}
            className="w-full bg-accent text-accent-foreground py-3.5 rounded-full flex items-center justify-center gap-2 hover:bg-foreground hover:text-background active:scale-[0.98] transition-all disabled:opacity-40 font-medium text-sm min-h-[48px]"
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
          
          {/* Rating Component - appears after response and when not loading */}
          {!loading && consultationId && sessionData && (
            <RatingComponent consultationId={consultationId} sessionToken={sessionData.sessionToken} />
          )}

          {/* Next Steps CTAs - appears after response is complete */}
          {!loading && onNavigate && (
            <div className="pt-6 space-y-3 border-t border-border mt-6">
              <span className="text-caption text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                Próximos Passos
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setAiResponse("");
                    setAiInput("");
                    setQuestionnaireText("");
                    setConsultationId(null);
                    setUploadedFileName("");
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm bg-muted/50 rounded-full hover:bg-muted transition-all text-foreground"
                >
                  <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Nova Consulta
                </button>
                <button
                  onClick={() => onNavigate(sections.findIndex(s => s.id === 'sumario'))}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm bg-muted/50 rounded-full hover:bg-muted transition-all text-foreground"
                >
                  <List className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Ver Sumário
                </button>
                <button
                  onClick={() => onNavigate(0)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm bg-muted/50 rounded-full hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
                >
                  Voltar ao Início
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAssistantPage;