import { ArrowRight } from 'lucide-react';
import { EbookSection } from '@/types/ebook';

interface HeroPageProps {
  section: EbookSection;
  onNext: () => void;
}

const HeroPage = ({ section, onNext }: HeroPageProps) => {
  return (
    <div className="space-y-8 text-left animate-fade-in">
      <span className="text-accent font-bold tracking-[0.2em] text-xs uppercase border-b-2 border-accent pb-1 inline-block">
        {section.tag}
      </span>
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-foreground">
        {section.title}
      </h1>
      <p className="text-xl text-muted-foreground max-w-xl leading-relaxed font-normal">
        {section.content}
      </p>
      <button 
        onClick={onNext}
        className="group flex items-center gap-3 bg-primary text-primary-foreground px-10 py-5 rounded-lg hover:bg-accent transition-all duration-300 mt-8 font-medium shadow-lg"
      >
        Começar agora <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default HeroPage;
