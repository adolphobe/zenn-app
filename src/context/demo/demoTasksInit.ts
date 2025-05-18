
import { AppDispatch } from '../types';
import { pendingTasksData, completedTasksData } from '@/mock/database';
import { dateService } from '@/services/dateService';

// Função para inicializar tarefas de demonstração a partir dos dados fixos
export const initializeDemoTasks = (dispatch: AppDispatch, tasksLength: number) => {
  if (tasksLength === 0) {
    console.log('Inicializando tarefas de demonstração a partir da fonte de dados simulada...');
    
    // Limpa o array de tarefas existentes para evitar duplicação
    dispatch({ type: 'CLEAR_TASKS' });
    
    // Adiciona primeiro as tarefas pendentes
    pendingTasksData.forEach(task => {
      console.log(`Adicionando tarefa pendente: "${task.title}"`);
      
      dispatch({
        type: 'ADD_TASK',
        payload: {
          title: task.title,
          consequenceScore: task.consequenceScore,
          prideScore: task.prideScore,
          constructionScore: task.constructionScore,
          idealDate: task.idealDate,
          // Se a tarefa tiver um pilar definido, também enviamos
          ...(task.pillar && { pillar: task.pillar })
        }
      });
      
      // Adiciona comentários se existirem
      if (task.comments && task.comments.length > 0) {
        task.comments.forEach(comment => {
          dispatch({
            type: 'ADD_COMMENT',
            payload: {
              taskId: task.id,
              text: comment.text
            }
          });
        });
      }
    });
    
    // Adiciona as tarefas concluídas
    completedTasksData.forEach(task => {
      console.log(`Adicionando tarefa concluída: "${task.title}" (concluída em ${task.completedAt})`);
      
      // Adicionamos primeiro a tarefa
      dispatch({
        type: 'ADD_TASK',
        payload: {
          title: task.title,
          consequenceScore: task.consequenceScore,
          prideScore: task.prideScore,
          constructionScore: task.constructionScore,
          idealDate: task.idealDate,
          ...(task.pillar && { pillar: task.pillar })
        }
      });
      
      // Depois marcamos como concluída com a data específica
      // Garantimos que a data seja tratada corretamente
      dispatch({
        type: 'COMPLETE_TASK_WITH_DATE',
        payload: {
          title: task.title,
          completedAt: task.completedAt
        }
      });
      
      // Adicionamos o feedback se existir
      if (task.feedback) {
        dispatch({
          type: 'SET_TASK_FEEDBACK_BY_TITLE',
          payload: {
            title: task.title,
            feedback: task.feedback
          }
        });
      }
      
      // Adiciona comentários se existirem
      if (task.comments && task.comments.length > 0) {
        task.comments.forEach(comment => {
          dispatch({
            type: 'ADD_COMMENT',
            payload: {
              taskId: task.id,
              text: comment.text
            }
          });
        });
      }
    });
    
    console.log('Inicialização de tarefas concluída!');
  }
};
