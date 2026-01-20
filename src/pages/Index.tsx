import { useState, useMemo } from 'react';
import { sections } from '@/data/ebookSections';
import HeroPage from '@/components/ebook/HeroPage';
import TrianglePage from '@/components/ebook/TrianglePage';
import AIAssistantPage from '@/components/ebook/AIAssistantPage';
import ContentPage from '@/components/ebook/ContentPage';
import IntroConceptPage from '@/components/ebook/IntroConceptPage';
import TocPage from '@/components/ebook/TocPage';
import ChecklistPage from '@/components/ebook/ChecklistPage';
import TransitionPage from '@/components/ebook/TransitionPage';
import Navigation from '@/components/ebook/Navigation';
import ProgressBar from '@/components/ebook/ProgressBar';

const Index = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const next = () => setCurrentPage((prev) => Math.min(prev + 1, sections.length - 1));
  const prev = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const goToPage = (page: number) => setCurrentPage(Math.max(0, Math.min(page, sections.length - 1)));

  const active = sections[currentPage];

  // Find key page indexes for TransitionPage navigation
  const pageIndexes = useMemo(() => ({
    ai: sections.findIndex(s => s.id === 'ia_assistant'),
    toc: sections.findIndex(s => s.id === 'sumario'),
  }), []);

  const renderContent = () => {
    switch (active.type) {
      case 'hero':
        return <HeroPage section={active} onNext={next} />;
      case 'triangle_concept':
        return <TrianglePage section={active} />;
      case 'ai_tool':
        return <AIAssistantPage section={active} onNavigate={goToPage} />;
      case 'intro_concept':
        return <IntroConceptPage section={active} />;
      case 'toc':
        return <TocPage section={active} onNavigate={goToPage} />;
      case 'checklist':
        return <ChecklistPage section={active} />;
      case 'transition':
        return (
          <TransitionPage 
            section={active} 
            onNavigate={goToPage}
            aiPageIndex={pageIndexes.ai}
            tocPageIndex={pageIndexes.toc}
          />
        );
      default:
        return <ContentPage section={active} />;
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col items-center justify-center p-2 sm:p-4 md:p-12 selection:bg-accent selection:text-accent-foreground">
      {/* Container Principal */}
      <div className="max-w-4xl w-full bg-card min-h-[calc(100dvh-1rem)] sm:min-h-[750px] flex flex-col relative border border-border rounded-lg overflow-hidden shadow-2xl">
        
        {/* Barra de Progresso */}
        <ProgressBar currentPage={currentPage} totalPages={sections.length} />

        {/* Área de Conteúdo Dinâmico */}
        <main className="flex-1 flex flex-col p-4 sm:p-8 md:p-14 justify-center overflow-hidden" key={active.id}>
          {renderContent()}
        </main>

        {/* Navegação Inferior */}
        <Navigation 
          currentPage={currentPage}
          totalPages={sections.length}
          onPrev={prev}
          onNext={next}
        />
      </div>
    </div>
  );
};

export default Index;
