
/**
 * Arquivo de simulação do banco de dados
 * Este arquivo contém dados fixos que simulam informações que viriam do banco de dados.
 * Quando implementarmos o back-end, substituiremos isso por chamadas reais à API.
 */

import { Task, Comment } from '@/types';

/**
 * Estrutura do banco de dados proposta:
 * 
 * Tabela: tasks
 * -----------------
 * id (string): Identificador único da tarefa [PRIMARY KEY]
 * title (string): Título da tarefa
 * consequence_score (integer): Pontuação do pilar "Consequência/Risco" (1-5)
 * pride_score (integer): Pontuação do pilar "Orgulho" (1-5)
 * construction_score (integer): Pontuação do pilar "Construção/Crescimento" (1-5)
 * total_score (integer): Soma das pontuações dos três pilares
 * ideal_date (timestamp): Data ideal para completar a tarefa (pode ser nulo)
 * hidden (boolean): Se a tarefa está oculta ou não
 * completed (boolean): Se a tarefa foi concluída ou não
 * completed_at (timestamp): Data e hora em que a tarefa foi concluída (pode ser nulo)
 * created_at (timestamp): Data e hora de criação da tarefa
 * feedback (enum): Feedback após a conclusão - 'transformed', 'relief' ou 'obligation' (pode ser nulo)
 * pillar (string): Pilar principal da tarefa (pode ser nulo)
 * 
 * Tabela: comments
 * ----------------
 * id (string): Identificador único do comentário [PRIMARY KEY]
 * task_id (string): Referência à tarefa [FOREIGN KEY -> tasks.id]
 * text (string): Texto do comentário
 * created_at (timestamp): Data e hora de criação do comentário
 * 
 * Observações sobre o design do banco:
 * - A estrutura utiliza relacionamento 1:N entre tarefas e comentários
 * - As pontuações estão separadas para permitir análises específicas por pilar
 * - O campo total_score é redundante com as três pontuações, mas facilita consultas e ordenação
 * - O campo feedback usa um tipo enumerado para garantir apenas valores válidos
 * - As datas usam timestamp para precisão e compatibilidade com diferentes fusos horários
 */

