import { Check, MessageCircle, Target, Activity, Sparkles } from 'lucide-react';
import { EbookSection } from '@/types/ebook';

interface ContentPageProps {
  section: EbookSection;
}

const ContentPage = ({ section }: ContentPageProps) => {
  return (
    <div className="space-y-8 overflow-y-auto max-h-[580px] pr-4 scrollbar-thin animate-fade-in">
      <header className="space-y-2">
        <h2 className="text-headline text-foreground">{section.title}</h2>
        {section.subtitle && (
          <p className="text-accent font-medium text-sm uppercase tracking-wider">{section.subtitle}</p>
        )}
      </header>

      {/* Question */}
      {section.question && (
        <div className="p-5 bg-accent/5 rounded-2xl border border-accent/10">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-accent" strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <span className="text-caption text-accent uppercase tracking-wider">Pergunta ao Aluno</span>
              <p className="font-medium text-foreground">{section.question}</p>
            </div>
          </div>
        </div>
      )}

      {/* Question Options */}
      {section.questionOptions && (
        <div className="space-y-3">
          <span className="text-caption text-muted-foreground uppercase tracking-wider">Opções de Resposta</span>
          <div className="grid gap-2">
            {section.questionOptions.map((opt, i) => (
              <div key={i} className="flex gap-4 items-center p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground flex-shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm text-foreground">{opt.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {section.content && (
        <p className="text-body text-muted-foreground">{section.content}</p>
      )}

      <div className="grid gap-6">
        {/* List Items */}
        {section.list && (
          <ul className="space-y-2">
            {section.list.map((li, i) => (
              <li key={i} className="flex gap-4 items-start p-4 bg-muted/30 rounded-xl">
                <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-accent" strokeWidth={2} />
                </div>
                <span className="text-sm text-foreground">{li}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Objectives */}
        {section.objectives && (
          <div className="space-y-3">
            <span className="text-caption text-muted-foreground uppercase tracking-wider">Objetivo desta pergunta</span>
            <div className="grid gap-2">
              {section.objectives.map((obj, i) => (
                <div key={i} className="flex gap-3 items-center p-4 bg-accent/5 rounded-xl border border-accent/10">
                  <Target className="w-4 h-4 text-accent flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-sm text-foreground">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAR-Q Questions */}
        {section.parqQuestions && (
          <div className="space-y-4">
            <span className="text-caption text-muted-foreground uppercase tracking-wider">As 7 Perguntas do PAR-Q</span>
            <div className="grid gap-3">
              {section.parqQuestions.map((pq, i) => (
                <div key={i} className="p-4 rounded-xl bg-muted/30 space-y-3">
                  <div className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm font-medium text-foreground">{pq.question}</p>
                  </div>
                  <div className="ml-9 p-3 bg-background rounded-lg border-l-2 border-accent/30">
                    <div className="flex gap-2 items-start">
                      <Activity className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                      <p className="text-xs text-muted-foreground">{pq.guidance}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scenarios */}
        {section.scenarios && (
          <div className="grid gap-4">
            {section.scenarios.map((s, i) => (
              <div key={i} className="p-5 rounded-2xl bg-muted/30 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
                <h4 className="font-semibold text-sm text-foreground pl-4">{s.t}</h4>
                <p className="text-sm text-muted-foreground pl-4">{s.d}</p>
                {s.q && (
                  <div className="ml-4 p-4 bg-background rounded-xl">
                    <p className="text-sm italic text-foreground">"{s.q}"</p>
                  </div>
                )}
                {s.alternatives && s.alternatives.length > 0 && (
                  <div className="space-y-2 pt-2 pl-4">
                    <span className="text-caption text-accent uppercase tracking-wider">Opções para o Portfólio</span>
                    <ul className="space-y-1.5">
                      {s.alternatives.map((alt, idx) => (
                        <li key={idx} className="flex gap-2 items-start text-sm text-foreground/80">
                          <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0 mt-2" />
                          {alt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {s.followUp && (
                  <div className="ml-4 p-3 bg-accent/5 rounded-xl border border-accent/10">
                    <p className="text-sm italic text-accent">"{s.followUp}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Mapping */}
        {section.mapping && (
          <div className="space-y-2">
            {section.mapping.map((m, i) => (
              <div key={i} className="flex flex-col p-4 rounded-xl bg-muted/30">
                <span className="text-caption text-accent uppercase tracking-wider mb-1">{m.label}</span>
                <span className="text-sm text-foreground">{m.val}</span>
              </div>
            ))}
          </div>
        )}

        {/* Offers Table */}
        {section.offers && (
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-5 py-4 text-left text-caption text-muted-foreground uppercase tracking-wider">
                    Situação do Aluno
                  </th>
                  <th className="px-5 py-4 text-left text-caption text-muted-foreground uppercase tracking-wider">
                    Encaixe Estratégico
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {section.offers.map((o, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4 text-foreground">{o.k}</td>
                    <td className="px-5 py-4 text-accent font-medium">{o.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Types */}
        {section.types && (
          <div className="grid gap-3">
            {section.types.map((type, i) => (
              <div key={i} className="p-5 bg-muted/30 rounded-2xl">
                <h4 className="font-semibold text-foreground mb-2">{type.t}</h4>
                <p className="text-sm text-muted-foreground">{type.d}</p>
              </div>
            ))}
          </div>
        )}

        {/* Split Sections */}
        {section.split && (
          <div className="grid md:grid-cols-2 gap-6">
            {section.split.map((s, i) => (
              <div key={i} className="space-y-3">
                <h4 className="text-caption text-accent uppercase tracking-wider">
                  {s.title}
                </h4>
                <div className="space-y-2">
                  {s.items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-muted/30 rounded-xl text-sm text-foreground">
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
          <div className="p-5 rounded-2xl bg-accent/5 border border-accent/10">
            <span className="text-caption text-accent uppercase tracking-wider mb-2 block">
              Condução Técnica
            </span>
            <p className="text-sm text-foreground">{section.conduct}</p>
          </div>
        )}

        {/* Principle */}
        {section.principle && (
          <div className="p-8 bg-accent/5 rounded-2xl border border-accent/10 text-center">
            <p className="text-lg font-medium italic text-foreground">
              "{section.principle}"
            </p>
          </div>
        )}

        {/* Strategy */}
        {section.strategy && (
          <div className="p-5 bg-muted/30 rounded-2xl">
            <span className="text-caption text-muted-foreground uppercase tracking-wider mb-2 block">
              Estratégia Alternativa
            </span>
            <p className="text-sm text-foreground">{section.strategy}</p>
          </div>
        )}

        {/* Quote */}
        {section.quote && (
          <div className="p-8 bg-muted/30 rounded-2xl text-center">
            <p className="text-lg font-medium italic text-foreground/80">"{section.quote}"</p>
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
    </div>
  );
};

export default ContentPage;
