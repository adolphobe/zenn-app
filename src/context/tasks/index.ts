
// Basic task actions
export { addTask } from './basic/addTask';
export { deleteTask } from './basic/deleteTask';
export { toggleTaskCompleted } from './basic/toggleTaskCompleted';
export { updateTask, updateTaskTitle } from './basic/updateTask';

// Visibility actions
export { toggleTaskHidden } from './visibility/toggleTaskHidden';

// Feedback actions
export { 
  setTaskFeedback,
  completeTaskWithDate
} from './feedback/setTaskFeedback';

// Recovery actions
export { restoreTask } from './recovery/restoreTask';

// Utility functions
export { syncTasksFromDatabase } from './utils/syncTasks';
