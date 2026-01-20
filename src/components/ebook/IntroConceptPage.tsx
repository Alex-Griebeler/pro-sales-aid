import { Sparkles, X } from 'lucide-react';
import { EbookSection } from '@/types/ebook';

interface IntroConceptPageProps {
  section: EbookSection;
}

const IntroConceptPage = ({ section }: IntroConceptPageProps) => {
  return (
    <div className="space-y-6 sm:space-y-8 overflow-y-auto max-h-[calc(100dvh-180px)] sm:max-h-[580px] pr-2 sm:pr-4 scrollbar-thin animate-fade-in">
      <header className="space-y-2">
        <h2 className="text-xl sm:text-headline text-foreground">{section.title}</h2>
        {section.subtitle && (
          <p className="text-accent font-medium text-xs sm:text-sm uppercase tracking-wider">{section.subtitle}</p>
        )}
      </header>

      {/* Main content */}
      <p className="text-sm sm:text-body text-muted-foreground">{section.content}</p>

      {/* E.R.A. Fundaments table */}
      {section.fundamentsTable && (
        <div className="overflow-x-auto -mx-2 px-2">
          <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-border min-w-[320px]">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 sm:p-4 text-[10px] sm:text-caption text-muted-foreground uppercase tracking-wider border-b border-border">Fundamento</th>
                  <th className="text-center p-3 sm:p-4 text-[10px] sm:text-caption text-muted-foreground uppercase tracking-wider border-b border-border">E.R.A.</th>
                  <th className="text-left p-3 sm:p-4 text-[10px] sm:text-caption text-muted-foreground uppercase tracking-wider border-b border-border hidden sm:table-cell">Resultado</th>
                </tr>
              </thead>
              <tbody>
                {section.fundamentsTable.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3 sm:p-4">
                      <div className="flex gap-2 sm:gap-3 items-center">
                        <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold text-[10px] sm:text-xs flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-xs sm:text-sm text-foreground">{row.fundament}</span>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 text-center">
                      <span className="inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-accent/10 border border-accent/20">
                        <span className="text-accent font-semibold text-xs sm:text-sm">{row.era.charAt(0)}</span>
                        <span className="text-muted-foreground text-[10px] sm:text-xs">{row.era.slice(1)}</span>
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-muted-foreground text-xs sm:text-sm hidden sm:table-cell">{row.effect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Auxiliary text */}
      {section.auxiliaryText && (
        <p className="text-body text-muted-foreground italic border-l-2 border-accent/50 pl-4">
          {section.auxiliaryText}
        </p>
      )}

      {/* Where conversion does NOT happen */}
      {section.notList && (
        <div className="space-y-4">
          <h4 className="text-caption text-muted-foreground uppercase tracking-wider">
            A conversão NÃO acontece:
          </h4>
          <div className="flex flex-wrap gap-2">
            {section.notList.map((item, i) => (
              <div key={i} className="flex gap-2 items-center px-4 py-2 bg-destructive/5 rounded-full border border-destructive/10">
                <X className="w-3.5 h-3.5 text-destructive" strokeWidth={1.5} />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Highlight */}
      {section.highlight && (
        <div className="text-center py-10 space-y-5">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5 text-accent" strokeWidth={1.5} />
          </div>
          <h3 className="text-title text-foreground max-w-lg mx-auto">
            {section.highlight}
          </h3>
        </div>
      )}
    </div>
  );
};

export default IntroConceptPage;
