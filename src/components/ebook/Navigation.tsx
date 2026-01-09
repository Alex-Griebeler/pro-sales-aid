import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

const Navigation = ({ currentPage, totalPages, onPrev, onNext }: NavigationProps) => {
  return (
    <footer className="mt-auto flex items-center justify-between border-t border-border/50 px-8 py-6 bg-background/80 backdrop-blur-sm">
      <button 
        onClick={onPrev}
        disabled={currentPage === 0}
        className={`flex items-center gap-2 text-sm font-medium transition-all ${
          currentPage === 0 ? 'opacity-0 invisible' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={1.5} /> 
        <span>Anterior</span>
      </button>
      
      <div className="text-caption text-muted-foreground font-medium tracking-widest uppercase">
        {String(currentPage + 1).padStart(2, '0')} — {String(totalPages).padStart(2, '0')}
      </div>

      <button 
        onClick={onNext}
        disabled={currentPage === totalPages - 1}
        className={`flex items-center gap-2 text-sm font-medium transition-all ${
          currentPage === totalPages - 1 ? 'opacity-0 invisible' : 'text-foreground hover:text-accent'
        }`}
      >
        <span>Próximo</span>
        <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
      </button>
    </footer>
  );
};

export default Navigation;
