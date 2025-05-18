
import { AppState, Action } from '../../types';
import { dateService } from '@/services/dateService';

// Update task properties reducers
export const updateTask = (state: AppState, action: Action): AppState => {
  if (action.type !== 'UPDATE_TASK') return state;

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
  
  // Parse the date string to a Date object
  const completedAtDate = dateService.parseDate(action.payload.completedAt) || new Date();
  
  return {
    ...state,
    tasks: state.tasks.map(task => 
      task.title === action.payload.title 
        ? { 
            ...task, 
            completed: true,
            completedAt: completedAtDate,
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

