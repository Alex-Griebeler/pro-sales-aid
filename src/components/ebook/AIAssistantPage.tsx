import { useState } from 'react';
import { Sparkles, Bot, Loader2 } from 'lucide-react';
import { EbookSection } from '@/types/ebook';

interface AIAssistantPageProps {
  section: EbookSection;
}

const AIAssistantPage = ({ section }: AIAssistantPageProps) => {
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAskIA = async () => {
    if (!aiInput.trim()) return;
    
    setLoading(true);
    setError("");
    
    // Note: This requires Lovable Cloud to be set up with proper API key management
    // For now, showing a placeholder response
    setTimeout(() => {
      setAiResponse("Para utilizar a IA, conecte o Lovable Cloud e configure a integração com a API. Isso permitirá gerar scripts personalizados baseados no Manual de Conversão.");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="space-y-3">
        <h2 className="text-4xl font-bold tracking-tight flex items-center gap-3 text-foreground">
          {section.title}
        </h2>
        <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">{section.content}</p>
      </header>

      <div className="bg-surface border border-border rounded-lg p-6 space-y-4 shadow-inner">
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Descreva o cenário do aluno
          </label>
          <textarea 
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="Ex: Aluno de 45 anos com dor no ombro diz que está caro. O que dizer?"
            className="w-full bg-card border border-border rounded-lg p-4 text-sm focus:outline-none focus:border-accent h-32 resize-none transition-all text-foreground placeholder:text-muted-foreground"
          />
        </div>
        
        <button 
          onClick={handleAskIA}
          disabled={loading || !aiInput.trim()}
          className="w-full bg-primary text-primary-foreground py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-accent transition-all disabled:opacity-50 font-semibold"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Gerar Script ✨
        </button>
        {error && <p className="text-destructive text-xs text-center">{error}</p>}
      </div>

      {aiResponse && (
        <div className="p-6 border-l-4 border-accent bg-surface rounded-r-lg animate-fade-in">
          <div className="flex items-center gap-2 mb-4 text-accent">
            <Bot className="w-5 h-5" />
            <span className="font-bold text-xs uppercase tracking-widest text-foreground">Estratégia Recomendada</span>
          </div>
          <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {aiResponse}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistantPage;
