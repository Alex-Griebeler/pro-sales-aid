import { ShieldCheck, Activity, Target } from 'lucide-react';
import { EbookSection } from '@/types/ebook';

export const sections: EbookSection[] = [
  {
    id: 'capa',
    type: 'hero',
    title: "Script de Conversão",
    subtitle: "Treino Experimental com Inteligência",
    tag: "MANUAL TÉCNICO V2.0",
    content: "Este manual existe para aumentar drasticamente sua taxa de conversão. Não através de persuasão, mas através de preparo, leitura correta e condução segura do treino experimental."
  },
  {
    id: 'base-conversao',
    type: 'triangle_concept',
    title: "O Triângulo da Conversão",
    subtitle: "Conceito E.R.A.",
    content: "A conversão acontece quando estes três pilares estão alinhados. O manual ensina a equilibrar o que o aluno deseja, o que ele vive e a sua postura profissional.",
    nodes: [
      { id: 'autoridade', label: "AUTORIDADE", icon: <ShieldCheck className="w-6 h-6 text-accent" /> }, 
      { id: 'realidade', label: "REALIDADE", icon: <Activity className="w-6 h-6 text-accent" /> },    
      { id: 'expectativa', label: "EXPECTATIVA", icon: <Target className="w-6 h-6 text-accent" /> } 
    ],
    auxiliaryText: "A EXPECTATIVA do aluno é agachar pesado e sair do treino \"arrebentado\" todos os dias, mas a REALIDADE é que ele não tem as competências físicas para isso: faltam mobilidade, estabilidade e técnica. A AUTORIDADE está em mostrar que quem treina pesado todos os dias não treina pesado nunca, e que aprimorar essas competências melhora a performance e reduz o risco de lesões."
  },
  {
    id: 'ia_assistant',
    title: "Consultoria IA ✨",
    subtitle: "Estratégia Personalizada",
    content: "Use a inteligência artificial para adaptar os princípios do manual ao seu caso real de hoje.",
    type: 'ai_tool'
  },
  {
    id: 'portfolio',
    title: "Portfólio Recomendado",
    content: "Maximize sua renda por hora trabalhada. O portfólio existe para atender perfis diferentes, não para empurrar o serviço mais caro.",
    split: [
      { 
        title: "Presenciais", 
        items: ["Individual 60min (Premium)", "Individual 30min (Time Efficient)", "Treino em Dupla (30/60 min)", "Pequenos Grupos (até 4 alunos)"] 
      },
      { 
        title: "Planejamento / Híbrido", 
        items: ["Planejamento sem acompanhamento", "Planejamento + Sessões pontuais", "Modelo Híbrido (Semanal/Quinzenal)"] 
      }
    ]
  },
  {
    id: 'p1',
    title: "P1 — Perfil de Busca",
    subtitle: "Mapeando o nível de referência",
    content: "Uso real: Mapear o nível de referência de experiência do aluno. A resposta indica de onde o aluno está partindo.",
    offers: [
      { k: "Orientação básica", v: "Planejamento / Grupos / Time Efficient" },
      { k: "Busca por eficiência", v: "Híbrido / 30 min individual" },
      { k: "Alta qualidade", v: "Premium 60 ou 30 min" }
    ],
    conduct: "O treino deve elevar a referência do aluno, mostrando o nível real de entrega possível."
  },
  {
    id: 'p2',
    title: "P2 — Percepção do Corpo",
    subtitle: "Ajuste de realidade sutil",
    content: "Uso real: Mapear como o aluno se enxerga. Cruze a percepção com o desempenho motor e capacidade física observados.",
    scenarios: [
      { 
        t: "Aluno se percebe melhor do que está", 
        d: "Reduza o discurso e deixe o treino mostrar limites reais. Ajuste expectativa sem exposição.",
        q: "Pelo que observei hoje, ainda temos alguns pontos básicos para organizar antes de avançar mais."
      },
      { 
        t: "Aluno se percebe pior do que está", 
        d: "Reforce competência e capacidade. Reposicione a autoconfiança do aluno imediatamente.",
        q: "Mesmo você tendo se avaliado mais baixo, o que vi na prática mostra que você está melhor condicionado do que imagina."
      }
    ]
  },
  {
    id: 'p3',
    title: "P3 — Objetivo e Áreas",
    subtitle: "Foco no desejo explícito",
    content: "Uso real: Identificar o desejo explícito. O treino deve tocar diretamente nesse desejo para gerar direcionamento.",
    mapping: [
      { label: "Desejo por Glúteos", val: "Sequência com maior solicitação técnica e volume local." },
      { label: "Desejo por Emagrecimento", val: "Treino dinâmico, integrado e com densidade elevada." }
    ],
    quote: "O objetivo não é prometer resultado, é demonstrar capacidade técnica de entregá-lo."
  },
  {
    id: 'p4',
    title: "P4 — Período do Dia",
    subtitle: "Logística e viabilidade comercial",
    content: "Uso real: Logística, agenda e viabilidade comercial. Mapeie horários concorridos vs ociosos.",
    scenarios: [
      { 
        t: "Horários de Pico (6h–9h / 18h–21h)", 
        d: "Avaliar disponibilidade e preparar discurso de escassez.", 
        q: "Esse horário hoje é bem concorrido e, no momento, não tenho vaga fixa." 
      },
      { 
        t: "Horários Ociosos (14h–17h)", 
        d: "Oportunidade de facilitar entrada ou valor diferenciado.", 
        q: "Tenho uma condição especial para este horário que ajuda a otimizar minha grade." 
      }
    ],
    strategy: "Estratégia sem vaga: Modelo híbrido temporário, planejamento + sessões quinzenais ou lista de espera consciente.",
    quote: "Hoje não tenho esse horário disponível, mas podemos começar no híbrido. Assim que abrir vaga, eu te encaixo."
  },
  {
    id: 'p5',
    title: "P5 — Frequência Semanal",
    subtitle: "Proteção contra o abandono",
    content: "Uso real: Expectativa vs Histórico. Identifica o risco de insucesso e ambição inicial excessiva.",
    conduct: "Proteja o aluno de repetir o erro. Se ele relata dificuldade de constância, reduza a meta inicial.",
    quote: "Para aumentar muito a sua chance de dar certo, sugiro começarmos com o mínimo: duas vezes por semana, bem feitas."
  },
  {
    id: 'p6',
    title: "P6 — Maior Dificuldade",
    subtitle: "Ajuste do formato à vida real",
    mapping: [
      { label: "Treinos monótonos", val: "Super-séries, intervalos curtos, alta densidade. Alternativa: 30 min densos." },
      { label: "Falta de tempo", val: "Mostrar eficiência do estímulo. Alternativa: Modelos Time Efficient." },
      { label: "Constância", val: "Reduzir meta inicial, volumes baixos. Alternativa: 2 treinos semanais." }
    ]
  },
  {
    id: 'p7',
    title: "P7 — Expectativa do Final",
    subtitle: "Critério de sucesso da sessão",
    content: "Uso real: Entender o critério de sucesso do aluno (intensidade vs sensação de resultado).",
    types: [
      { t: "Busca Intensidade", d: "Aumentar volume, reduzir intervalos e gerar dor muscular perceptível (se seguro)." },
      { t: "Busca Funcionalidade", d: "Priorizar execução, conforto, controle motor e evitar dor muscular residual." },
      { t: "Busca Hipertrofia", d: "Estímulos fortes, tensão mecânica elevada e fadiga local clara." }
    ]
  },
  {
    id: 'p8',
    title: "P8 — Dor ou Lesão",
    subtitle: "O maior gatilho de conversão",
    content: "Uso real: Gatilho de conversão e autoridade. Não é só segurança, é demonstração técnica imediata.",
    conduct: "Realize avaliação biomecânica qualitativa. Corrija o padrão momentaneamente para reduzir desconforto.",
    quote: "Isso que você sentia não é algo fixo. É um padrão de movimento que a gente consegue melhorar com o treino certo.",
    list: [
      "Demonstrar competência técnica real",
      "Gerar confiança imediata através de alívio ou correção",
      "Facilitar fechamento sem esforço comercial"
    ]
  },
  {
    id: 'final',
    title: "A Regra Final",
    content: "O questionário orienta, o treino gera valor e o fechamento apenas encaixa a oferta correta. O PAR-Q é segurança.",
    list: [
      "O questionário orienta a condução técnica",
      "O treino gera percepção de valor real",
      "O fechamento encaixa a melhor oferta do portfólio"
    ],
    highlight: "O aluno não compra porque respondeu um formulário. Ele compra porque viveu a experiência certa."
  }
];
