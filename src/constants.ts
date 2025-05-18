
import { ISODateString } from './types/dates';

export const CONSEQUENCE_PHRASES = [
  "Não tem problema algum ignorar",
  "Ignorar não pesa agora, mas tem sua importância",
  "Vai gerar um leve incômodo se não fizer",
  "Deixar isso de lado vai me atrapalhar",
  "Não fazer isso me deixará muito mal"
];

export const PRIDE_PHRASES = [
  "Isso não tem valor nenhum pra mim",
  "Vai evitar incômodo, mas não trará satisfação",
  "Vou sentir que fiz algo que valeu a pena",
  "Vou sentir que cumpri algo importante pra mim",
  "Vou ficar muito orgulhoso de mim mesmo!"
];

export const CONSTRUCTION_PHRASES = [
  "Isso não me move nem 1%",
  "Pode ser útil, mas não muda nada em quem eu sou",
  "Começa a me puxar pra cima, mesmo que só um pouco",
  "Me exige acima do meu normal. Me força a crescer enquanto faço",
  "Cada vez que faço algo assim, eu fico mais inabalável"
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
    completed: false,
    completedAt: null,
    feedback: null,
    comments: []
  },
  {
    title: "Preparar apresentação para o cliente XYZ",
    consequenceScore: 4,
    prideScore: 3,
    constructionScore: 4,
    totalScore: 11,
    idealDate: new Date(2023, 5, 26, 14, 0),
    hidden: false,
    completed: false,
    completedAt: null,
    feedback: null,
    comments: []
  },
  {
    title: "Revisar e-mails pendentes",
    consequenceScore: 3,
    prideScore: 2,
    constructionScore: 2,
    totalScore: 7,
    idealDate: null,
    hidden: true,
    completed: false,
    completedAt: null,
    feedback: null,
    comments: []
  },
  {
    title: "Escrever artigo sobre sistemas de produtividade",
    consequenceScore: 3,
    prideScore: 4,
    constructionScore: 3,
    totalScore: 10,
    idealDate: new Date(2023, 5, 28, 10, 0),
    hidden: false,
    completed: false,
    completedAt: null,
    feedback: null,
    comments: []
  }
];
