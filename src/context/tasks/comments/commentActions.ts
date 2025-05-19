
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../../types';
import { 
  addComment as addCommentService,
  deleteComment as deleteCommentService
} from '@/services/task';
import { Comment } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { mapToComment } from '@/services/task/taskMapper';

// Helper to get the current user through Supabase client directly
const getCurrentUser = async () => {
  try {
    // Get the current session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('[CommentActions] Error getting session:', error);
      return null;
    }
    
    return session?.user || null;
  } catch (error) {
    console.error('[CommentActions] Error in getCurrentUser:', error);
    return null;
  }
};

export const addComment = async (dispatch: AppDispatch, taskId: string, text: string) => {
  try {
    // Get current user using the helper function
    const currentUser = await getCurrentUser();
    console.log('[CommentActions] Current user from auth store:', currentUser);
    
    if (!currentUser?.id) {
      console.error('[CommentActions] No user ID available for adding comment');
      toast({
        id: uuidv4(),
        title: "Erro ao adicionar comentário",
        description: "Você precisa estar logado para adicionar comentários.",
        variant: "destructive",
      });
      return null;
    }

    console.log(`[CommentActions] Adding comment to task ${taskId} by user ${currentUser.id}`);
    
    // Add comment to database
    const commentData = await addCommentService(taskId, currentUser.id, text);
    console.log('[CommentActions] Comment added to database:', commentData);
    
    if (!commentData) {
      throw new Error('Failed to add comment');
    }
    
    // Create complete comment object using the mapper
    const newComment = mapToComment(commentData);
    console.log('[CommentActions] Mapped comment:', newComment);
    
    // Update local state with the complete comment
    dispatch({ 
      type: 'ADD_COMMENT', 
      payload: { 
        taskId, 
        comment: newComment 
      } 
    });
    
    // After comments are updated, refresh task data to ensure sync
    try {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { 
          id: taskId, 
          data: {} // Empty data will just trigger a refresh without changing anything
        }
      });
    } catch (syncError) {
      console.error('[CommentActions] Error syncing task after comment added:', syncError);
    }

    return newComment;
  } catch (error) {
    console.error('[CommentActions] Error adding comment:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao adicionar comentário",
      description: "Não foi possível adicionar o comentário. Tente novamente.",
      variant: "destructive",
    });
    return null;
  }
};

export const deleteComment = async (dispatch: AppDispatch, taskId: string, commentId: string): Promise<boolean> => {
  try {
    console.log(`[CommentActions] Deleting comment ${commentId} from task ${taskId}`);
    
    // Delete from database
    await deleteCommentService(commentId);
    console.log('[CommentActions] Comment deleted from database');
    
    // Update local state
    dispatch({ type: 'DELETE_COMMENT', payload: { taskId, commentId } });
    
    // Sync task data after comment deletion
    try {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { 
          id: taskId, 
          data: {} // Empty data will just trigger a refresh without changing anything
        }
      });
    } catch (syncError) {
      console.error('[CommentActions] Error syncing task after comment deleted:', syncError);
    }
    
    toast({
      id: uuidv4(),
      title: "Comentário removido",
      description: "O comentário foi removido com sucesso."
    });
    
    return true;
  } catch (error) {
    console.error('[CommentActions] Error deleting comment:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao remover comentário",
      description: "Não foi possível remover o comentário. Tente novamente.",
      variant: "destructive",
    });
    return false;
  }
};
