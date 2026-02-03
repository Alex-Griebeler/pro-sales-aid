import { useState, useEffect } from 'react';
import { History, ArrowLeft, FileText, Lightbulb, Star, ChevronDown, ChevronUp, Loader2, Clock, RefreshCw } from 'lucide-react';
import { EbookSection } from '@/types/ebook';
import AIResponseRenderer from './AIResponseRenderer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConsultationHistoryPageProps {
  section: EbookSection;
  onBack?: () => void;
}

interface Consultation {
  id: string;
  input_type: string;
  input_text: string;
  ai_response: string;
  source_filename: string | null;
  detected_format: string | null;
  quality_rating: number | null;
  created_at: string;
}

interface SessionData {
  sessionToken: string;
  sessionId: string;
  expiresAt: string;
}

const LIST_CONSULTATIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/list-consultations`;

const ConsultationHistoryPage = ({ section, onBack }: ConsultationHistoryPageProps) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchConsultations = async () => {
    setLoading(true);
    setError(null);

    try {
      const storageKey = 'ai_consultation_session';
      const storedSession = localStorage.getItem(storageKey);
      
      if (!storedSession) {
        setError("Nenhuma sessão ativa. Gere uma consulta primeiro.");
        setLoading(false);
        return;
      }

      const sessionData: SessionData = JSON.parse(storedSession);

      const response = await fetch(LIST_CONSULTATIONS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ sessionToken: sessionData.sessionToken }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao carregar histórico");
      }

      const data = await response.json();
      setConsultations(data.consultations || []);
    } catch (e) {
      console.error("Error fetching consultations:", e);
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getInputPreview = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const getResponsePreview = (text: string, maxLength = 150) => {
    // Remove markdown formatting for preview
    const cleanText = text
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/\n/g, ' ')
      .trim();
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in overflow-y-auto max-h-[calc(100dvh-180px)] sm:max-h-[580px] pr-2 sm:pr-4 scrollbar-thin">
      {/* Header */}
      <header className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </button>
          )}
          <div className="flex-1">
            <h2 className="text-xl sm:text-headline text-foreground flex items-center gap-2">
              <History className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
              Histórico de Consultas
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Consultas da sessão atual
            </p>
          </div>
          <button
            onClick={fetchConsultations}
            disabled={loading}
            className="p-2 rounded-full hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Atualizar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground">Carregando histórico...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-destructive/10 text-destructive rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && consultations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <History className="w-12 h-12 text-muted-foreground/50" strokeWidth={1} />
          <p className="text-muted-foreground">Nenhuma consulta realizada ainda.</p>
          {onBack && (
            <button
              onClick={onBack}
              className="text-sm text-accent hover:underline"
            >
              Fazer primeira consulta
            </button>
          )}
        </div>
      )}

      {/* Consultations List */}
      {!loading && !error && consultations.length > 0 && (
        <div className="space-y-3">
          {consultations.map((consultation) => (
            <div
              key={consultation.id}
              className="bg-muted/30 rounded-xl overflow-hidden transition-all"
            >
              {/* Collapsed View */}
              <button
                onClick={() => toggleExpand(consultation.id)}
                className="w-full p-3 sm:p-4 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`p-2 rounded-lg shrink-0 ${
                    consultation.input_type === 'questionnaire' 
                      ? 'bg-accent/10 text-accent' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {consultation.input_type === 'questionnaire' 
                      ? <FileText className="w-4 h-4" strokeWidth={1.5} />
                      : <Lightbulb className="w-4 h-4" strokeWidth={1.5} />
                    }
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {consultation.input_type === 'questionnaire' ? 'Questionário' : 'Cenário'}
                      </span>
                      {consultation.source_filename && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full truncate max-w-[120px]">
                          {consultation.source_filename}
                        </span>
                      )}
                      {consultation.quality_rating && (
                        <span className="flex items-center gap-0.5 text-xs text-amber-500">
                          <Star className="w-3 h-3 fill-current" />
                          {consultation.quality_rating}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-foreground line-clamp-2">
                      {getInputPreview(consultation.input_text)}
                    </p>
                    
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" strokeWidth={1.5} />
                      {format(new Date(consultation.created_at), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <div className="shrink-0 p-1">
                    {expandedId === consultation.id 
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                    }
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              {expandedId === consultation.id && (
                <div className="border-t border-border p-3 sm:p-4 space-y-4 animate-fade-in">
                  {/* Input */}
                  <div className="space-y-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Entrada
                    </span>
                    <div className="bg-background/50 rounded-lg p-3 text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {consultation.input_text}
                    </div>
                  </div>

                  {/* Response */}
                  <div className="space-y-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Resposta da IA
                    </span>
                    <div className="bg-background/50 rounded-lg p-3 max-h-96 overflow-y-auto">
                      <AIResponseRenderer response={consultation.ai_response} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultationHistoryPage;