// Simulação dos dados de tarefas pendentes
export const pendingTasksData: Task[] = [
  // Tarefas com foco em crescimento pessoal
  {
    id: "pend-001",
    title: "Fazer 4 aulas de inglês",
    consequenceScore: 3,
    prideScore: 4,
    constructionScore: 5,
    totalScore: 12,
    idealDate: new Date(2025, 4, 18, 10, 0), // 18/05/2025 10:00
    hidden: false,
    completed: false,
    createdAt: new Date(2025, 4, 10, 8, 30), // 10/05/2025 08:30
    pillar: "crescimento",
    feedback: null,
    comments: [
      {
        id: "comm-001",
        text: "Preciso focar nas aulas de conversação",
        createdAt: "2025-05-11T14:30:00.000Z"
      }
    ]
  },
  {
    id: "pend-002",
    title: "Meditar por 20 minutos diários",
    consequenceScore: 2,
    prideScore: 4,
    constructionScore: 5,
    totalScore: 11,
    idealDate: new Date(2025, 4, 16, 6, 0), // 16/05/2025 06:00 (hoje)
    hidden: false,
    completed: false,
    createdAt: new Date(2025, 4, 9, 22, 15), // 09/05/2025 22:15
    pillar: "crescimento",
    feedback: null,
    comments: []
  },
  {
    id: "pend-003",
    title: "Ler livro sobre desenvolvimento pessoal",
    consequenceScore: 2,
    prideScore: 3,
    constructionScore: 5,
    totalScore: 10,
    idealDate: new Date(2025, 4, 21, 20, 0), // 21/05/2025 20:00
    hidden: false,
    completed: false,
    createdAt: new Date(2025, 4, 12, 17, 45), // 12/05/2025 17:45
    pillar: "crescimento",
    feedback: null,
    comments: []
  },
  
  // Tarefas profissionais importantes
  {
    id: "pend-004",
    title: "Finalizar relatório trimestral",
    consequenceScore: 5,
    prideScore: 4,
    constructionScore: 3,
    totalScore: 12,
    idealDate: new Date(2025, 4, 17, 17, 0), // 17/05/2025 17:00
    hidden: false,
    completed: false,
    createdAt: new Date(2025, 4, 5, 9, 10), // 05/05/2025 09:10
    pillar: "risco",
    feedback: null,
    comments: [
      {
        id: "comm-002",
        text: "Solicitar dados atualizados do departamento financeiro",
        createdAt: "2025-05-12T11:20:00.000Z"
      },
      {
        id: "comm-003",
        text: "Revisar gráficos da seção 3",
        createdAt: "2025-05-14T16:45:00.000Z"
      }
    ]
  },
  {
    id: "pend-005",
    title: "Preparar apresentação para diretoria",
    consequenceScore: 5,
    prideScore: 5,
    constructionScore: 4,
    totalScore: 14,
    idealDate: new Date(2025, 4, 19, 9, 0), // 19/05/2025 09:00
    hidden: false,
    completed: false,
    createdAt: new Date(2025, 4, 10, 14, 20), // 10/05/2025 14:20
    pillar: "risco",
    feedback: null,
    comments: []
  },
  
  // Tarefas com balanceamento nos pilares
  {
    id: "pend-006",
    title: "Planejar férias familiares",
    consequenceScore: 4,
    prideScore: 5,
    constructionScore: 3,
    totalScore: 12,
    idealDate: new Date(2025, 4, 23, 18, 30), // 23/05/2025 18:30
    hidden: false,
    completed: false,
    createdAt: new Date(2025, 4, 8, 20, 0), // 08/05/2025 20:00
    pillar: "orgulho",
    feedback: null,
    comments: []
  },
  {
    id: "pend-007",
    title: "Revisar planejamento financeiro",
    consequenceScore: 5,
    prideScore: 3,
    constructionScore: 4,
    totalScore: 12,
    idealDate: new Date(2025, 4, 20, 19, 0), // 20/05/2025 19:00
    hidden: false,
    completed: false,
    createdAt: new Date(2025, 4, 11, 21, 35), // 11/05/2025 21:35
    pillar: "risco",
    feedback: null,
    comments: []
  },
  
  // Tarefas mais cotidianas com scores menores
  {
    id: "pend-008",
    title: "Arrumar tomada de casa",
    consequenceScore: 2,
    prideScore: 2,
    constructionScore: 1,
    totalScore: 5,
    idealDate: new Date(2025, 4, 22, 10, 0), // 22/05/2025 10:00
    hidden: true,
    completed: false,
    createdAt: new Date(2025, 4, 12, 18, 15), // 12/05/2025 18:15
    pillar: "risco",
    feedback: null,
    comments: []
  },
  {
    id: "pend-009",
    title: "Organizar armário do escritório",
    consequenceScore: 1,
    prideScore: 3,
    constructionScore: 2,
    totalScore: 6,
    idealDate: new Date(2025, 4, 24, 14, 0), // 24/05/2025 14:00
    hidden: true,
    completed: false,
    createdAt: new Date(2025, 4, 13, 12, 45), // 13/05/2025 12:45
    pillar: "orgulho",
    feedback: null,
    comments: []
  },
  {
    id: "pend-010",
    title: "Atualizar aplicativos do celular",
    consequenceScore: 1,
    prideScore: 1,
    constructionScore: 1,
    totalScore: 3,
    idealDate: new Date(2025, 4, 25, 22, 0), // 25/05/2025 22:00
    hidden: true,
    completed: false,
    createdAt: new Date(2025, 4, 14, 23, 0), // 14/05/2025 23:00
    pillar: null,
    feedback: null,
    comments: []
  },
  
  // Tarefas vencidas (com datas anteriores a 16/05/2025)
  {
    id: "pend-011",
    title: "Enviar documentos para contabilidade",
    consequenceScore: 4,
    prideScore: 3,
    constructionScore: 2,
    totalScore: 9,
    idealDate: new Date(2025, 4, 3, 11, 54), // 03/05/2025 11:54 (vencida)
    hidden: false,
    completed: false,
    createdAt: new Date(2025, 3, 25, 9, 20), // 25/04/2025 09:20
    pillar: "risco",
    feedback: null,
    comments: []
  },
  {
    id: "pend-012",
    title: "Atualizar plano de marketing",
    consequenceScore: 5,
    prideScore: 4,
    constructionScore: 4,
    totalScore: 13,
    idealDate: new Date(2025, 4, 7, 9, 30), // 07/05/2025 09:30 (vencida)
    hidden: false,
    completed: false,
    createdAt: new Date(2025, 3, 28, 15, 40), // 28/04/2025 15:40
    pillar: "crescimento",
    feedback: null,
    comments: []
  },
  {
    id: "pend-013",
    title: "Revisar contrato de parceria",
    consequenceScore: 5,
    prideScore: 5,
    constructionScore: 3,
    totalScore: 13,
    idealDate: new Date(2025, 3, 28, 14, 15), // 28/04/2025 14:15 (vencida)
    hidden: false,
    completed: false,
    createdAt: new Date(2025, 3, 20, 11, 0), // 20/04/2025 11:00
    pillar: "risco",
    feedback: null,
    comments: []
  }
];

