import { AppState, Action } from '../../types';
import { dateService } from '@/services/dateService';
import { logTaskStateChange, logDateInfo } from '@/utils/diagnosticLog';

// Status toggle reducers
export const toggleTaskCompleted = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_TASK_COMPLETED') return state;
  
  const taskId = action.payload;
  const task = state.tasks.find(t => t.id === taskId);
  
  if (task) {
    // Get values before update
    const beforeState = {
      completed: task.completed,
      completedAt: task.completedAt
    };
    
    // Calculate new values
    const newCompleted = !task.completed;
    const newCompletedAt = newCompleted ? new Date() : null;
    
    // Log the state change
    logDateInfo('REDUCER', 'Setting completedAt in reducer', newCompletedAt);
    
    // Create updated state
    const updatedState = {
      ...state,
      tasks: state.tasks.map(t =>
        t.id === taskId ? { 
          ...t, 
          completed: newCompleted,
          completedAt: newCompletedAt
        } : t
      )
    };
    
    // Find the updated task for logging
    const updatedTask = updatedState.tasks.find(t => t.id === taskId);
    
    if (updatedTask) {
      // Log the after state
      logTaskStateChange('REDUCER_TOGGLE_COMPLETED', taskId, task.title, beforeState, {
        completed: updatedTask.completed,
        completedAt: updatedTask.completedAt
      });
    }
    
    return updatedState;
  }

  return state;
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
  
  const taskId = action.payload.id;
  const task = state.tasks.find(t => t.id === taskId);
  
  if (task) {
    // Log the before state
    logTaskStateChange('SET_TASK_FEEDBACK_START', taskId, task.title, {
      feedback: task.feedback,
      completedAt: task.completedAt
    });
  }

  const updatedState = {
    ...state,
    tasks: state.tasks.map(task =>
      task.id === action.payload.id ? { ...task, feedback: action.payload.feedback } : task
    )
  };
  
  // Find the updated task for logging
  const updatedTask = updatedState.tasks.find(t => t.id === taskId);
  
  if (task && updatedTask) {
    // Log the after state - ensuring feedback is set without disrupting completedAt
    logTaskStateChange('SET_TASK_FEEDBACK_END', taskId, task.title, {
      feedback: task.feedback
    }, {
      feedback: updatedTask.feedback,
      completedAt: updatedTask.completedAt // Verify completedAt is preserved
    });
  }

  return updatedState;
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
