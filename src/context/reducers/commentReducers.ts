
import { v4 as uuidv4 } from 'uuid';
import { AppState, Action } from '../types';

// Comment-related reducers
export const addComment = (state: AppState, action: Action): AppState => {
  if (action.type !== 'ADD_COMMENT') return state;

  return {
    ...state,
    tasks: state.tasks.map(task => {
      if (task.id === action.payload.taskId) {
        const newComment = {
          id: uuidv4(),
          text: action.payload.text,
          createdAt: new Date().toISOString()
        };
        const comments = task.comments ? [...task.comments, newComment] : [newComment];
        return { ...task, comments };
      }
      return task;
    })
  };
};

export const deleteComment = (state: AppState, action: Action): AppState => {
  if (action.type !== 'DELETE_COMMENT') return state;

  return {
    ...state,
    tasks: state.tasks.map(task => {
      if (task.id === action.payload.taskId) {
        const comments = task.comments ? 
          task.comments.filter(comment => comment.id !== action.payload.commentId) : 
          [];
        return { ...task, comments };
      }
      return task;
    })
  };
};
