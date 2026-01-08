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
    id: 'intro-conversao',
    type: 'intro_concept',
    title: "O Conceito E.R.A.",
    subtitle: "Expectativa · Realidade · Autoridade",
    content: "Esse manual não é só um norte técnico. Ele é um sistema de pré-venda silenciosa, onde a conversão não acontece por persuasão — acontece por alinhamento. O conceito E.R.A. é a base metodológica:",
    fundamentsTable: [
      { fundament: "Interpretação correta do aluno", era: "Expectativa", effect: "O aluno se sente compreendido" },
      { fundament: "Condução certa do treino", era: "Realidade", effect: "Entrega o que ele espera sem negligenciar o que ele precisa" },
      { fundament: "Discurso alinhado", era: "Autoridade", effect: "Mostra critério sem confronto" },
    ],
    auxiliaryText: "Quando E.R.A. está alinhado, a conversão deixa de ser \"técnica de venda\" e vira consequência lógica da experiência.",
    notList: [
      "No preço",
      "No final do treino",
      "Na proposta"
    ],
    highlight: "Profissional preparado quase não perde fechamento."
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
    question: "Qual das opções abaixo mais se aproxima do que você busca hoje com um profissional de treinamento?",
    questionOptions: [
      { text: "Nunca treinei com personal e quero orientação básica para começar" },
      { text: "Já treinei com personal, mas busco algo mais organizado e eficiente" },
      { text: "Já treinei com personal e procuro um trabalho de alta qualidade e individualizado" },
      { text: "Estou em dúvida e quero entender melhor como funciona um trabalho bem estruturado" }
    ],
    content: "Uso real: Mapear o nível de referência de experiência do aluno. Essa resposta não limita a oferta — ela indica de onde o aluno está partindo.",
    offers: [
      { k: "Orientação básica", v: "Planejamento / Grupos / Time Efficient" },
      { k: "Busca por eficiência", v: "Híbrido / 30 min individual" },
      { k: "Alta qualidade", v: "Premium 60 ou 30 min" }
    ],
    conduct: "O treino deve mostrar ao aluno o que é, de fato, um alto nível de serviço. Isso começa antes mesmo do primeiro movimento."
  },
  {
    id: 'p2a',
    title: "P2.1 — Condição Física",
    subtitle: "Autopercepção de desempenho",
    question: "De 1 a 5, como você avalia sua condição física hoje?",
    content: "Uso real: Mapear como o aluno percebe sua capacidade funcional — força, resistência, mobilidade. Essa percepção será cruzada com o desempenho real durante o treino.",
    scenarios: [
      { 
        t: "Aluno se percebe melhor do que está", 
        d: "Reduza o discurso e deixe o treino mostrar limites reais. Ajuste expectativa com base no que foi observado, sem exposição.",
        q: "Pelo que eu observei no seu agachamento, se melhorarmos a mobilidade de tornozelo você conseguirá aumentar a carga sem sobrecarregar tanto a lombar."
      },
      { 
        t: "Aluno se percebe pior do que está", 
        d: "Reforce competência e capacidade. Reposicione a autoconfiança do aluno imediatamente.",
        q: "Mesmo você tendo se avaliado mais baixo, o que eu vi na prática mostra que você está mais condicionado do que imagina."
      }
    ],
    objectives: [
      "Mapear autopercepção de capacidade física",
      "Identificar gap entre percepção e realidade",
      "Preparar ajuste de discurso pós-treino"
    ]
  },
  {
    id: 'p2b',
    title: "P2.2 — Satisfação Corporal",
    subtitle: "Autopercepção estética",
    question: "De 1 a 5, o quão satisfeito(a) você está com o seu corpo?",
    content: "Uso real: Mapear como o aluno se sente em relação à própria aparência. Essa resposta indica o peso emocional que a estética tem na motivação — e como calibrar o discurso.",
    scenarios: [
      { 
        t: "Baixa satisfação (1-2)", 
        d: "Aluno tem alta carga emocional sobre estética. Evite reforçar insatisfação. Foque em processo e conquistas técnicas, não em resultado visual imediato.",
        q: "O corpo muda como consequência do processo. Meu papel é garantir que esse processo seja sustentável e não frustrante."
      },
      { 
        t: "Satisfação moderada (3)", 
        d: "Aluno tem expectativas realistas. Aproveite para construir metas claras e progressivas.",
        q: "Você está num ponto interessante — com ajustes bem direcionados, os resultados vão aparecer de forma consistente."
      },
      { 
        t: "Alta satisfação (4-5)", 
        d: "Aluno já se sente bem. O foco pode ser performance, saúde ou refinamento. Não force discurso estético.",
        q: "Como você já está satisfeito com seu corpo, podemos focar em performance, longevidade ou algum objetivo específico que te motive."
      }
    ],
    objectives: [
      "Entender o peso emocional da estética na motivação",
      "Calibrar discurso (evitar gatilhos ou promessas vazias)",
      "Direcionar foco: estética vs. performance vs. saúde"
    ]
  },
  {
    id: 'p3',
    title: "P3 — Objetivo e Áreas",
    subtitle: "Foco no desejo explícito",
    question: "Qual é o seu principal objetivo? Quais áreas do corpo você gostaria de melhorar?",
    content: "Uso real: Identificar o desejo explícito do aluno. O treino experimental deve tocar diretamente nesse desejo, gerando sensação clara de direcionamento.",
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
    question: "Qual período do dia você reservou para treinar?",
    content: "Uso real: Mapear disponibilidade real de horário. Essa pergunta existe para entender se o período é concorrido ou ocioso, e se o profissional tem agenda disponível. Não é sobre experiência — é sobre logística e viabilidade comercial.",
    scenarios: [
      { 
        t: "Horários de Pico (6h–9h / 18h–21h)", 
        d: "Avaliar disponibilidade real e preparar discurso de escassez com clareza.", 
        q: "Hoje eu não tenho esse horário disponível, mas podemos começar com outras opções de serviços do meu portfólio e, assim que surgir uma vaga, eu te aviso.",
        alternatives: [
          "Oferecer planejamento + sessões quinzenais",
          "Oferecer modelo híbrido temporário",
          "Possibilidade de treino em dupla com outro cliente de perfil parecido",
          "Trabalhar com lista de espera consciente"
        ],
        followUp: "Objetivo: não perder dinheiro por falta de horário."
      },
      { 
        t: "Horários Ociosos (14h–17h)", 
        d: "Oportunidade de facilitar entrada ou valor diferenciado, se fizer sentido para o negócio.", 
        q: "Tenho uma condição especial para este horário que ajuda a otimizar minha grade.",
        alternatives: [
          "Oferecer condição diferenciada de entrada",
          "Pacotes com valor ajustado para horários de baixa demanda",
          "Sessões de maior duração pelo mesmo valor"
        ],
        followUp: "Objetivo: compor a grade em horários de menor procura, oferecendo atendimento com mais flexibilidade."
      }
    ],
    quote: "Hoje eu não tenho esse horário disponível, mas a gente pode começar com um modelo híbrido. Assim que abrir vaga, eu te encaixo.",
    objectives: [
      "Evitar promessas que não podem ser cumpridas",
      "Proteger a agenda do profissional",
      "Não perder o aluno por não ter horário"
    ],
    principle: "Não atender quem quer comprar não é falta de horário — é falta de estratégia."
  },
  {
    id: 'p5',
    title: "P5 — Frequência Semanal",
    subtitle: "Proteção contra o abandono",
    question: "Quantas vezes por semana você pretende treinar?",
    content: "Uso real: Essa pergunta não serve para montar volume ideal de treino. Ela serve para identificar o risco de insucesso. Cruze sempre com histórico recente e resposta da P6.",
    conduct: "O papel do profissional é proteger o aluno de repetir o mesmo erro. Em vez de validar a meta irreal, reduza a meta inicial, aumente a chance de sucesso e construa disciplina antes de volume.",
    quote: "Por mais que treinar cinco vezes por semana seja o seu objetivo hoje — e, sendo bem transparente, financeiramente para mim isso também seria interessante — eu acredito que essa não seja a melhor estratégia para você agora. Você mesmo me contou que tem dificuldade de incluir o exercício na rotina. Então, para aumentar muito a sua chance de dar certo, eu sugiro começarmos com o mínimo possível: duas vezes por semana, de 30 a 60 minutos, bem feitas.",
    principle: "Começar com o mínimo viável (hábitos progressivos): menos barreira de entrada, mais consistência, maior chance de evolução real.",
    objectives: [
      "Evitar frustração precoce",
      "Reduzir abandono",
      "Aumentar aderência",
      "Construir disciplina antes de aumentar frequência"
    ]
  },
  {
    id: 'p6',
    title: "P6 — Maior Dificuldade",
    subtitle: "Ajuste do formato à vida real",
    question: "Qual é a sua maior dificuldade com o exercício físico?",
    content: "Uso real: Identificar o principal motivo pelo qual o aluno não consegue manter o exercício na rotina. Essa pergunta é prática — ela aponta onde o processo costuma quebrar.",
    mapping: [
      { label: "Treinos monótonos", val: "Exercícios combinados (supersets, trisets), intervalos curtos, alta densidade. Alternativa: treinos de 30 min densos." },
      { label: "Falta de regularidade", val: "O problema não é esforço, é hábito. Reduzir meta inicial, evitar volumes altos. Alternativa: 2 treinos/semana de 30-60 min." },
      { label: "Falta de tempo", val: "O exercício não cabe na rotina. Mostrar eficiência do estímulo. Alternativa: 2 treinos semanais de 30 min (Time Efficient)." },
      { label: "Dificuldade em acordar cedo", val: "O horário é o obstáculo. Avaliar horários alternativos. Alternativa: períodos da tarde/noite, horários menos concorridos." }
    ],
    objectives: [
      "Ajustar o formato do serviço à vida real do aluno",
      "Reduzir abandono",
      "Aumentar aderência desde o início"
    ]
  },
  {
    id: 'p7',
    title: "P7 — Expectativa do Final",
    subtitle: "Critério de sucesso da sessão",
    question: "O que você espera atingir ao final do treino experimental?",
    content: "Uso real: Entender qual é o critério de sucesso do aluno para aquela sessão. Essa pergunta revela o nível de intensidade esperado e como ele vai julgar se o treino foi bom.",
    conduct: "A intensidade deve ser ajustada cruzando: expectativa declarada + autopercepção (P2) + leitura real do profissional. O erro é entregar a mesma intensidade para todos.",
    types: [
      { t: "Busca Intensidade (boa condição)", d: "Aluno associa resultado a esforço e dor. Aumentar volume, reduzir intervalos, gerar dor muscular perceptível (se seguro)." },
      { t: "Busca Funcionalidade (idoso/funcional)", d: "Objetivo é mover-se melhor, com menos dor. Controlar volume, ajustar amplitude, priorizar execução e conforto, evitar dor residual." },
      { t: "Busca Hipertrofia (treinado)", d: "Intensidade é central. Estímulos fortes, tensão mecânica elevada, fadiga local clara." }
    ],
    objectives: [
      "Ajustar corretamente a intensidade do treino experimental",
      "Evitar frustração por entrega incompatível",
      "Aumentar percepção de personalização e competência"
    ]
  },
  {
    id: 'p8',
    title: "P8 — Dor ou Lesão",
    subtitle: "O maior gatilho de conversão",
    question: "Você sente alguma dor ou possui alguma lesão importante que devemos levar em consideração?",
    content: "Uso real: Identificar oportunidades técnicas de alto valor. Essa pergunta não existe apenas por segurança — ela existe para criar oportunidade de demonstração técnica imediata. Quando bem conduzida, pode ser o maior gatilho de conversão da sessão.",
    conduct: "Se o aluno responder SIM e você tiver capacidade técnica: realize avaliação biomecânica simples, observe padrões compensatórios, identifique disfunções básicas. O objetivo não é fechar diagnóstico, mas corrigir o padrão momentaneamente, reduzir desconforto e melhorar percepção de movimento.",
    quote: "Isso que você sentia não é algo fixo. É um padrão de movimento que a gente consegue melhorar com o treino certo.",
    list: [
      "Demonstrar competência técnica real",
      "Gerar confiança imediata através de alívio ou correção",
      "Facilitar fechamento sem esforço comercial"
    ]
  },
  {
    id: 'parq',
    title: "PAR-Q",
    subtitle: "Questionário de Prontidão",
    content: "O PAR-Q (Questionário de Prontidão para Atividade Física) deve ser aplicado como instrumento de segurança, separado da condução comercial.",
    list: [
      "Identificar riscos à saúde",
      "Garantir responsabilidade profissional",
      "Proteger aluno e treinador"
    ],
    highlight: "O PAR-Q não é ferramenta de venda. Ele é ferramenta de proteção."
  },
  {
    id: 'final',
    title: "A Regra Final",
    content: "Este documento deve ser usado antes, durante e após o treino experimental.",
    list: [
      "O questionário orienta a condução técnica",
      "O treino experimental gera percepção de valor real",
      "O fechamento encaixa a melhor oferta do portfólio"
    ],
    highlight: "O aluno não compra porque respondeu um formulário. Ele compra porque viveu a experiência certa."
  }
];