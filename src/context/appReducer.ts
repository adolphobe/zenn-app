
import { AppState, Action } from './types';

// Importing UI reducer functions correctly
import { 
  setViewMode,
  toggleShowHiddenTasks,
  toggleDarkMode,
  toggleSidebar,
  updateDateDisplayOptions,
  updateSortOptions,
  toggleViewMode,
  toggleShowPillars,
  toggleShowDates,
  toggleShowScores,
  setSortOptions
} from './reducers/uiReducers';

import { 
  addTask, 
  deleteTask,
  toggleTaskCompleted,
  toggleTaskHidden,
  updateTask,
  updateTaskTitle,
  restoreTask,
  completeTaskByTitle,
  completeTaskWithDate,
  setTaskFeedback,
  setTaskFeedbackByTitle,
  clearTasks
} from './reducers/taskReducers';

import { 
  addComment, 
  deleteComment 
} from './reducers/commentReducers';

// Main reducer
export const appReducer = (state: AppState, action: Action): AppState => {
  // Task reducers
  if (action.type === 'ADD_TASK') return addTask(state, action);
  if (action.type === 'DELETE_TASK') return deleteTask(state, action);
  if (action.type === 'TOGGLE_TASK_COMPLETED') return toggleTaskCompleted(state, action);
  if (action.type === 'TOGGLE_TASK_HIDDEN') return toggleTaskHidden(state, action);
  if (action.type === 'UPDATE_TASK') return updateTask(state, action);
  if (action.type === 'UPDATE_TASK_TITLE') return updateTaskTitle(state, action);
  if (action.type === 'CLEAR_TASKS') return clearTasks(state, action);
  if (action.type === 'COMPLETE_TASK_BY_TITLE') return completeTaskByTitle(state, action);
  if (action.type === 'COMPLETE_TASK_WITH_DATE') return completeTaskWithDate(state, action);
  if (action.type === 'SET_TASK_FEEDBACK') return setTaskFeedback(state, action);
  if (action.type === 'SET_TASK_FEEDBACK_BY_TITLE') return setTaskFeedbackByTitle(state, action);
  if (action.type === 'RESTORE_TASK') return restoreTask(state, action);
  
  // UI reducers
  if (action.type === 'TOGGLE_VIEW_MODE') return toggleViewMode(state, action);
  if (action.type === 'SET_VIEW_MODE') return setViewMode(state, action);
  if (action.type === 'TOGGLE_SHOW_HIDDEN_TASKS') return toggleShowHiddenTasks(state, action);
  if (action.type === 'TOGGLE_DARK_MODE') return toggleDarkMode(state, action);
  if (action.type === 'TOGGLE_SIDEBAR') return toggleSidebar(state, action);
  if (action.type === 'TOGGLE_SHOW_PILLARS') return toggleShowPillars(state, action);
  if (action.type === 'TOGGLE_SHOW_DATES') return toggleShowDates(state, action);
  if (action.type === 'TOGGLE_SHOW_SCORES') return toggleShowScores(state, action);
  if (action.type === 'UPDATE_DATE_DISPLAY_OPTIONS') return updateDateDisplayOptions(state, action);
  if (action.type === 'UPDATE_SORT_OPTIONS') return updateSortOptions(state, action);
  if (action.type === 'SET_SORT_OPTIONS') return setSortOptions(state, action);
  
  // Comment reducers
  if (action.type === 'ADD_COMMENT') return addComment(state, action);
  if (action.type === 'DELETE_COMMENT') return deleteComment(state, action);
  
  return state;
};
