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
    id: 'sumario',
    type: 'toc',
    title: "Sumário",
    subtitle: "Navegue pelo Manual",
    tocItems: [
      { id: 'intro-conversao', title: 'O Conceito E.R.A.', pageNumber: 3 },
      { id: 'base-conversao', title: 'O Triângulo da Conversão', pageNumber: 4 },
      { id: 'ia_assistant', title: 'Consultoria IA', pageNumber: 5 },
      { id: 'portfolio', title: 'Portfólio Recomendado', pageNumber: 6 },
      { id: 'p1', title: 'P1 — Perfil de Busca', pageNumber: 7 },
      { id: 'p2a', title: 'P2.1 — Condição Física', pageNumber: 8 },
      { id: 'p2b', title: 'P2.2 — Satisfação Corporal', pageNumber: 9 },
      { id: 'p3', title: 'P3 — Objetivo e Áreas', pageNumber: 10 },
      { id: 'p4', title: 'P4 — Período do Dia', pageNumber: 11 },
      { id: 'p5', title: 'P5 — Frequência Semanal', pageNumber: 12 },
      { id: 'p6', title: 'P6 — Maior Dificuldade', pageNumber: 13 },
      { id: 'p7', title: 'P7 — Expectativa do Final', pageNumber: 14 },
      { id: 'p8', title: 'P8 — Dor ou Lesão', pageNumber: 15 },
      { id: 'checklist-pre', title: 'Checklist Pré-Treino', pageNumber: 16 },
      { id: 'parq', title: 'PAR-Q', pageNumber: 17 },
      { id: 'checklist-pos', title: 'Checklist Pós-Treino', pageNumber: 18 },
      { id: 'final', title: 'A Regra Final', pageNumber: 19 }
    ]
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
    type: 'ai_tool',
    aiExamples: [
      "Aluno diz que está caro. O que responder?",
      "Aluno com dor no joelho quer treinar pesado",
      "Aluno quer treinar 5x por semana mas nunca foi regular",
      "Aluno frustrado com resultados de outro personal",
      "Aluno sedentário há 2 anos quer emagrecer rápido"
    ]
  },
  {
    id: 'portfolio',
    title: "Portfólio Recomendado",
    subtitle: "Diversifique para Converter",
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
    ],
    objectives: [
      "Nunca perder cliente por falta de horário",
      "Maximizar renda por hora trabalhada",
      "Oferecer entrada acessível para todos os perfis",
      "Criar escada de valor (upgrade natural)"
    ],
    principle: "Não atender quem quer comprar não é falta de horário — é falta de estratégia."
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
    scenarios: [
      {
        t: "Primeira experiência (Opção A)",
        d: "Aluno sem referência anterior. Oportunidade de definir o padrão de qualidade desde o início.",
        q: "Como é sua primeira vez, vou te mostrar na prática o que diferencia um trabalho bem feito. Depois você vai ter parâmetro de comparação."
      },
      {
        t: "Buscando eficiência (Opção B)",
        d: "Aluno teve experiência básica e quer upgrade. Demonstre organização e método.",
        q: "Entendi que você já teve uma experiência, mas sentiu que faltou estrutura. Vou te mostrar como funciona um planejamento de verdade."
      },
      {
        t: "Alta qualidade (Opção C)",
        d: "Aluno já conhece bom serviço. Expectativa alta — entregue excelência técnica.",
        q: "Se você já conhece um trabalho de qualidade, meu papel é superar ou igualar esse padrão. Vamos ver na prática."
      },
      {
        t: "Em dúvida (Opção D)",
        d: "Aluno precisa de educação sobre o serviço. Seja didático e transparente.",
        q: "Vou te explicar na prática como funciona um acompanhamento profissional. Assim você decide com clareza."
      }
    ],
    offers: [
      { k: "Orientação básica", v: "Planejamento / Grupos / Time Efficient" },
      { k: "Busca por eficiência", v: "Híbrido / 30 min individual" },
      { k: "Alta qualidade", v: "Premium 60 ou 30 min" },
      { k: "Em dúvida", v: "Experimental + Explicação detalhada" }
    ],
    conduct: "O treino deve mostrar ao aluno o que é, de fato, um alto nível de serviço. Isso começa antes mesmo do primeiro movimento.",
    principle: "A primeira impressão define a régua. Quem define o padrão é você, não o aluno."
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
      },
      {
        t: "Percepção alinhada com realidade",
        d: "Aluno tem boa leitura de si. Valide a percepção e construa confiança mútua.",
        q: "Sua autoavaliação está bem calibrada. Isso me ajuda a planejar com mais precisão desde o início."
      }
    ],
    objectives: [
      "Mapear autopercepção de capacidade física",
      "Identificar gap entre percepção e realidade",
      "Preparar ajuste de discurso pós-treino"
    ],
    principle: "O treino experimental é um espelho. Use-o para alinhar percepção com realidade."
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
    ],
    principle: "Nunca venda resultado estético. Venda processo sustentável."
  },
  {
    id: 'p3',
    title: "P3 — Objetivo e Áreas",
    subtitle: "Foco no desejo explícito",
    question: "Qual é o seu principal objetivo? Quais áreas do corpo você gostaria de melhorar?",
    content: "Uso real: Identificar o desejo explícito do aluno. O treino experimental deve tocar diretamente nesse desejo, gerando sensação clara de direcionamento.",
    mapping: [
      { label: "Glúteos / Pernas", val: "Sequência com maior solicitação técnica e volume local. Demonstre conhecimento biomecânico específico." },
      { label: "Emagrecimento", val: "Treino dinâmico, integrado e com densidade elevada. Mostre que intensidade não é só correr na esteira." },
      { label: "Hipertrofia Geral", val: "Estímulos com tensão mecânica clara, técnica impecável e controle de tempo sob tensão." },
      { label: "Saúde / Longevidade", val: "Treino funcional equilibrado: mobilidade, estabilidade, força. Discurso de qualidade de vida." },
      { label: "Performance Esportiva", val: "Periodização específica para modalidade. Demonstre conhecimento do esporte do aluno." },
      { label: "Reabilitação / Dor", val: "Trabalho corretivo, progressão controlada. Foco em movimento seguro e alívio." }
    ],
    objectives: [
      "Mapear desejo explícito do aluno",
      "Direcionar o treino experimental para gerar conexão imediata",
      "Demonstrar capacidade técnica no tema específico"
    ],
    principle: "O objetivo não é prometer resultado, é demonstrar capacidade técnica de entregá-lo."
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
          "Planejamento + sessões quinzenais presenciais",
          "Modelo híbrido temporário até abrir vaga",
          "Treino em dupla com outro cliente de perfil parecido",
          "Lista de espera consciente com prazo estimado"
        ]
      },
      { 
        t: "Horários Ociosos (14h–17h)", 
        d: "Oportunidade de facilitar entrada ou valor diferenciado, se fizer sentido para o negócio.", 
        q: "Tenho uma condição especial para este horário que ajuda a otimizar minha grade.",
        alternatives: [
          "Condição diferenciada de entrada (desconto no primeiro mês)",
          "Pacotes com valor ajustado para horários de baixa demanda",
          "Sessões de maior duração pelo mesmo valor"
        ]
      }
    ],
    objectives: [
      "Evitar promessas que não podem ser cumpridas",
      "Proteger a agenda do profissional",
      "Não perder o aluno por não ter horário",
      "Transformar objeção em oportunidade de venda"
    ],
    principle: "Não ter horário não é problema. Não ter alternativa é."
  },
  {
    id: 'p5',
    title: "P5 — Frequência Semanal",
    subtitle: "Proteção contra o abandono",
    question: "Quantas vezes por semana você pretende treinar?",
    content: "Uso real: Essa pergunta não serve para montar volume ideal de treino. Ela serve para identificar o risco de insucesso. Cruze sempre com histórico recente e resposta da P6.",
    scenarios: [
      {
        t: "Meta alta + histórico ruim",
        d: "Aluno quer treinar 4-5x mas nunca manteve regularidade. Alto risco de frustração.",
        q: "Entendo que você quer treinar bastante, mas me conta: nos últimos meses, quantas vezes por semana você conseguiu manter de verdade?"
      },
      {
        t: "Meta realista + histórico bom",
        d: "Aluno tem meta compatível com histórico. Valide e construa progressão.",
        q: "Sua meta está alinhada com o que você já demonstrou conseguir manter. Vamos começar assim e ajustar conforme evoluir."
      },
      {
        t: "Meta baixa + vontade alta",
        d: "Aluno sendo conservador. Valide a prudência e deixe porta aberta para aumento.",
        q: "Começar com menos e aumentar é sempre mais inteligente do que o contrário. Vamos construir o hábito primeiro."
      }
    ],
    conduct: "O papel do profissional é proteger o aluno de repetir o mesmo erro. Em vez de validar a meta irreal, reduza a meta inicial, aumente a chance de sucesso e construa disciplina antes de volume.",
    quote: "Por mais que treinar cinco vezes por semana seja o seu objetivo hoje — e, sendo bem transparente, financeiramente para mim isso também seria interessante — eu acredito que essa não seja a melhor estratégia para você agora. Você mesmo me contou que tem dificuldade de incluir o exercício na rotina. Então, para aumentar muito a sua chance de dar certo, eu sugiro começarmos com o mínimo possível: duas vezes por semana, de 30 a 60 minutos, bem feitas.",
    principle: "Começar com o mínimo viável: menos barreira de entrada, mais consistência, maior chance de evolução real.",
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
    scenarios: [
      {
        t: "Treinos monótonos / Falta de motivação",
        d: "O problema é engajamento. Treino precisa ser interessante e variado.",
        q: "Se a monotonia é o problema, meu papel é garantir que cada sessão seja diferente e desafiadora. Você nunca vai saber exatamente o que te espera.",
        alternatives: [
          "Exercícios combinados (supersets, trisets)",
          "Intervalos curtos, alta densidade",
          "Treinos de 30 min intensos"
        ]
      },
      {
        t: "Falta de regularidade / Disciplina",
        d: "O problema não é esforço, é hábito. Reduza meta inicial.",
        q: "Se manter a regularidade é difícil, a estratégia é começar tão pequeno que fica impossível falhar. Depois a gente aumenta.",
        alternatives: [
          "2 treinos/semana de 30-60 min",
          "Horários fixos não-negociáveis",
          "Check-in semanal de accountability"
        ]
      },
      {
        t: "Falta de tempo",
        d: "O exercício não cabe na rotina. Mostre eficiência do estímulo.",
        q: "Se tempo é o problema, vou te mostrar que 30 minutos bem feitos valem mais que 1 hora mal aproveitada.",
        alternatives: [
          "Treinos de 30 min (Time Efficient)",
          "2x por semana com alta densidade",
          "Modelo híbrido (presencial + casa)"
        ]
      },
      {
        t: "Dificuldade em acordar cedo",
        d: "O horário é o obstáculo. Avalie alternativas.",
        q: "Se acordar cedo é o problema, vamos encontrar um horário que funcione com seu ritmo natural.",
        alternatives: [
          "Períodos da tarde/noite",
          "Horários menos concorridos com condição especial",
          "Treinos em casa pela manhã + presencial à noite"
        ]
      }
    ],
    objectives: [
      "Ajustar o formato do serviço à vida real do aluno",
      "Reduzir abandono",
      "Aumentar aderência desde o início"
    ],
    principle: "Não force o aluno a se adaptar ao seu método. Adapte o método à vida dele."
  },
  {
    id: 'p7',
    title: "P7 — Expectativa do Final",
    subtitle: "Critério de sucesso da sessão",
    question: "O que você espera atingir ao final do treino experimental?",
    content: "Uso real: Entender qual é o critério de sucesso do aluno para aquela sessão. Essa pergunta revela o nível de intensidade esperado e como ele vai julgar se o treino foi bom.",
    scenarios: [
      {
        t: "Quer sair \"destruído\"",
        d: "Aluno associa resultado a esforço extremo. Entregue intensidade COM segurança.",
        q: "Posso te entregar essa sensação, mas vou fazer isso de forma inteligente — intensidade máxima onde dá, controle onde precisa.",
        alternatives: [
          "Aumentar volume nos grupos musculares alvo",
          "Reduzir intervalos estrategicamente",
          "Técnicas de intensificação (drop sets, rest-pause)"
        ]
      },
      {
        t: "Quer entender a metodologia",
        d: "Aluno quer aprender, não só sentir. Seja didático durante a sessão.",
        q: "Vou explicar o porquê de cada exercício enquanto fazemos. Você vai entender a lógica por trás do treino.",
        alternatives: [
          "Explicar a função de cada exercício",
          "Mostrar progressões e regressões",
          "Discutir periodização básica"
        ]
      },
      {
        t: "Quer testar a conexão pessoal",
        d: "Aluno está avaliando você como pessoa, não só como técnico. Seja genuíno.",
        q: "Além da técnica, o mais importante é a gente se dar bem no processo. Vamos ver se temos essa conexão.",
        alternatives: [
          "Conversa genuína durante intervalos",
          "Demonstrar interesse real pela história dele",
          "Ser autêntico, não performático"
        ]
      }
    ],
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
    ],
    principle: "O melhor treino é o que o aluno esperava — mas entregue melhor do que ele imaginava."
  },
  {
    id: 'p8',
    title: "P8 — Dor ou Lesão",
    subtitle: "O maior gatilho de conversão",
    question: "Você sente alguma dor ou possui alguma lesão importante que devemos levar em consideração?",
    content: "Uso real: Identificar oportunidades técnicas de alto valor. Essa pergunta não existe apenas por segurança — ela existe para criar oportunidade de demonstração técnica imediata. Quando bem conduzida, pode ser o maior gatilho de conversão da sessão.",
    scenarios: [
      {
        t: "Dor crônica (joelho, ombro, lombar)",
        d: "Oportunidade máxima de demonstrar competência. Avalie o padrão de movimento e corrija.",
        q: "Essa dor que você sente não é necessariamente algo fixo. Deixa eu avaliar o padrão de movimento e te mostrar uma forma de reduzir isso agora.",
        alternatives: [
          "Avaliação biomecânica simplificada",
          "Correção de padrão de movimento",
          "Exercício corretivo com alívio imediato"
        ]
      },
      {
        t: "Lesão antiga recuperada",
        d: "Aluno tem receio de reincidir. Demonstre conhecimento preventivo.",
        q: "Mesmo recuperado, é importante fortalecer a região para prevenir recidiva. Vou incluir trabalho específico para isso.",
        alternatives: [
          "Fortalecimento preventivo",
          "Progressão conservadora na região",
          "Monitoramento de sintomas"
        ]
      },
      {
        t: "Sem dor ou lesão",
        d: "Menos urgência, mas ainda há espaço para demonstrar conhecimento preventivo.",
        q: "Ótimo que você não tem dor. Vou observar seus padrões de movimento para prevenir que apareça alguma no futuro."
      }
    ],
    conduct: "Se o aluno responder SIM e você tiver capacidade técnica: realize avaliação biomecânica simples, observe padrões compensatórios, identifique disfunções básicas. O objetivo não é fechar diagnóstico, mas corrigir o padrão momentaneamente, reduzir desconforto e melhorar percepção de movimento.",
    list: [
      "Demonstrar competência técnica real",
      "Gerar confiança imediata através de alívio ou correção",
      "Facilitar fechamento sem esforço comercial"
    ],
    quote: "Isso que você sentia não é algo fixo. É um padrão de movimento que a gente consegue melhorar com o treino certo.",
    principle: "Quem resolve dor no experimental quase nunca perde o fechamento."
  },
  {
    id: 'checklist-pre',
    type: 'checklist',
    title: "Checklist Pré-Treino",
    subtitle: "Antes de Iniciar a Sessão",
    content: "Verifique todos os itens antes de começar o treino experimental. Um profissional preparado transmite segurança e competência.",
    checklistItems: [
      { text: "Questionário P1-P8 preenchido e analisado", category: "Preparação" },
      { text: "Espaço de treino organizado e equipamentos separados", category: "Preparação" },
      { text: "PAR-Q aplicado e assinado", category: "Segurança" },
      { text: "Plano B de exercícios preparado (caso identifique limitações)", category: "Segurança" },
      { text: "Portfólio de serviços memorizado", category: "Comercial" },
      { text: "Condições especiais definidas (se aplicável)", category: "Comercial" },
      { text: "Horários disponíveis mapeados", category: "Comercial" },
      { text: "Roupa adequada e apresentação profissional", category: "Imagem" },
      { text: "Pontualidade (chegar 10min antes)", category: "Imagem" }
    ],
    principle: "O treino experimental começa antes do aluno chegar."
  },
  {
    id: 'parq',
    title: "PAR-Q",
    subtitle: "Questionário de Prontidão",
    content: "O PAR-Q (Questionário de Prontidão para Atividade Física) deve ser aplicado como instrumento de segurança, separado da condução comercial. Ele protege você e o aluno.",
    parqQuestions: [
      { question: "Algum médico já disse que você possui algum problema de coração e que só deveria fazer atividade física supervisionada por profissionais de saúde?", guidance: "Se SIM: exigir liberação médica antes de iniciar. Não negocie." },
      { question: "Você sente dores no peito quando pratica atividade física?", guidance: "Se SIM: encaminhar para avaliação cardiológica. Não inicie sem liberação." },
      { question: "No último mês, você sentiu dores no peito quando praticava atividade física?", guidance: "Se SIM: investigar causa. Liberação médica recomendada." },
      { question: "Você apresenta desequilíbrio devido à tontura e/ou perda de consciência?", guidance: "Se SIM: investigar causa. Pode indicar problema cardiovascular ou neurológico." },
      { question: "Você possui algum problema ósseo ou articular que poderia ser piorado pela atividade física?", guidance: "Se SIM: adaptar treino. Progressão conservadora. Evitar sobrecarga na região." },
      { question: "Você toma atualmente algum medicamento para pressão arterial ou problema de coração?", guidance: "Se SIM: conhecer o medicamento. Atenção à frequência cardíaca e pressão. Hidratação." },
      { question: "Sabe de alguma outra razão pela qual você não deve praticar atividade física?", guidance: "Se SIM: investigar. Documentar e adaptar conforme necessário." }
    ],
    list: [
      "Identificar riscos à saúde antes de iniciar",
      "Garantir responsabilidade profissional documentada",
      "Proteger aluno e treinador juridicamente",
      "Demonstrar profissionalismo e seriedade"
    ],
    conduct: "Aplique o PAR-Q de forma séria, mas não assustadora. Explique que é protocolo padrão de profissionais qualificados. Se alguma resposta for SIM, não improvise: siga a orientação ou encaminhe.",
    highlight: "O PAR-Q não é ferramenta de venda. Ele é ferramenta de proteção."
  },
  {
    id: 'checklist-pos',
    type: 'checklist',
    title: "Checklist Pós-Treino",
    subtitle: "Fechamento e Follow-up",
    content: "O treino experimental não termina quando o aluno sai. O fechamento e o follow-up são tão importantes quanto a sessão.",
    checklistItems: [
      { text: "Feedback verbal imediato (perguntar como se sentiu)", category: "Fechamento" },
      { text: "Resumir o que foi observado (pontos fortes e oportunidades)", category: "Fechamento" },
      { text: "Apresentar a proposta adequada ao perfil", category: "Fechamento" },
      { text: "Não pressionar — deixar espaço para decisão", category: "Fechamento" },
      { text: "Agendar próximo passo (mesmo que seja \"vou pensar\")", category: "Follow-up" },
      { text: "Enviar mensagem de agradecimento em até 2h", category: "Follow-up" },
      { text: "Enviar resumo do treino + proposta por escrito", category: "Follow-up" },
      { text: "Fazer follow-up em 24-48h se não houver resposta", category: "Follow-up" },
      { text: "Registrar observações no CRM/planilha para futuro", category: "Registro" }
    ],
    principle: "O follow-up transforma \"vou pensar\" em \"fechado\"."
  },
  {
    id: 'final',
    title: "A Regra Final",
    subtitle: "O Princípio Fundamental",
    content: "Este documento deve ser usado antes, durante e após o treino experimental. Ele não é um script decorado — é um sistema de pensamento.",
    list: [
      "O questionário orienta a condução técnica",
      "O treino experimental gera percepção de valor real",
      "O fechamento encaixa a melhor oferta do portfólio"
    ],
    quote: "A venda acontece quando o aluno percebe que você é a solução certa para o problema dele. Seu trabalho é criar essa percepção com verdade e competência.",
    highlight: "O aluno não compra porque respondeu um formulário. Ele compra porque viveu a experiência certa."
  }
];
