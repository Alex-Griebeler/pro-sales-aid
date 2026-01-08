import { BookOpen, ChevronRight } from 'lucide-react';
import { EbookSection } from '@/types/ebook';

interface TocPageProps {
  section: EbookSection;
  onNavigate: (pageNumber: number) => void;
}

const TocPage = ({ section, onNavigate }: TocPageProps) => {
  if (!section.tocItems) return null;

  const getCategoryIcon = (title: string) => {
    if (title.includes('E.R.A') || title.includes('Triângulo')) return '📐';
    if (title.includes('IA')) return '✨';
    if (title.includes('Portfólio')) return '💼';
    if (title.includes('P1') || title.includes('P2') || title.includes('P3') || title.includes('P4') || title.includes('P5') || title.includes('P6') || title.includes('P7') || title.includes('P8')) return '❓';
    if (title.includes('Checklist')) return '✅';
    if (title.includes('PAR-Q')) return '🏥';
    if (title.includes('Regra')) return '⭐';
    return '📄';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-accent" />
          <h2 className="text-4xl font-bold tracking-tight text-foreground">{section.title}</h2>
        </div>
        {section.subtitle && (
          <p className="text-muted-foreground font-medium text-lg">{section.subtitle}</p>
        )}
      </header>

      <div className="grid gap-2 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin">
        {section.tocItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.pageNumber - 1)}
            className="group flex items-center justify-between p-4 bg-surface hover:bg-accent/10 rounded-lg border border-border hover:border-accent/30 transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <span className="text-lg">{getCategoryIcon(item.title)}</span>
              <div>
                <span className="font-medium text-foreground group-hover:text-accent transition-colors">
                  {item.title}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                {String(item.pageNumber).padStart(2, '0')}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TocPage;
