
import { AppState, Action } from './types';
import { 
  addTask, deleteTask, toggleTaskCompleted, toggleTaskHidden, 
  updateTask, updateTaskTitle, restoreTask, clearTasks,  // Added clearTasks
  setTaskFeedback, completeTaskByTitle, setTaskFeedbackByTitle 
} from './reducers/taskReducers';
import { addComment, deleteComment } from './reducers/commentReducers';
import { 
  setViewMode, toggleShowHiddenTasks, toggleShowPillars, 
  toggleShowDates, toggleDarkMode, toggleSidebar, 
  updateDateDisplayOptions, setSortOptions 
} from './reducers/uiReducers';

// Main reducer function
export default function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    // Task actions
    case 'ADD_TASK':
      return addTask(state, action);
    case 'DELETE_TASK':
      return deleteTask(state, action);
    case 'TOGGLE_TASK_COMPLETED':
      return toggleTaskCompleted(state, action);
    case 'TOGGLE_TASK_HIDDEN':
      return toggleTaskHidden(state, action);
    case 'UPDATE_TASK':
      return updateTask(state, action);
    case 'UPDATE_TASK_TITLE':
      return updateTaskTitle(state, action);
    case 'RESTORE_TASK':
      return restoreTask(state, action);
    case 'SET_TASK_FEEDBACK':
      return setTaskFeedback(state, action);
    case 'COMPLETE_TASK_BY_TITLE':
      return completeTaskByTitle(state, action);
    case 'SET_TASK_FEEDBACK_BY_TITLE':
      return setTaskFeedbackByTitle(state, action);
    case 'CLEAR_TASKS': // Added new action handling
      return clearTasks(state, action);
    // Comment actions
    case 'ADD_COMMENT':
      return addComment(state, action);
    case 'DELETE_COMMENT':
      return deleteComment(state, action);
    // UI actions
    case 'SET_VIEW_MODE':
      return setViewMode(state, action);
    case 'TOGGLE_SHOW_HIDDEN_TASKS':
      return toggleShowHiddenTasks(state, action);
    case 'TOGGLE_SHOW_PILLARS':
      return toggleShowPillars(state, action);
    case 'TOGGLE_SHOW_DATES':
      return toggleShowDates(state, action);
    case 'TOGGLE_DARK_MODE':
      return toggleDarkMode(state, action);
    case 'TOGGLE_SIDEBAR':
      return toggleSidebar(state, action);
    case 'UPDATE_DATE_DISPLAY_OPTIONS':
      return updateDateDisplayOptions(state, action);
    case 'SET_SORT_OPTIONS':
      return setSortOptions(state, action);
    default:
      return state;
  }
}
