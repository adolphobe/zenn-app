
import { v4 as uuidv4 } from 'uuid';
import { AppState, Action } from '../types';
import { Comment } from '@/types';

// Comment-related reducers
export const addComment = (state: AppState, action: Action): AppState => {
  if (action.type !== 'ADD_COMMENT') return state;

  // Extract taskId and either full comment object or just text
  const { taskId } = action.payload;
  let newComment: Comment;
  
  if (action.payload.comment) {
    // Use the full comment object if provided
    newComment = action.payload.comment;
    console.log('[CommentReducer] Using provided comment object:', newComment);
  } else {
    // Fallback to creating a comment from just text (legacy support)
    newComment = {
      id: uuidv4(),
      text: action.payload.text,
      createdAt: new Date().toISOString(),
      userId: 'unknown' // This is a fallback and should be avoided
    };
    console.log('[CommentReducer] Created new comment from text only:', newComment);
  }

  return {
    ...state,
    tasks: state.tasks.map(task => {
      if (task.id === taskId) {
        const comments = task.comments ? [...task.comments, newComment] : [newComment];
        console.log(`[CommentReducer] Updated task ${task.id} comments:`, comments);
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
        console.log(`[CommentReducer] Removed comment ${action.payload.commentId} from task ${task.id}`);
        return { ...task, comments };
      }
      return task;
    })
  };
};