// Simulação dos dados de tarefas concluídas
export const completedTasksData: Task[] = [
  // Tarefas concluídas há mais tempo (40-60 dias atrás)
  {
    id: "comp-001",
    title: "Concluir relatório semestral",
    consequenceScore: 5,
    prideScore: 4,
    constructionScore: 4,
    totalScore: 13,
    idealDate: new Date(2025, 2, 15, 17, 0), // 15/03/2025 17:00
    hidden: false,
    completed: true,
    completedAt: "2025-03-18T16:45:22.000Z", // 18/03/2025 16:45:22 (58 dias atrás)
    createdAt: new Date(2025, 2, 1, 9, 0), // 01/03/2025 09:00
    feedback: "transformed",
    pillar: "risco",
    comments: []
  },
  {
    id: "comp-002",
    title: "Revisar documentação legal",
    consequenceScore: 4,
    prideScore: 3,
    constructionScore: 3,
    totalScore: 10,
    idealDate: new Date(2025, 2, 20, 12, 0), // 20/03/2025 12:00
    hidden: false,
    completed: true,
    completedAt: "2025-03-21T14:20:45.000Z", // 21/03/2025 14:20:45 (55 dias atrás)
    createdAt: new Date(2025, 2, 5, 10, 30), // 05/03/2025 10:30
    feedback: "obligation",
    pillar: "risco",
    comments: []
  },
  {
    id: "comp-003",
    title: "Finalizar auditoria interna",
    consequenceScore: 5,
    prideScore: 4,
    constructionScore: 3,
    totalScore: 12,
    idealDate: new Date(2025, 2, 22, 16, 0), // 22/03/2025 16:00
    hidden: false,
    completed: true,
    completedAt: "2025-03-24T18:10:05.000Z", // 24/03/2025 18:10:05 (52 dias atrás)
    createdAt: new Date(2025, 2, 8, 14, 0), // 08/03/2025 14:00
    feedback: "relief",
    pillar: "risco",
    comments: []
  },
  
  // 30-40 dias atrás
  {
    id: "comp-004",
    title: "Atualizar manuais operacionais",
    consequenceScore: 2,
    prideScore: 3,
    constructionScore: 4,
    totalScore: 9,
    idealDate: new Date(2025, 3, 8, 12, 0), // 08/04/2025 12:00
    hidden: false,
    completed: true,
    completedAt: "2025-04-08T15:45:30.000Z", // 08/04/2025 15:45:30 (38 dias atrás)
    createdAt: new Date(2025, 2, 25, 9, 20), // 25/03/2025 09:20
    feedback: "relief",
    pillar: "crescimento",
    comments: []
  },
  {
    id: "comp-005",
    title: "Finalizar orçamento do próximo trimestre",
    consequenceScore: 5,
    prideScore: 3,
    constructionScore: 3,
    totalScore: 11,
    idealDate: new Date(2025, 3, 10, 17, 0), // 10/04/2025 17:00
    hidden: false,
    completed: true,
    completedAt: "2025-04-11T18:30:15.000Z", // 11/04/2025 18:30:15 (35 dias atrás)
    createdAt: new Date(2025, 3, 1, 8, 45), // 01/04/2025 08:45
    feedback: "obligation",
    pillar: "risco",
    comments: [
      {
        id: "comm-comp-001",
        text: "Reunião com equipe financeira ajudou a esclarecer dúvidas",
        createdAt: "2025-04-05T10:15:00.000Z"
      }
    ]
  },
  
  // 20-30 dias atrás
  {
    id: "comp-006",
    title: "Implementar melhorias no sistema",
    consequenceScore: 3,
    prideScore: 4,
    constructionScore: 5,
    totalScore: 12,
    idealDate: new Date(2025, 3, 18, 10, 0), // 18/04/2025 10:00
    hidden: false,
    completed: true,
    completedAt: "2025-04-18T16:22:40.000Z", // 18/04/2025 16:22:40 (28 dias atrás)
    createdAt: new Date(2025, 3, 5, 11, 30), // 05/04/2025 11:30
    feedback: "transformed",
    pillar: "crescimento",
    comments: []
  },
  {
    id: "comp-007",
    title: "Finalizar negociação com cliente premium",
    consequenceScore: 5,
    prideScore: 5,
    constructionScore: 3,
    totalScore: 13,
    idealDate: new Date(2025, 3, 20, 14, 0), // 20/04/2025 14:00
    hidden: false,
    completed: true,
    completedAt: "2025-04-20T17:05:10.000Z", // 20/04/2025 17:05:10 (26 dias atrás)
    createdAt: new Date(2025, 3, 10, 9, 15), // 10/04/2025 09:15
    feedback: "relief",
    pillar: "risco",
    comments: [
      {
        id: "comm-comp-002",
        text: "Cliente aceitou termos mais favoráveis que o esperado",
        createdAt: "2025-04-15T14:30:00.000Z"
      },
      {
        id: "comm-comp-003",
        text: "Documentação final enviada para análise jurídica",
        createdAt: "2025-04-18T11:45:00.000Z"
      }
    ]
  },
  
  // 10-20 dias atrás
  {
    id: "comp-008",
    title: "Concluir pesquisa de satisfação",
    consequenceScore: 3,
    prideScore: 3,
    constructionScore: 4,
    totalScore: 10,
    idealDate: new Date(2025, 3, 28, 15, 0), // 28/04/2025 15:00
    hidden: false,
    completed: true,
    completedAt: "2025-04-28T16:40:25.000Z", // 28/04/2025 16:40:25 (18 dias atrás)
    createdAt: new Date(2025, 3, 15, 10, 20), // 15/04/2025 10:20
    feedback: "relief",
    pillar: "crescimento",
    comments: []
  },
  {
    id: "comp-009",
    title: "Atualizar site institucional",
    consequenceScore: 2,
    prideScore: 4,
    constructionScore: 3,
    totalScore: 9,
    idealDate: new Date(2025, 3, 30, 12, 0), // 30/04/2025 12:00
    hidden: false,
    completed: true,
    completedAt: "2025-04-30T14:55:38.000Z", // 30/04/2025 14:55:38 (16 dias atrás)
    createdAt: new Date(2025, 3, 20, 9, 0), // 20/04/2025 09:00
    feedback: "transformed",
    pillar: "orgulho",
    comments: []
  },
  
  // Última semana (7 dias atrás)
  {
    id: "comp-010",
    title: "Resolver problemas técnicos críticos",
    consequenceScore: 5,
    prideScore: 3,
    constructionScore: 2,
    totalScore: 10,
    idealDate: new Date(2025, 4, 9, 10, 0), // 09/05/2025 10:00
    hidden: false,
    completed: true,
    completedAt: "2025-05-09T11:25:15.000Z", // 09/05/2025 11:25:15 (7 dias atrás)
    createdAt: new Date(2025, 4, 7, 8, 30), // 07/05/2025 08:30
    feedback: "relief",
    pillar: "risco",
    comments: []
  },
  {
    id: "comp-011",
    title: "Finalizar apresentação para investidores",
    consequenceScore: 5,
    prideScore: 5,
    constructionScore: 4,
    totalScore: 14,
    idealDate: new Date(2025, 4, 11, 9, 0), // 11/05/2025 09:00
    hidden: false,
    completed: true,
    completedAt: "2025-05-11T08:50:30.000Z", // 11/05/2025 08:50:30 (5 dias atrás)
    createdAt: new Date(2025, 4, 5, 14, 0), // 05/05/2025 14:00
    feedback: "transformed",
    pillar: "orgulho",
    comments: []
  },
  
  // Tarefas concluídas mais recentemente (1-3 dias atrás)
  {
    id: "comp-012",
    title: "Concluir análise de concorrência",
    consequenceScore: 4,
    prideScore: 4,
    constructionScore: 3,
    totalScore: 11,
    idealDate: new Date(2025, 4, 13, 16, 0), // 13/05/2025 16:00
    hidden: false,
    completed: true,
    completedAt: "2025-05-13T18:20:45.000Z", // 13/05/2025 18:20:45 (3 dias atrás)
    createdAt: new Date(2025, 4, 8, 10, 15), // 08/05/2025 10:15
    feedback: "obligation",
    pillar: "crescimento",
    comments: []
  },
  {
    id: "comp-013",
    title: "Atualizar planilha de resultados",
    consequenceScore: 3,
    prideScore: 2,
    constructionScore: 2,
    totalScore: 7,
    idealDate: new Date(2025, 4, 15, 12, 0), // 15/05/2025 12:00
    hidden: true,
    completed: true,
    completedAt: "2025-05-15T11:40:20.000Z", // 15/05/2025 11:40:20 (1 dia atrás)
    createdAt: new Date(2025, 4, 10, 16, 30), // 10/05/2025 16:30
    feedback: "obligation",
    pillar: "risco",
    comments: []
  },
  {
    id: "comp-014",
    title: "Responder solicitações pendentes",
    consequenceScore: 3,
    prideScore: 2,
    constructionScore: 1,
    totalScore: 6,
    idealDate: new Date(2025, 4, 15, 17, 0), // 15/05/2025 17:00
    hidden: true,
    completed: true,
    completedAt: "2025-05-15T16:35:10.000Z", // 15/05/2025 16:35:10 (1 dia atrás)
    createdAt: new Date(2025, 4, 14, 9, 0), // 14/05/2025 09:00
    feedback: "obligation",
    pillar: null,
    comments: []
  }
];

// Combinar todas as tarefas para simular um banco de dados completo
export const allTasksData: Task[] = [...pendingTasksData, ...completedTasksData];

// Função para obter todos os comentários separadamente
export const getAllComments = (): Comment[] => {
  const comments: Comment[] = [];
  
  allTasksData.forEach(task => {
    if (task.comments && task.comments.length > 0) {
      comments.push(...task.comments);
    }
  });
  
  return comments;
};
