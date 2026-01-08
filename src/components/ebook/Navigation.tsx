import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

const Navigation = ({ currentPage, totalPages, onPrev, onNext }: NavigationProps) => {
  return (
    <footer className="mt-auto flex items-center justify-between border-t border-border p-8 bg-card">
      <button 
        onClick={onPrev}
        disabled={currentPage === 0}
        className={`flex items-center gap-2 text-sm font-bold transition-all ${
          currentPage === 0 ? 'opacity-0 invisible' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <ChevronLeft className="w-5 h-5" /> Anterior
      </button>
      
      <div className="text-[10px] text-muted-foreground font-bold tracking-[0.2em] uppercase">
        PAGE {String(currentPage + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
      </div>

      <button 
        onClick={onNext}
        disabled={currentPage === totalPages - 1}
        className={`flex items-center gap-2 text-sm font-bold transition-all ${
          currentPage === totalPages - 1 ? 'opacity-0 invisible' : 'text-accent hover:text-gold-hover'
        }`}
      >
        Próximo <ChevronRight className="w-5 h-5" />
      </button>
    </footer>
  );
};

export default Navigation;
