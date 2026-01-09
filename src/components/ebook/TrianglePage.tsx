import { EbookSection } from '@/types/ebook';

interface TrianglePageProps {
  section: EbookSection;
}

const TrianglePage = ({ section }: TrianglePageProps) => {
  if (!section.nodes) return null;

  const highlightWords = (text: string) => {
    const highlights = ['EXPECTATIVA', 'REALIDADE', 'AUTORIDADE'];
    return text.split(' ').map((word, j) => {
      const cleanWord = word.replace(/[.,]/g, '').replace(/[""]/g, '');
      if (highlights.includes(cleanWord.toUpperCase())) {
        return <span key={j} className="font-semibold text-accent">{word} </span>;
      }
      return word + ' ';
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="space-y-2">
        <h2 className="text-headline text-foreground">{section.title}</h2>
        <p className="text-accent font-medium text-sm uppercase tracking-wider">{section.subtitle}</p>
      </header>

      {/* Triangle Visualizer */}
      <div className="relative w-full aspect-square max-w-[380px] mx-auto py-6">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-border/50 stroke-[0.3]">
          <path d="M50 18 L82 82 L18 82 Z" />
        </svg>
        
        {/* Top Node (Autoridade) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-center w-40">
          <div className="bg-foreground text-background w-10 h-10 rounded-full mb-2 inline-flex items-center justify-center">
            {section.nodes[0].icon}
          </div>
          <h4 className="text-caption text-foreground uppercase tracking-wider">{section.nodes[0].label}</h4>
        </div>

        {/* Bottom Right (Realidade) */}
        <div className="absolute bottom-4 right-[-10px] text-center w-40">
          <div className="bg-foreground text-background w-10 h-10 rounded-full mb-2 inline-flex items-center justify-center">
            {section.nodes[1].icon}
          </div>
          <h4 className="text-caption text-foreground uppercase tracking-wider">{section.nodes[1].label}</h4>
        </div>

        {/* Bottom Left (Expectativa) */}
        <div className="absolute bottom-4 left-[-10px] text-center w-40">
          <div className="bg-foreground text-background w-10 h-10 rounded-full mb-2 inline-flex items-center justify-center">
            {section.nodes[2].icon}
          </div>
          <h4 className="text-caption text-foreground uppercase tracking-wider">{section.nodes[2].label}</h4>
        </div>
      </div>

      {section.auxiliaryText && (
        <div className="p-6 bg-muted/30 rounded-2xl border-l-2 border-accent/50">
          <p className="text-sm text-foreground/80 leading-relaxed">
            {highlightWords(section.auxiliaryText)}
          </p>
        </div>
      )}
    </div>
  );
};

export default TrianglePage;
