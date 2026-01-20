import { BookOpen, ChevronRight } from 'lucide-react';
import { EbookSection } from '@/types/ebook';

interface TocPageProps {
  section: EbookSection;
  onNavigate: (pageNumber: number) => void;
}

const TocPage = ({ section, onNavigate }: TocPageProps) => {
  if (!section.tocItems) return null;

  const getCategoryIcon = (title: string) => {
    if (title.includes('E.R.A') || title.includes('Triângulo')) return '◇';
    if (title.includes('IA')) return '◎';
    if (title.includes('Portfólio')) return '▢';
    if (title.includes('P1') || title.includes('P2') || title.includes('P3') || title.includes('P4') || title.includes('P5') || title.includes('P6') || title.includes('P7') || title.includes('P8')) return '○';
    if (title.includes('Checklist')) return '◉';
    if (title.includes('PAR-Q')) return '△';
    if (title.includes('Regra')) return '★';
    return '·';
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <header className="space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-accent" strokeWidth={1.5} />
          <h2 className="text-xl sm:text-headline text-foreground">{section.title}</h2>
        </div>
        {section.subtitle && (
          <p className="text-muted-foreground text-sm sm:text-body">{section.subtitle}</p>
        )}
      </header>

      <div className="grid gap-0.5 sm:gap-1 max-h-[calc(100dvh-280px)] sm:max-h-[480px] overflow-y-auto pr-1 sm:pr-2 scrollbar-thin">
        {section.tocItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.pageNumber - 1)}
            className="group flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 active:bg-muted/70 rounded-lg sm:rounded-xl transition-all text-left min-h-[48px]"
          >
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <span className="text-muted-foreground text-xs sm:text-sm w-3 sm:w-4 flex-shrink-0">{getCategoryIcon(item.title)}</span>
              <span className="text-xs sm:text-sm text-foreground/80 group-hover:text-foreground transition-colors truncate">
                {item.title}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
              <span className="text-[10px] sm:text-caption text-muted-foreground">
                {String(item.pageNumber).padStart(2, '0')}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-accent group-hover:translate-x-1 transition-all" strokeWidth={1.5} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TocPage;
