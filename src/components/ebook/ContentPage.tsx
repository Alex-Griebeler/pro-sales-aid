import { UserCheck, Sparkles } from 'lucide-react';
import { EbookSection } from '@/types/ebook';

interface ContentPageProps {
  section: EbookSection;
}

const ContentPage = ({ section }: ContentPageProps) => {
  return (
    <div className="space-y-8 overflow-y-auto max-h-[580px] pr-4 scrollbar-thin animate-fade-in">
      <header className="space-y-3">
        <h2 className="text-4xl font-bold tracking-tight text-foreground">{section.title}</h2>
        {section.subtitle && (
          <p className="text-accent font-semibold text-lg uppercase tracking-tight">{section.subtitle}</p>
        )}
        <p className="text-muted-foreground text-lg leading-relaxed">{section.content}</p>
      </header>

      <div className="grid gap-6">
        {/* List Items */}
        {section.list && (
          <ul className="space-y-3">
            {section.list.map((li, i) => (
              <li key={i} className="flex gap-4 items-start p-4 bg-surface rounded-lg border border-border">
                <UserCheck className="w-5 h-5 text-accent shrink-0 mt-1" />
                <span className="font-medium text-sm text-foreground">{li}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Scenarios */}
        {section.scenarios && (
          <div className="grid gap-4">
            {section.scenarios.map((s, i) => (
              <div key={i} className="p-6 border border-border rounded-lg space-y-4 relative overflow-hidden bg-card shadow-sm">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
                <h4 className="font-bold text-sm uppercase tracking-widest text-foreground">{s.t}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
                {s.q && (
                  <div className="p-4 bg-surface rounded-lg border-l-2 border-primary">
                    <p className="text-xs italic font-medium text-foreground">"{s.q}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Mapping */}
        {section.mapping && (
          <div className="space-y-3">
            {section.mapping.map((m, i) => (
              <div key={i} className="flex flex-col p-4 border border-border rounded-lg bg-surface">
                <span className="font-bold text-[10px] uppercase tracking-widest text-accent mb-1">{m.label}</span>
                <span className="font-medium text-sm text-foreground">{m.val}</span>
              </div>
            ))}
          </div>
        )}

        {/* Offers Table */}
        {section.offers && (
          <div className="overflow-hidden border border-border rounded-lg shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-surface">
                <tr>
                  <th className="px-5 py-4 text-left font-bold text-muted-foreground uppercase text-[10px] tracking-widest">
                    Situação do Aluno
                  </th>
                  <th className="px-5 py-4 text-left font-bold text-muted-foreground uppercase text-[10px] tracking-widest">
                    Encaixe Estratégico
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {section.offers.map((o, i) => (
                  <tr key={i} className="hover:bg-surface transition-colors">
                    <td className="px-5 py-5 font-medium text-foreground">{o.k}</td>
                    <td className="px-5 py-5 text-accent font-bold">{o.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Types */}
        {section.types && (
          <div className="grid gap-4">
            {section.types.map((type, i) => (
              <div key={i} className="p-5 bg-card border border-border rounded-lg shadow-sm">
                <h4 className="font-bold text-foreground mb-2">{type.t}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed italic">{type.d}</p>
              </div>
            ))}
          </div>
        )}

        {/* Split Sections */}
        {section.split && (
          <div className="grid md:grid-cols-2 gap-6">
            {section.split.map((s, i) => (
              <div key={i} className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-accent border-b-2 border-accent pb-1 inline-block">
                  {s.title}
                </h4>
                <div className="space-y-2">
                  {s.items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-surface rounded-lg text-xs font-medium border border-transparent hover:border-border transition-all text-foreground">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Conduct */}
        {section.conduct && (
          <div className="p-6 border-2 border-primary rounded-lg bg-card shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-widest mb-2 block text-accent">
              Condução Técnica Sugerida
            </span>
            <p className="text-sm font-medium leading-relaxed text-foreground">{section.conduct}</p>
          </div>
        )}

        {/* Quote */}
        {section.quote && (
          <div className="p-8 bg-surface rounded-lg border border-border text-center italic shadow-inner">
            <p className="text-xl font-medium tracking-tight text-foreground">"{section.quote}"</p>
          </div>
        )}

        {/* Highlight */}
        {section.highlight && (
          <div className="text-center py-12 space-y-6">
            <Sparkles className="w-14 h-14 text-accent mx-auto animate-pulse-gold" />
            <h3 className="text-3xl font-bold tracking-tight max-w-xl mx-auto leading-tight text-foreground">
              {section.highlight}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPage;
