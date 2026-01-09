import { ArrowRight } from 'lucide-react';
import { EbookSection } from '@/types/ebook';

interface HeroPageProps {
  section: EbookSection;
  onNext: () => void;
}

const HeroPage = ({ section, onNext }: HeroPageProps) => {
  return (
    <div className="space-y-10 text-left animate-fade-in">
      <span className="text-accent font-semibold tracking-[0.15em] text-caption uppercase inline-block">
        {section.tag}
      </span>
      
      <h1 className="text-display text-foreground">
        {section.title}
      </h1>
      
      <p className="text-body text-muted-foreground max-w-lg">
        {section.content}
      </p>
      
      <button 
        onClick={onNext}
        className="group flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300 mt-4 font-medium text-sm"
      >
        Começar agora 
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
      </button>
    </div>
  );
};

export default HeroPage;
