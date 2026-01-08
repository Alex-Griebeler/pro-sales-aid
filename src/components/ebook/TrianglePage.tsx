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
        return <span key={j} className="font-bold text-accent">{word} </span>;
      }
      return word + ' ';
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="space-y-3">
        <h2 className="text-4xl font-bold tracking-tight text-foreground">{section.title}</h2>
        <p className="text-accent font-semibold text-lg uppercase tracking-tight">{section.subtitle}</p>
      </header>

      {/* Triangle Visualizer */}
      <div className="relative w-full aspect-square max-w-[420px] mx-auto py-8">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-border stroke-[0.5]">
          <path d="M50 15 L85 85 L15 85 Z" />
        </svg>
        
        {/* Top Node (Autoridade) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-center w-48">
          <div className="bg-primary text-primary-foreground p-3 rounded-full mb-3 inline-flex items-center justify-center shadow-lg">
            {section.nodes[0].icon}
          </div>
          <h4 className="font-bold text-xs tracking-widest text-foreground">{section.nodes[0].label}</h4>
        </div>

        {/* Bottom Right (Realidade) */}
        <div className="absolute bottom-2 right-[-20px] text-center w-48">
          <div className="bg-primary text-primary-foreground p-3 rounded-full mb-3 inline-flex items-center justify-center shadow-lg">
            {section.nodes[1].icon}
          </div>
          <h4 className="font-bold text-xs tracking-widest text-foreground">{section.nodes[1].label}</h4>
        </div>

        {/* Bottom Left (Expectativa) */}
        <div className="absolute bottom-2 left-[-20px] text-center w-48">
          <div className="bg-primary text-primary-foreground p-3 rounded-full mb-3 inline-flex items-center justify-center shadow-lg">
            {section.nodes[2].icon}
          </div>
          <h4 className="font-bold text-xs tracking-widest text-foreground">{section.nodes[2].label}</h4>
        </div>
      </div>

      {section.auxiliaryText && (
        <div className="mt-4 p-8 bg-surface border-l-4 border-accent rounded-r-lg shadow-sm">
          <p className="text-sm leading-relaxed text-foreground font-normal text-left">
            {highlightWords(section.auxiliaryText)}
          </p>
        </div>
      )}
    </div>
  );
};

export default TrianglePage;
