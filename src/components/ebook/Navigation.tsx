import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface NavigationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

const Navigation = ({ currentPage, totalPages, onPrev, onNext }: NavigationProps) => {
  return (
    <footer className="mt-auto flex items-center justify-between border-t border-border/50 px-4 sm:px-8 py-4 sm:py-6 bg-background/80 backdrop-blur-sm gap-2">
      <button 
        onClick={onPrev}
        disabled={currentPage === 0}
        className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium transition-all min-w-[80px] sm:min-w-[100px] min-h-[44px] justify-start ${
          currentPage === 0 ? 'opacity-0 invisible' : 'text-muted-foreground hover:text-foreground active:scale-95'
        }`}
      >
        <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4" strokeWidth={1.5} /> 
        <span className="hidden sm:inline">Anterior</span>
      </button>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="text-[10px] sm:text-caption text-muted-foreground font-medium tracking-widest uppercase">
          {String(currentPage + 1).padStart(2, '0')} — {String(totalPages).padStart(2, '0')}
        </div>
        <ThemeToggle />
      </div>

      <button 
        onClick={onNext}
        disabled={currentPage === totalPages - 1}
        className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium transition-all min-w-[80px] sm:min-w-[100px] min-h-[44px] justify-end ${
          currentPage === totalPages - 1 ? 'opacity-0 invisible' : 'text-foreground hover:text-accent active:scale-95'
        }`}
      >
        <span className="hidden sm:inline">Próximo</span>
        <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4" strokeWidth={1.5} />
      </button>
    </footer>
  );
};

export default Navigation;
