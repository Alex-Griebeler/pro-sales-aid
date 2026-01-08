import { Sparkles, XCircle } from 'lucide-react';
import { EbookSection } from '@/types/ebook';

interface IntroConceptPageProps {
  section: EbookSection;
}

const IntroConceptPage = ({ section }: IntroConceptPageProps) => {
  return (
    <div className="space-y-8 overflow-y-auto max-h-[580px] pr-4 scrollbar-thin animate-fade-in">
      <header className="space-y-3">
        <h2 className="text-4xl font-bold tracking-tight text-foreground">{section.title}</h2>
        {section.subtitle && (
          <p className="text-accent font-semibold text-xl uppercase tracking-tight">{section.subtitle}</p>
        )}
      </header>

      {/* Main content */}
      <p className="text-muted-foreground text-lg leading-relaxed">{section.content}</p>

      {/* E.R.A. Fundaments table */}
      {section.fundamentsTable && (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="bg-accent/10">
                <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-accent border-b border-border">Fundamento</th>
                <th className="text-center p-4 text-xs font-bold uppercase tracking-widest text-accent border-b border-border">E.R.A.</th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-accent border-b border-border">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {section.fundamentsTable.map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                  <td className="p-4">
                    <div className="flex gap-3 items-center">
                      <span className="w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xs shrink-0">
                        {i + 1}
                      </span>
                      <span className="font-medium text-foreground text-sm">{row.fundament}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/30">
                      <span className="text-accent font-bold text-lg">{row.era.charAt(0)}</span>
                      <span className="text-muted-foreground text-xs">{row.era.slice(1)}</span>
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm italic">{row.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Auxiliary text */}
      {section.auxiliaryText && (
        <p className="text-muted-foreground text-lg leading-relaxed italic border-l-4 border-accent pl-4">
          {section.auxiliaryText}
        </p>
      )}

      {/* Where conversion does NOT happen */}
      {section.notList && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            A conversão NÃO acontece:
          </h4>
          <div className="flex flex-wrap gap-3">
            {section.notList.map((item, i) => (
              <div key={i} className="flex gap-2 items-center px-4 py-2 bg-destructive/5 rounded-full border border-destructive/20">
                <XCircle className="w-4 h-4 text-destructive shrink-0" />
                <span className="font-medium text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Highlight */}
      {section.highlight && (
        <div className="text-center py-8 space-y-4">
          <Sparkles className="w-10 h-10 text-accent mx-auto animate-pulse-gold" />
          <h3 className="text-2xl font-bold tracking-tight max-w-xl mx-auto leading-tight text-foreground">
            {section.highlight}
          </h3>
        </div>
      )}
    </div>
  );
};

export default IntroConceptPage;