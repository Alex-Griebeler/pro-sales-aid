import { Crosshair, AlertCircle, ListTodo, Gift, Ban } from 'lucide-react';
import DOMPurify from 'dompurify';

interface AIResponseRendererProps {
  response: string;
}

interface Section {
  type: 'diagnostico' | 'alerta' | 'plano' | 'oferta' | 'nao-fazer' | 'text';
  title: string;
  content: string;
}

// Configure DOMPurify to only allow safe tags
const ALLOWED_TAGS = ['strong', 'em', 'br'];
const ALLOWED_ATTR = ['class'];

const sanitize = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    KEEP_CONTENT: true,
    ALLOW_DATA_ATTR: false,
  });
};

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
    if (line.includes('🎯') && line.toLowerCase().includes('diagnóstico')) {
      flushBuffer();
      currentSection = { type: 'diagnostico', title: 'Diagnóstico', content: '' };
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
      currentSection = { type: 'nao-fazer', title: 'Evitar', content: '' };
    } else if (currentSection) {
      if (!line.startsWith('###') && !line.startsWith('##')) {
        buffer.push(line);
      }
    }
  }
  
  flushBuffer();
  return sections;
};

const processMarkdown = (text: string): string => {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
};

const formatContent = (content: string) => {
  return content.split('\n').map((line, idx) => {
    const processedLine = sanitize(processMarkdown(line));
    
    if (line.trim().startsWith('>')) {
      const quoteText = sanitize(processMarkdown(line.trim().slice(1).trim()));
      return (
        <blockquote 
          key={idx} 
          className="border-l-2 border-accent/60 pl-4 py-2 my-3 text-foreground/90 italic text-sm"
          dangerouslySetInnerHTML={{ __html: `"${quoteText}"` }}
        />
      );
    }
    
    if (line.trim().startsWith('- [ ]')) {
      const itemText = sanitize(processMarkdown(line.trim().slice(5).trim()));
      return (
        <div key={idx} className="flex items-start gap-3 py-1.5">
          <div className="w-4 h-4 mt-0.5 rounded border border-border flex-shrink-0" />
          <span 
            className="text-foreground/80 text-sm"
            dangerouslySetInnerHTML={{ __html: itemText }}
          />
        </div>
      );
    }
    
    if (line.trim().startsWith('- ')) {
      const bulletText = sanitize(processMarkdown(line.trim().slice(2)));
      return (
        <div key={idx} className="flex items-start gap-3 py-1">
          <span className="text-accent/80 mt-1.5 text-[6px]">●</span>
          <span 
            className="text-foreground/80 text-sm"
            dangerouslySetInnerHTML={{ __html: bulletText }}
          />
        </div>
      );
    }
    
    if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
      const headerText = line.trim().slice(2, -2);
      return (
        <h4 key={idx} className="font-semibold text-foreground text-caption uppercase tracking-wider mt-5 mb-2">
          {headerText}
        </h4>
      );
    }
    
    if (line.trim()) {
      return (
        <p 
          key={idx} 
          className="text-foreground/80 text-sm leading-relaxed py-0.5"
          dangerouslySetInnerHTML={{ __html: processedLine }}
        />
      );
    }
    
    return null;
  });
};

const SectionCard = ({ section }: { section: Section }) => {
  const icons = {
    'diagnostico': Crosshair,
    'alerta': AlertCircle,
    'plano': ListTodo,
    'oferta': Gift,
    'nao-fazer': Ban,
    'text': Crosshair,
  };
  
  const styles = {
    'diagnostico': 'border-l-accent bg-accent/[0.03]',
    'alerta': 'border-l-amber-500 bg-amber-500/[0.03]',
    'plano': 'border-l-blue-500 bg-blue-500/[0.03]',
    'oferta': 'border-l-emerald-500 bg-emerald-500/[0.03]',
    'nao-fazer': 'border-l-rose-500 bg-rose-500/[0.03]',
    'text': 'border-l-border bg-surface',
  };
  
  const iconColors = {
    'diagnostico': 'text-accent',
    'alerta': 'text-amber-500',
    'plano': 'text-blue-500',
    'oferta': 'text-emerald-500',
    'nao-fazer': 'text-rose-500',
    'text': 'text-muted-foreground',
  };
  
  const Icon = icons[section.type];
  
  return (
    <div className={`rounded-lg border-l-2 border border-border/50 p-5 ${styles[section.type]} animate-fade-in`}>
      <div className="flex items-center gap-2.5 mb-4">
        <Icon className={`w-4 h-4 ${iconColors[section.type]}`} strokeWidth={1.5} />
        <h3 className="font-semibold text-caption uppercase tracking-wider text-foreground">
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