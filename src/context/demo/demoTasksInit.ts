
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
      { title: "Atualizar aplicativos do celular", consequenceScore: 1, prideScore: 1, constructionScore: 1, daysFromNow: 9 }
    ];
    
    // Clear array of existing tasks to prevent any possibility of duplication
    dispatch({ type: 'CLEAR_TASKS' });
    
    pendingTasks.forEach(task => {
      const today = new Date();
      const idealDate = task.daysFromNow !== undefined 
        ? addDaysToDate(today, task.daysFromNow) 
        : null;
      
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
    
    // Add completed tasks for the past 7 days for demonstration
    const demoCompletedTasks = [
      // Day -7
      { title: "Concluir relatório mensal", consequenceScore: 4, prideScore: 3, constructionScore: 2, daysAgo: 7, feedback: 'obligation' },
      { title: "Organizar planejamento Q3", consequenceScore: 5, prideScore: 5, constructionScore: 5, daysAgo: 7, feedback: 'transformed' },
      
      // Day -6
      { title: "Enviar proposta cliente A", consequenceScore: 5, prideScore: 4, constructionScore: 4, daysAgo: 6, feedback: 'transformed' },
      { title: "Revisar documentação técnica", consequenceScore: 2, prideScore: 2, constructionScore: 4, daysAgo: 6, feedback: 'relief' },
      { title: "Validar pendências fiscais", consequenceScore: 4, prideScore: 1, constructionScore: 1, daysAgo: 6, feedback: 'obligation' },
      
      // Day -5 
      { title: "Preparar apresentação executiva", consequenceScore: 5, prideScore: 5, constructionScore: 4, daysAgo: 5, feedback: 'transformed' },
      { title: "Limpar inbox de emails", consequenceScore: 3, prideScore: 2, constructionScore: 1, daysAgo: 5, feedback: 'relief' },
      
      // Day -4
      { title: "Publicar artigo técnico", consequenceScore: 3, prideScore: 5, constructionScore: 4, daysAgo: 4, feedback: 'transformed' },
      { title: "Refatorar código do módulo X", consequenceScore: 2, prideScore: 4, constructionScore: 5, daysAgo: 4, feedback: 'transformed' },
      
      // Day -3
      { title: "Finalizar análise de mercado", consequenceScore: 5, prideScore: 3, constructionScore: 3, daysAgo: 3, feedback: 'relief' },
      { title: "Revisar orçamento trimestral", consequenceScore: 5, prideScore: 2, constructionScore: 2, daysAgo: 3, feedback: 'obligation' },
      { title: "Atualizar pipeline de vendas", consequenceScore: 4, prideScore: 3, constructionScore: 2, daysAgo: 3, feedback: 'obligation' },
      
      // Day -2
      { title: "Conduzir reunião de alinhamento", consequenceScore: 4, prideScore: 4, constructionScore: 3, daysAgo: 2, feedback: 'relief' },
      { title: "Implementar feature principal", consequenceScore: 3, prideScore: 5, constructionScore: 5, daysAgo: 2, feedback: 'transformed' },
      { title: "Resolver problemas do cliente B", consequenceScore: 5, prideScore: 3, constructionScore: 2, daysAgo: 2, feedback: 'relief' },
      
      // Day -1
      { title: "Finalizar apresentação de vendas", consequenceScore: 4, prideScore: 5, constructionScore: 4, daysAgo: 1, feedback: 'transformed' },
      { title: "Revisar métricas de desempenho", consequenceScore: 3, prideScore: 3, constructionScore: 4, daysAgo: 1, feedback: 'relief' },
      
      // Today
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
