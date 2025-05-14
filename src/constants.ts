
export const CONSEQUENCE_PHRASES = [
  "Ignorar isso não muda nada na minha vida.",
  "Sei que devia fazer, mas não vou me cobrar.",
  "Vai dar aquela sensação de \"tô enrolando\", mas ainda dá pra tolerar.",
  "Se eu ignorar, vou ficar incomodado.",
  "Vou me sentir bem mal comigo mesmo por não ter feito."
];

export const PRIDE_PHRASES = [
  "Nenhum orgulho. Só rotina ou tarefa obrigatória.",
  "Leve alívio por ter feito.",
  "Boa sensação de ter mantido o ritmo.",
  "Vou me olhar com respeito.",
  "Total senso de potência. Vou me sentir acima da média."
];

export const CONSTRUCTION_PHRASES = [
  "Só me ocupa.",
  "Útil, mas não muda nada em mim.",
  "Me move um pouco, mas não me desafia.",
  "Vai me posicionar num degrau acima da versão atual.",
  "Essa tarefa solidifica quem eu quero me tornar."
];

export const SAMPLE_TASKS: Array<Omit<import('./types').Task, 'id' | 'createdAt'>> = [
  {
    title: "Criar novo vídeo falando sobre Produtividade",
    consequenceScore: 5,
    prideScore: 4,
    constructionScore: 5,
    totalScore: 14,
    idealDate: new Date(2023, 5, 25, 8, 0),
    hidden: false,
    completed: false
  },
  {
    title: "Preparar apresentação para o cliente XYZ",
    consequenceScore: 4,
    prideScore: 3,
    constructionScore: 4,
    totalScore: 11,
    idealDate: new Date(2023, 5, 26, 14, 0),
    hidden: false,
    completed: false
  },
  {
    title: "Revisar e-mails pendentes",
    consequenceScore: 3,
    prideScore: 2,
    constructionScore: 2,
    totalScore: 7,
    idealDate: null,
    hidden: true,
    completed: false
  },
  {
    title: "Escrever artigo sobre sistemas de produtividade",
    consequenceScore: 3,
    prideScore: 4,
    constructionScore: 3,
    totalScore: 10,
    idealDate: new Date(2023, 5, 28, 10, 0),
    hidden: false,
    completed: false
  }
];
