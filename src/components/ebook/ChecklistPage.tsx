import { useState } from 'react';
import { Check, Circle, ListChecks } from 'lucide-react';
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
    <div className="space-y-5 sm:space-y-6 animate-fade-in overflow-y-auto max-h-[calc(100dvh-180px)] sm:max-h-[580px] pr-2 sm:pr-4 scrollbar-thin">
      <header className="space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <ListChecks className="w-5 h-5 sm:w-6 sm:h-6 text-accent" strokeWidth={1.5} />
          <h2 className="text-xl sm:text-headline text-foreground">{section.title}</h2>
        </div>
        {section.subtitle && (
          <p className="text-accent font-medium text-xs sm:text-sm uppercase tracking-wider">{section.subtitle}</p>
        )}
      </header>

      {section.content && (
        <p className="text-sm sm:text-body text-muted-foreground">{section.content}</p>
      )}

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-medium text-foreground">{checkedItems.size}/{section.checklistItems.length}</span>
        </div>
        <div className="h-1.5 sm:h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist by Category */}
      <div className="space-y-5 sm:space-y-6">
        {categories.map((category) => (
          <div key={category} className="space-y-2">
            <h4 className="text-[10px] sm:text-caption text-muted-foreground uppercase tracking-wider pb-1 sm:pb-2">
              {category}
            </h4>
            <div className="space-y-1">
              {section.checklistItems
                ?.filter(item => item.category === category)
                .map((item, index) => {
                  const globalIndex = section.checklistItems!.indexOf(item);
                  const isChecked = checkedItems.has(globalIndex);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => toggleItem(globalIndex)}
                      className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all text-left min-h-[48px] active:scale-[0.98] ${
                        isChecked 
                          ? 'bg-accent/5' 
                          : 'bg-muted/30 hover:bg-muted/50 active:bg-muted/70'
                      }`}
                    >
                      <div className={`w-5 h-5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isChecked 
                          ? 'bg-accent' 
                          : 'border-2 sm:border border-border'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 text-accent-foreground" strokeWidth={2.5} />}
                      </div>
                      <span className={`text-xs sm:text-sm ${
                        isChecked ? 'text-foreground/60 line-through' : 'text-foreground'
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
        <div className="p-8 bg-accent/5 rounded-2xl border border-accent/10 text-center">
          <p className="text-lg font-medium italic text-foreground">
            "{section.principle}"
          </p>
        </div>
      )}
    </div>
  );
};

export default ChecklistPage;
