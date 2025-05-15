
import { AppState, Action } from './types';
import * as taskReducers from './reducers/taskReducers';
import * as commentReducers from './reducers/commentReducers';
import * as uiReducers from './reducers/uiReducers';

// Main reducer that delegates to specialized reducers
export const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    // Task-related actions
    case 'ADD_TASK':
      return taskReducers.addTask(state, action);
    case 'DELETE_TASK':
      return taskReducers.deleteTask(state, action);
    case 'TOGGLE_TASK_COMPLETED':
      return taskReducers.toggleTaskCompleted(state, action);
    case 'TOGGLE_TASK_HIDDEN':
      return taskReducers.toggleTaskHidden(state, action);
    case 'UPDATE_TASK':
      return taskReducers.updateTask(state, action);
    case 'UPDATE_TASK_TITLE':
      return taskReducers.updateTaskTitle(state, action);
    case 'RESTORE_TASK':
      return taskReducers.restoreTask(state, action);
    case 'SET_TASK_FEEDBACK':
      return taskReducers.setTaskFeedback(state, action);
    case 'COMPLETE_TASK_BY_TITLE':
      return taskReducers.completeTaskByTitle(state, action);
    case 'SET_TASK_FEEDBACK_BY_TITLE':
      return taskReducers.setTaskFeedbackByTitle(state, action);
      
    // Comment-related actions
    case 'ADD_COMMENT':
      return commentReducers.addComment(state, action);
    case 'DELETE_COMMENT':
      return commentReducers.deleteComment(state, action);
      
    // UI-related actions
    case 'SET_VIEW_MODE':
      return uiReducers.setViewMode(state, action);
    case 'TOGGLE_SHOW_HIDDEN_TASKS':
      return uiReducers.toggleShowHiddenTasks(state, action);
    case 'TOGGLE_SHOW_PILLARS':
      return uiReducers.toggleShowPillars(state, action);
    case 'TOGGLE_SHOW_DATES':
      return uiReducers.toggleShowDates(state, action);
    case 'TOGGLE_DARK_MODE':
      return uiReducers.toggleDarkMode(state, action);
    case 'TOGGLE_SIDEBAR':
      return uiReducers.toggleSidebar(state, action);
    case 'UPDATE_DATE_DISPLAY_OPTIONS':
      return uiReducers.updateDateDisplayOptions(state, action);
    case 'SET_SORT_OPTIONS':
      return uiReducers.setSortOptions(state, action);
      
    default:
      return state;
  }
};
