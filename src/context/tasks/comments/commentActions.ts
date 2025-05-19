
import { addComment as addCommentReducer, deleteComment as deleteCommentReducer } from '../../reducers/commentReducers';
import { addComment as addCommentService, deleteComment as deleteCommentService } from '@/services/task/taskComments';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../../types';
import { supabase } from '@/integrations/supabase/client';

export const addComment = async (
  dispatch: AppDispatch, 
  taskId: string, 
  text: string, 
  userId?: string
): Promise<boolean> => {
  try {
    // First check if we have a user ID or need to get it from the current session
    let actualUserId = userId;
    
    if (!actualUserId) {
      // Get current user from Supabase session if not provided
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData.session?.user?.id;
      
      if (!currentUserId) {
        console.error('Error adding comment: No authenticated user found');
        
        toast({
          id: uuidv4(),
          title: "Erro ao adicionar comentário",
          description: "Você precisa estar autenticado para adicionar comentários.",
          variant: "destructive",
        });
        
        return false;
      }
      
      actualUserId = currentUserId;
    }
    
    // Now add to database with the actual user ID
    const newComment = await addCommentService(taskId, actualUserId, text);
    
    // Then update local state with the comment from the database
    dispatch({ type: 'ADD_COMMENT', payload: { taskId, comment: newComment } });
    
    toast({
      id: uuidv4(),
      title: "Comentário adicionado",
      description: "Seu comentário foi adicionado com sucesso."
    });
    
    return true;
  } catch (error) {
    console.error('Error adding comment:', error);
    
    toast({
      id: uuidv4(),
      title: "Erro ao adicionar comentário",
      description: "Não foi possível adicionar seu comentário. Tente novamente.",
      variant: "destructive",
    });
    
    return false;
  }
};

export const deleteComment = async (
  dispatch: AppDispatch, 
  taskId: string, 
  commentId: string
): Promise<boolean> => {
  try {
    // First delete from database
    await deleteCommentService(commentId);
    
    // Then update local state
    dispatch({ 
      type: 'DELETE_COMMENT', 
      payload: { taskId, commentId } 
    });
    
    toast({
      id: uuidv4(),
      title: "Comentário excluído",
      description: "O comentário foi excluído com sucesso."
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    
    toast({
      id: uuidv4(),
      title: "Erro ao excluir comentário",
      description: "Não foi possível excluir o comentário. Tente novamente.",
      variant: "destructive",
    });
    
    return false;
  }
};
