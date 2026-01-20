import { CheckCircle, ArrowRight, RotateCcw, List, Sparkles } from 'lucide-react';
import { EbookSection } from '@/types/ebook';

interface TransitionPageProps {
  section: EbookSection;
  onNavigate: (page: number) => void;
  aiPageIndex: number;
  tocPageIndex: number;
}

const TransitionPage = ({ section, onNavigate, aiPageIndex, tocPageIndex }: TransitionPageProps) => {
  const handleAction = (action: string) => {
    switch (action) {
      case 'next':
        // Will be handled by parent navigation
        break;
      case 'start':
        onNavigate(0);
        break;
      case 'ai':
        onNavigate(aiPageIndex);
        break;
      case 'toc':
        onNavigate(tocPageIndex);
        break;
    }
  };

  return (
    <div className="space-y-10 animate-fade-in text-center max-w-xl mx-auto">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-accent" strokeWidth={1.5} />
        </div>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <h2 className="text-headline text-foreground">{section.title}</h2>
        {section.subtitle && (
          <p className="text-subheadline text-muted-foreground">{section.subtitle}</p>
        )}
        {section.content && (
          <p className="text-body text-muted-foreground leading-relaxed max-w-lg mx-auto">
            {section.content}
          </p>
        )}
      </header>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        {section.transitionOptions?.map((option, index) => {
          const isPrimary = option.action === 'next';
          const Icon = option.action === 'next' ? ArrowRight :
                       option.action === 'start' ? RotateCcw :
                       option.action === 'ai' ? Sparkles : List;

          return (
            <button
              key={index}
              onClick={() => handleAction(option.action)}
              className={`w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all font-medium text-sm ${
                isPrimary
                  ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                  : 'bg-muted/50 text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Motivational note */}
      <p className="text-caption text-muted-foreground/70 italic">
        A teoria aprofunda sua autoridade. Mas você já pode aplicar agora.
      </p>
    </div>
  );
};

export default TransitionPage;
