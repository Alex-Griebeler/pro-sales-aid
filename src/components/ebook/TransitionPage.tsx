import { CheckCircle, ArrowRight, RotateCcw, List, Sparkles } from 'lucide-react';
import { EbookSection } from '@/types/ebook';
import { sections } from '@/data/ebookSections';

interface TransitionPageProps {
  section: EbookSection;
  onNavigate: (page: number) => void;
  aiPageIndex: number;
  tocPageIndex: number;
}

const TransitionPage = ({ section, onNavigate, aiPageIndex, tocPageIndex }: TransitionPageProps) => {
  // Find the next page after transition (should be P1)
  const currentIndex = sections.findIndex(s => s.id === 'transition');
  const nextPageIndex = currentIndex + 1;

  const handleAction = (action: string) => {
    switch (action) {
      case 'next':
        onNavigate(nextPageIndex);
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
    <div className="space-y-8 sm:space-y-10 animate-fade-in text-center max-w-xl mx-auto px-2">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-accent" strokeWidth={1.5} />
        </div>
      </div>

      {/* Header */}
      <header className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-headline text-foreground">{section.title}</h2>
        {section.subtitle && (
          <p className="text-sm sm:text-subheadline text-muted-foreground">{section.subtitle}</p>
        )}
        {section.content && (
          <p className="text-sm sm:text-body text-muted-foreground leading-relaxed max-w-lg mx-auto">
            {section.content}
          </p>
        )}
      </header>

      {/* Action Buttons */}
      <div className="space-y-2.5 sm:space-y-3 pt-2 sm:pt-4">
        {section.transitionOptions?.map((option, index) => {
          const isPrimary = option.action === 'next';
          const Icon = option.action === 'next' ? ArrowRight :
                       option.action === 'start' ? RotateCcw :
                       option.action === 'ai' ? Sparkles : List;

          return (
            <button
              key={index}
              onClick={() => handleAction(option.action)}
              className={`w-full py-3.5 sm:py-4 px-5 sm:px-6 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2.5 sm:gap-3 transition-all font-medium text-sm min-h-[48px] active:scale-[0.98] ${
                isPrimary
                  ? 'bg-accent text-accent-foreground hover:bg-accent/90 active:bg-accent/80'
                  : 'bg-muted/50 text-foreground hover:bg-muted active:bg-muted/70'
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Motivational note */}
      <p className="text-[11px] sm:text-caption text-muted-foreground/70 italic">
        A teoria aprofunda sua autoridade. Mas você já pode aplicar agora.
      </p>
    </div>
  );
};

export default TransitionPage;
