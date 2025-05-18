
import { AppState, Action } from '../types';

// Import from organized reducers
import { 
  addTask, 
  clearTasks, 
  deleteTask 
} from './task/taskCreationReducers';

import {
  toggleTaskCompleted,
  toggleTaskHidden,
  updateTaskVisibilityConfirmed,
  setTaskOperationLoading,
  setTaskFeedback,
  setTaskFeedbackByTitle
} from './task/taskStateReducers';

import {
  updateTask,
  updateTaskTitle,
  completeTaskByTitle,
  completeTaskWithDate,
  restoreTask
} from './task/taskUpdateReducers';

// Export all task reducers
export {
  addTask,
  clearTasks,
  deleteTask,
  toggleTaskCompleted,
  toggleTaskHidden,
  updateTaskVisibilityConfirmed,
  setTaskOperationLoading,
  updateTask,
  updateTaskTitle,
  completeTaskByTitle,
  completeTaskWithDate,
  setTaskFeedback,
  setTaskFeedbackByTitle,
  restoreTask
};
