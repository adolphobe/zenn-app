import { AppDispatch } from '../types';
import { SAMPLE_TASKS } from '@/constants';
import { addDaysToDate } from '@/utils';

// Function to initialize demo tasks
export const initializeDemoTasks = (dispatch: AppDispatch, tasksLength: number) => {
  if (tasksLength === 0) {
    // SAMPLE_TASKS have been removed to avoid duplication
    
    // Tarefas pendentes variadas com diferentes scores para os pilares
    const pendingTasks = [
      // Tarefas com foco em crescimento pessoal
      { title: "Fazer 4 aulas de inglês", consequenceScore: 3, prideScore: 4, constructionScore: 5, daysFromNow: 2 },
      { title: "Meditar por 20 minutos diários", consequenceScore: 2, prideScore: 4, constructionScore: 5, daysFromNow: 0 },
      { title: "Ler livro sobre desenvolvimento pessoal", consequenceScore: 2, prideScore: 3, constructionScore: 5, daysFromNow: 5 },
      
      // Tarefas profissionais importantes
      { title: "Finalizar relatório trimestral", consequenceScore: 5, prideScore: 4, constructionScore: 3, daysFromNow: 1 },
      { title: "Preparar apresentação para diretoria", consequenceScore: 5, prideScore: 5, constructionScore: 4, daysFromNow: 3 },
      
      // Tarefas com balanceamento nos pilares
      { title: "Planejar férias familiares", consequenceScore: 4, prideScore: 5, constructionScore: 3, daysFromNow: 7 },
      { title: "Revisar planejamento financeiro", consequenceScore: 5, prideScore: 3, constructionScore: 4, daysFromNow: 4 },
      
      // Tarefas mais cotidianas com scores menores
      { title: "Arrumar tomada de casa", consequenceScore: 2, prideScore: 2, constructionScore: 1, daysFromNow: 6 },
      { title: "Organizar armário do escritório", consequenceScore: 1, prideScore: 3, constructionScore: 2, daysFromNow: 8 },
      { title: "Atualizar aplicativos do celular", consequenceScore: 1, prideScore: 1, constructionScore: 1, daysFromNow: 9 },
      
      // Tarefas vencidas (com datas anteriores a 10/05/2025)
      { title: "Enviar documentos para contabilidade", consequenceScore: 4, prideScore: 3, constructionScore: 2, specificDate: new Date(2025, 4, 3, 11, 54) }, // 03/05/2025 11:54
      { title: "Atualizar plano de marketing", consequenceScore: 5, prideScore: 4, constructionScore: 4, specificDate: new Date(2025, 4, 7, 9, 30) }, // 07/05/2025 09:30
      { title: "Revisar contrato de parceria", consequenceScore: 5, prideScore: 5, constructionScore: 3, specificDate: new Date(2025, 3, 28, 14, 15) }  // 28/04/2025 14:15
    ];
    
    // Clear array of existing tasks to prevent any possibility of duplication
    dispatch({ type: 'CLEAR_TASKS' });
    
    pendingTasks.forEach(task => {
      const today = new Date();
      let idealDate;
      
      if (task.specificDate) {
        idealDate = task.specificDate;
      } else if (task.daysFromNow !== undefined) {
        idealDate = addDaysToDate(today, task.daysFromNow);
      } else {
        idealDate = null;
      }
      
      dispatch({
        type: 'ADD_TASK',
        payload: {
          title: task.title,
          consequenceScore: task.consequenceScore,
          prideScore: task.prideScore,
          constructionScore: task.constructionScore,
          idealDate: idealDate
        }
      });
    });
    
    // Add completed tasks distributed over the last 60 days for better filter testing
    const demoCompletedTasks = [
      // Older tasks (40-60 days ago)
      { title: "Concluir relatório semestral", consequenceScore: 5, prideScore: 4, constructionScore: 4, daysAgo: 58, feedback: 'transformed' },
      { title: "Revisar documentação legal", consequenceScore: 4, prideScore: 3, constructionScore: 3, daysAgo: 55, feedback: 'obligation' },
      { title: "Finalizar auditoria interna", consequenceScore: 5, prideScore: 4, constructionScore: 3, daysAgo: 52, feedback: 'relief' },
      { title: "Elaborar plano estratégico anual", consequenceScore: 5, prideScore: 5, constructionScore: 5, daysAgo: 48, feedback: 'transformed' },
      { title: "Revisar contratos de fornecedores", consequenceScore: 3, prideScore: 3, constructionScore: 2, daysAgo: 45, feedback: 'obligation' },
      { title: "Implementar nova política de RH", consequenceScore: 4, prideScore: 4, constructionScore: 3, daysAgo: 42, feedback: 'relief' },
      
      // 30-40 days ago
      { title: "Atualizar manuais operacionais", consequenceScore: 2, prideScore: 3, constructionScore: 4, daysAgo: 38, feedback: 'relief' },
      { title: "Finalizar orçamento do próximo trimestre", consequenceScore: 5, prideScore: 3, constructionScore: 3, daysAgo: 35, feedback: 'obligation' },
      { title: "Concluir treinamento da equipe", consequenceScore: 4, prideScore: 5, constructionScore: 5, daysAgo: 33, feedback: 'transformed' },
      
      // 20-30 days ago
      { title: "Implementar melhorias no sistema", consequenceScore: 3, prideScore: 4, constructionScore: 5, daysAgo: 28, feedback: 'transformed' },
      { title: "Finalizar negociação com cliente premium", consequenceScore: 5, prideScore: 5, constructionScore: 3, daysAgo: 26, feedback: 'relief' },
      { title: "Revisar métricas de desempenho", consequenceScore: 4, prideScore: 3, constructionScore: 3, daysAgo: 24, feedback: 'obligation' },
      { title: "Organizar evento corporativo", consequenceScore: 3, prideScore: 5, constructionScore: 4, daysAgo: 21, feedback: 'transformed' },
      
      // 10-20 days ago
      { title: "Concluir pesquisa de satisfação", consequenceScore: 3, prideScore: 3, constructionScore: 4, daysAgo: 18, feedback: 'relief' },
      { title: "Atualizar site institucional", consequenceScore: 2, prideScore: 4, constructionScore: 3, daysAgo: 16, feedback: 'transformed' },
      { title: "Finalizar relatório de sustentabilidade", consequenceScore: 4, prideScore: 4, constructionScore: 4, daysAgo: 14, feedback: 'relief' },
      { title: "Revisar plano de marketing digital", consequenceScore: 3, prideScore: 4, constructionScore: 3, daysAgo: 12, feedback: 'obligation' },
      
      // Last 10 days
      { title: "Implementar nova funcionalidade no app", consequenceScore: 3, prideScore: 5, constructionScore: 5, daysAgo: 9, feedback: 'transformed' },
      { title: "Resolver problemas técnicos críticos", consequenceScore: 5, prideScore: 3, constructionScore: 2, daysAgo: 7, feedback: 'relief' },
      { title: "Finalizar apresentação para investidores", consequenceScore: 5, prideScore: 5, constructionScore: 4, daysAgo: 5, feedback: 'transformed' },
      { title: "Concluir análise de concorrência", consequenceScore: 4, prideScore: 4, constructionScore: 3, daysAgo: 3, feedback: 'obligation' },
      
      // Most recent tasks
      { title: "Atualizar planilha de resultados", consequenceScore: 3, prideScore: 2, constructionScore: 2, daysAgo: 1, feedback: 'obligation' },
      { title: "Preparar roadmap trimestral", consequenceScore: 5, prideScore: 5, constructionScore: 5, daysAgo: 0, feedback: 'transformed' },
      { title: "Responder solicitações pendentes", consequenceScore: 3, prideScore: 2, constructionScore: 1, daysAgo: 0, feedback: 'obligation' },
      { title: "Fechar planilha de custos", consequenceScore: 4, prideScore: 3, constructionScore: 2, daysAgo: 0, feedback: 'relief' }
    ];
    
    demoCompletedTasks.forEach(task => {
      const today = new Date();
      const taskDate = addDaysToDate(today, -task.daysAgo);
      
      // Add the task
      dispatch({
        type: 'ADD_TASK',
        payload: {
          title: task.title,
          consequenceScore: task.consequenceScore,
          prideScore: task.prideScore,
          constructionScore: task.constructionScore,
          idealDate: taskDate
        }
      });
      
      // Mark it as completed directly
      dispatch({
        type: 'COMPLETE_TASK_BY_TITLE',
        payload: task.title
      });
      
      // Add feedback
      dispatch({
        type: 'SET_TASK_FEEDBACK_BY_TITLE',
        payload: {
          title: task.title,
          feedback: task.feedback as 'transformed' | 'relief' | 'obligation'
        }
      });
    });
    
    // Add some hidden tasks with various scores
    const hiddenTasks = [
      { title: "Tarefa oculta 1", consequenceScore: 2, prideScore: 2, constructionScore: 3 },
      { title: "Tarefa oculta 2", consequenceScore: 1, prideScore: 3, constructionScore: 3 },
      { title: "Tarefa oculta 3", consequenceScore: 3, prideScore: 2, constructionScore: 2 },
      { title: "Tarefa oculta 4", consequenceScore: 2, prideScore: 1, constructionScore: 1 },
      { title: "Tarefa oculta 5", consequenceScore: 1, prideScore: 2, constructionScore: 2 }
    ];
    
    hiddenTasks.forEach(task => {
      const taskData = {
        ...task,
        idealDate: addDaysToDate(new Date(), Math.floor(Math.random() * 14) + 1) // Random date in next 14 days
      };
      
      dispatch({
        type: 'ADD_TASK',
        payload: taskData
      });
    });
  }
};
