
import { AppState, Action } from '../../types';
import { dateService } from '@/services/dateService';

// Status toggle reducers
export const toggleTaskCompleted = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_TASK_COMPLETED') return state;

  return {
    ...state,
    tasks: state.tasks.map(task =>
      task.id === action.payload ? { 
        ...task, 
        completed: !task.completed,
        completedAt: !task.completed ? new Date() : null
      } : task
    )
  };
};

export const toggleTaskHidden = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_TASK_HIDDEN') return state;

  return {
    ...state,
    tasks: state.tasks.map(task =>
      task.id === action.payload ? { ...task, hidden: !task.hidden } : task
    )
  };
};

// New reducer function to handle confirmed visibility updates from the server
export const updateTaskVisibilityConfirmed = (state: AppState, action: Action): AppState => {
  if (action.type !== 'UPDATE_TASK_VISIBILITY_CONFIRMED') return state;

  return {
    ...state,
    tasks: state.tasks.map(task =>
      task.id === action.payload.id ? { ...task, hidden: action.payload.hidden } : task
    )
  };
};

export const setTaskOperationLoading = (state: AppState, action: Action): AppState => {
  if (action.type !== 'SET_TASK_OPERATION_LOADING') return state;

  const { id, operation, loading } = action.payload;

  return {
    ...state,
    tasks: state.tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          operationLoading: { 
            ...task.operationLoading,
            [operation]: loading 
          }
        };
      }
      return task;
    })
  };
};

export const setTaskFeedback = (state: AppState, action: Action): AppState => {
  if (action.type !== 'SET_TASK_FEEDBACK') return state;

  return {
    ...state,
    tasks: state.tasks.map(task =>
      task.id === action.payload.id ? { ...task, feedback: action.payload.feedback } : task
    )
  };
};

export const setTaskFeedbackByTitle = (state: AppState, action: Action): AppState => {
  if (action.type !== 'SET_TASK_FEEDBACK_BY_TITLE') return state;

  return {
    ...state,
    tasks: state.tasks.map(task => 
      task.title === action.payload.title
        ? { ...task, feedback: action.payload.feedback }
        : task
    )
  };
};

