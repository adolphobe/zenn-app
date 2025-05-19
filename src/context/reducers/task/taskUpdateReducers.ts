
import { AppState, Action } from '../../types';
import { dateService } from '@/services/dateService';
import { logDateInfo } from '@/utils/diagnosticLog';

// Update task properties reducers
export const updateTask = (state: AppState, action: Action): AppState => {
  if (action.type !== 'UPDATE_TASK') return state;
  
  logDateInfo('UPDATE_TASK', 'Atualizando tarefa', action.payload);

  return {
    ...state,
    tasks: state.tasks.map(task => {
      if (task.id === action.payload.id) {
        const updatedTask = { ...task, ...action.payload.data };
        
        // Recalculate total score if any of the score components changed
        if (
          action.payload.data.consequenceScore !== undefined ||
          action.payload.data.prideScore !== undefined ||
          action.payload.data.constructionScore !== undefined
        ) {
          const consequenceScore = action.payload.data.consequenceScore ?? task.consequenceScore;
          const prideScore = action.payload.data.prideScore ?? task.prideScore;
          const constructionScore = action.payload.data.constructionScore ?? task.constructionScore;
          
          updatedTask.totalScore = consequenceScore + prideScore + constructionScore;
          
          // Update hidden status based on total score
          updatedTask.hidden = updatedTask.totalScore < 8;
        }
        
        // Garantir que campos de data sejam Date objects válidos
        if (action.payload.data.completedAt !== undefined) {
          const parsedDate = dateService.parseDate(action.payload.data.completedAt);
          updatedTask.completedAt = parsedDate;
          
          logDateInfo('UPDATE_TASK', `Parsing completedAt for task ${task.id}`, {
            original: action.payload.data.completedAt,
            parsed: updatedTask.completedAt
          });
          
          // Garantir que tarefas concluídas tenham uma data válida
          if (updatedTask.completed && !updatedTask.completedAt) {
            updatedTask.completedAt = new Date();
            logDateInfo('UPDATE_TASK', `Atribuindo data atual para task ${task.id} concluída sem data`, updatedTask.completedAt);
          }
        }
        
        if (action.payload.data.idealDate !== undefined) {
          updatedTask.idealDate = dateService.parseDate(action.payload.data.idealDate);
          logDateInfo('UPDATE_TASK', `Parsing idealDate for task ${task.id}`, updatedTask.idealDate);
        }
        
        return updatedTask;
      }
      return task;
    })
  };
};

export const updateTaskTitle = (state: AppState, action: Action): AppState => {
  if (action.type !== 'UPDATE_TASK_TITLE') return state;

  return {
    ...state,
    tasks: state.tasks.map(task =>
      task.id === action.payload.id ? { ...task, title: action.payload.title } : task
    )
  };
};

export const completeTaskByTitle = (state: AppState, action: Action): AppState => {
  if (action.type !== 'COMPLETE_TASK_BY_TITLE') return state;

  const now = new Date();
  logDateInfo('COMPLETE_TASK_BY_TITLE', 'Setting completedAt to now', now);
  
  return {
    ...state,
    tasks: state.tasks.map(task => 
      task.title === action.payload 
        ? { 
            ...task, 
            completed: true,
            completedAt: now,
          } 
        : task
    )
  };
};

// Nova ação para definir uma data específica de conclusão
export const completeTaskWithDate = (state: AppState, action: Action): AppState => {
  if (action.type !== 'COMPLETE_TASK_WITH_DATE') return state;
  
  // Ensure completedAt is a valid Date object
  const completedAt = dateService.parseDate(action.payload.completedAt);
  // Se não conseguir converter, usa data atual
  const dateToUse = completedAt || new Date();
  
  logDateInfo('COMPLETE_TASK_WITH_DATE', 'Setting completedAt', {
    original: action.payload.completedAt,
    parsed: completedAt,
    used: dateToUse
  });
  
  return {
    ...state,
    tasks: state.tasks.map(task => 
      task.title === action.payload.title 
        ? { 
            ...task, 
            completed: true,
            completedAt: dateToUse,
          } 
        : task
    )
  };
};

export const restoreTask = (state: AppState, action: Action): AppState => {
  if (action.type !== 'RESTORE_TASK') return state;

  return {
    ...state,
    tasks: state.tasks.map(task =>
      task.id === action.payload ? { 
        ...task, 
        completed: false, 
        completedAt: null,
        idealDate: new Date(), // Set today as the ideal date
        feedback: null // Clear the feedback
      } : task
    )
  };
};
