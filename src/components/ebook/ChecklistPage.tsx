import { useState } from 'react';
import { CheckCircle2, Circle, ListChecks } from 'lucide-react';
import { EbookSection } from '@/types/ebook';

interface ChecklistPageProps {
  section: EbookSection;
}

const ChecklistPage = ({ section }: ChecklistPageProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  if (!section.checklistItems) return null;

  const toggleItem = (index: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  const progress = (checkedItems.size / section.checklistItems.length) * 100;
  const categories = [...new Set(section.checklistItems.map(item => item.category))];

  return (
    <div className="space-y-6 animate-fade-in overflow-y-auto max-h-[580px] pr-4 scrollbar-thin">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <ListChecks className="w-8 h-8 text-accent" />
          <h2 className="text-4xl font-bold tracking-tight text-foreground">{section.title}</h2>
        </div>
        {section.subtitle && (
          <p className="text-accent font-semibold text-lg uppercase tracking-tight">{section.subtitle}</p>
        )}
      </header>

      {section.content && (
        <p className="text-muted-foreground text-lg leading-relaxed">{section.content}</p>
      )}

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-bold text-accent">{checkedItems.size}/{section.checklistItems.length}</span>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden border border-border">
          <div 
            className="h-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist by Category */}
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category} className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
              {category}
            </h4>
            <div className="space-y-2">
              {section.checklistItems
                ?.filter(item => item.category === category)
                .map((item, index) => {
                  const globalIndex = section.checklistItems!.indexOf(item);
                  const isChecked = checkedItems.has(globalIndex);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => toggleItem(globalIndex)}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all text-left ${
                        isChecked 
                          ? 'bg-accent/10 border-accent/30' 
                          : 'bg-surface border-border hover:border-accent/20'
                      }`}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                      )}
                      <span className={`text-sm font-medium ${
                        isChecked ? 'text-foreground line-through opacity-70' : 'text-foreground'
                      }`}>
                        {item.text}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Principle */}
      {section.principle && (
        <div className="p-6 bg-accent/5 rounded-lg border border-accent/20 text-center">
          <p className="text-lg font-semibold italic leading-relaxed text-foreground tracking-tight">
            "{section.principle}"
          </p>
        </div>
      )}
    </div>
  );
};

export default ChecklistPage;
