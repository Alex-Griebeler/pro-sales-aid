import { Target, AlertTriangle, ClipboardList, Briefcase, XCircle } from 'lucide-react';

interface AIResponseRendererProps {
  response: string;
}

interface Section {
  type: 'diagnostico' | 'alerta' | 'plano' | 'oferta' | 'nao-fazer' | 'text';
  title: string;
  content: string;
}

const parseResponse = (response: string): Section[] => {
  const sections: Section[] = [];
  const lines = response.split('\n');
  
  let currentSection: Section | null = null;
  let buffer: string[] = [];
  
  const flushBuffer = () => {
    if (currentSection && buffer.length > 0) {
      currentSection.content = buffer.join('\n').trim();
      sections.push(currentSection);
      buffer = [];
    }
  };
  
  for (const line of lines) {
    // Check for section headers
    if (line.includes('🎯') && line.toLowerCase().includes('diagnóstico')) {
      flushBuffer();
      currentSection = { type: 'diagnostico', title: 'Diagnóstico Rápido', content: '' };
    } else if (line.includes('⚠️') && line.toLowerCase().includes('alerta')) {
      flushBuffer();
      currentSection = { type: 'alerta', title: 'Alerta de Objeção', content: '' };
    } else if (line.includes('📋') && line.toLowerCase().includes('plano')) {
      flushBuffer();
      currentSection = { type: 'plano', title: 'Plano da Sessão', content: '' };
    } else if (line.includes('💼') && line.toLowerCase().includes('oferta')) {
      flushBuffer();
      currentSection = { type: 'oferta', title: 'Oferta Recomendada', content: '' };
    } else if (line.includes('🚫') && line.toLowerCase().includes('não fazer')) {
      flushBuffer();
      currentSection = { type: 'nao-fazer', title: 'O Que Não Fazer', content: '' };
    } else if (currentSection) {
      // Skip the header line itself
      if (!line.startsWith('###') && !line.startsWith('##')) {
        buffer.push(line);
      }
    }
  }
  
  flushBuffer();
  
  return sections;
};

const formatContent = (content: string) => {
  // Process line by line
  return content.split('\n').map((line, idx) => {
    // Remove markdown bold markers and render properly
    const processedLine = line
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Quote blocks (lines starting with >)
    if (line.trim().startsWith('>')) {
      const quoteText = line.trim().slice(1).trim()
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
      return (
        <blockquote 
          key={idx} 
          className="border-l-2 border-gold pl-3 py-2 my-2 bg-gold/5 rounded-r text-foreground italic"
          dangerouslySetInnerHTML={{ __html: `"${quoteText}"` }}
        />
      );
    }
    
    // Checklist items
    if (line.trim().startsWith('- [ ]')) {
      const itemText = line.trim().slice(5).trim()
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
      return (
        <div key={idx} className="flex items-start gap-2 py-1">
          <div className="w-4 h-4 mt-0.5 rounded border border-border bg-surface flex-shrink-0" />
          <span 
            className="text-foreground text-sm"
            dangerouslySetInnerHTML={{ __html: itemText }}
          />
        </div>
      );
    }
    
    // Bullet points
    if (line.trim().startsWith('- ')) {
      const bulletText = line.trim().slice(2)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
      return (
        <div key={idx} className="flex items-start gap-2 py-1">
          <span className="text-gold mt-1">•</span>
          <span 
            className="text-foreground text-sm"
            dangerouslySetInnerHTML={{ __html: bulletText }}
          />
        </div>
      );
    }
    
    // Sub-headers (bold lines like **ABERTURA**)
    if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
      const headerText = line.trim().slice(2, -2);
      return (
        <h4 key={idx} className="font-bold text-gold text-xs uppercase tracking-wider mt-4 mb-2">
          {headerText}
        </h4>
      );
    }
    
    // Regular text
    if (line.trim()) {
      return (
        <p 
          key={idx} 
          className="text-foreground text-sm leading-relaxed py-0.5"
          dangerouslySetInnerHTML={{ __html: processedLine }}
        />
      );
    }
    
    return null;
  });
};

const SectionCard = ({ section }: { section: Section }) => {
  const icons = {
    'diagnostico': Target,
    'alerta': AlertTriangle,
    'plano': ClipboardList,
    'oferta': Briefcase,
    'nao-fazer': XCircle,
    'text': Target,
  };
  
  const colors = {
    'diagnostico': 'border-gold/50 bg-gold/5',
    'alerta': 'border-amber-500/50 bg-amber-500/5',
    'plano': 'border-blue-500/50 bg-blue-500/5',
    'oferta': 'border-emerald-500/50 bg-emerald-500/5',
    'nao-fazer': 'border-red-500/50 bg-red-500/5',
    'text': 'border-border bg-surface',
  };
  
  const iconColors = {
    'diagnostico': 'text-gold',
    'alerta': 'text-amber-500',
    'plano': 'text-blue-500',
    'oferta': 'text-emerald-500',
    'nao-fazer': 'text-red-500',
    'text': 'text-muted-foreground',
  };
  
  const Icon = icons[section.type];
  
  return (
    <div className={`rounded-lg border p-4 ${colors[section.type]} animate-fade-in`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${iconColors[section.type]}`} />
        <h3 className="font-bold text-sm uppercase tracking-wide text-foreground">
          {section.title}
        </h3>
      </div>
      <div className="space-y-1">
        {formatContent(section.content)}
      </div>
    </div>
  );
};

const AIResponseRenderer = ({ response }: AIResponseRendererProps) => {
  const sections = parseResponse(response);
  
  // If no sections were parsed, show raw response with basic formatting
  if (sections.length === 0) {
    return (
      <div className="space-y-2">
        {formatContent(response)}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {sections.map((section, idx) => (
        <SectionCard key={idx} section={section} />
      ))}
    </div>
  );
};

export default AIResponseRenderer;
