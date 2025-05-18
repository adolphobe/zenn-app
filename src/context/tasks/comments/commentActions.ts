
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../../types';
import { 
  addComment as addCommentService,
  deleteComment as deleteCommentService
} from '@/services/taskService';

export const addComment = async (dispatch: AppDispatch, taskId: string, text: string) => {
  try {
    // Get current user
    const authStore = document.querySelector('#auth-store');
    const currentUser = authStore ? JSON.parse(authStore.getAttribute('data-user') || '{}') : null;
    
    if (!currentUser?.id) {
      toast({
        id: uuidv4(),
        title: "Erro ao adicionar comentário",
        description: "Você precisa estar logado para adicionar comentários.",
        variant: "destructive",
      });
      return;
    }

    // Add comment to database
    await addCommentService(taskId, currentUser.id, text);
    
    // Update local state
    dispatch({ type: 'ADD_COMMENT', payload: { taskId, text } });
    
    toast({
      id: uuidv4(),
      title: "Comentário adicionado",
      description: "Seu comentário foi adicionado com sucesso."
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao adicionar comentário",
      description: "Não foi possível adicionar o comentário. Tente novamente.",
      variant: "destructive",
    });
  }
};

export const deleteComment = async (dispatch: AppDispatch, taskId: string, commentId: string) => {
  try {
    // Delete from database
    await deleteCommentService(commentId);
    
    // Update local state
    dispatch({ type: 'DELETE_COMMENT', payload: { taskId, commentId } });
    
    toast({
      id: uuidv4(),
      title: "Comentário removido",
      description: "O comentário foi removido com sucesso."
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao remover comentário",
      description: "Não foi possível remover o comentário. Tente novamente.",
      variant: "destructive",
    });
  }
};
