
import { useState } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Comment } from '@/types';
import { useAuth } from '@/context/auth';
import { v4 as uuidv4 } from 'uuid';

// Define types for mutation callbacks
type MutationCallbacks = {
  onSuccess?: () => void;
  onError?: (error: any) => void;
};

export const useComments = (taskId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { currentUser, isAuthenticated } = useAuth();

  // Fetch comments for a specific task
  const { 
    data: comments = [], 
    isLoading, 
    error: fetchError,
    refetch
  } = useQuery({
    queryKey: ['comments', taskId],
    queryFn: async () => {
      console.log(`[useComments] Fetching comments for task: ${taskId}`);
      
      // Verificação extra de autenticação
      const sessionCheck = await supabase.auth.getSession();
      console.log('[useComments] Session check:', { 
        hasSession: !!sessionCheck.data.session,
        userId: sessionCheck.data.session?.user?.id || 'none'
      });
      
      const { data, error } = await supabase
        .from('task_comments')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('[useComments] Error fetching comments:', error);
        console.error('[useComments] Error details:', JSON.stringify(error));
        throw error;
      }
      
      console.log(`[useComments] Fetched ${data?.length || 0} comments`);
      
      // Map database comments to our Comment type
      return data.map((comment: any): Comment => ({
        id: comment.id,
        text: comment.text,
        createdAt: comment.created_at,
        userId: comment.user_id
      }));
    },
    enabled: !!taskId
  });

  // Add comment mutation with proper callback handling
  const { mutate } = useMutation({
    mutationFn: async (text: string) => {
      if (!isAuthenticated || !currentUser) {
        console.error('[useComments] User not authenticated');
        
        // Verificação detalhada de sessão
        const { data: sessionData } = await supabase.auth.getSession();
        console.error('[useComments] Session check details:', { 
          hasSession: !!sessionData.session,
          sessionUserId: sessionData.session?.user?.id,
          currentUser: currentUser?.id,
          isAuthenticated
        });
        
        throw new Error('Usuário não autenticado. Por favor, faça login novamente.');
      }
      
      if (!text.trim()) {
        console.error('[useComments] Comment text is empty');
        throw new Error('O texto do comentário não pode estar vazio');
      }
      
      if (!taskId) {
        console.error('[useComments] Task ID is missing');
        throw new Error('ID da tarefa ausente');
      }
      
      console.log(`[useComments] Adding comment to task ${taskId} by user ${currentUser.id}`);
      console.log(`[useComments] Authentication status: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);
      setIsSubmitting(true);
      
      try {
        // Primeiro, vamos verificar se a tarefa existe
        const { data: taskCheck, error: taskError } = await supabase
          .from('tasks')
          .select('id')
          .eq('id', taskId)
          .single();
          
        if (taskError || !taskCheck) {
          console.error('[useComments] Task does not exist:', { taskId, error: taskError });
          throw new Error(`A tarefa (${taskId}) não foi encontrada. Verifique se a tarefa existe.`);
        }
        
        // Agora temos certeza que o taskId é válido, vamos adicionar o comentário
        const { data, error } = await supabase
          .from('task_comments')
          .insert({
            task_id: taskId,
            user_id: currentUser.id,
            text: text.trim()
          })
          .select()
          .single();
        
        if (error) {
          console.error('[useComments] Error inserting comment:', error);
          console.error('[useComments] Error details:', JSON.stringify(error));
          
          // Check for specific error types
          if (error.code === '42501' || error.message?.includes('permission denied')) {
            throw new Error('Permissão negada. Você pode não ter permissão para comentar nesta tarefa.');
          } else if (error.code === '23503') {
            throw new Error('A tarefa pode não existir mais ou o ID de usuário é inválido.');
          } else if (error.code === '23502') {
            // Violação de não nulo
            throw new Error('Dados obrigatórios não fornecidos: ' + error.message);
          } else if (error.code === '23514') {
            // Violação de restrição de verificação
            throw new Error('Dados inválidos: ' + error.message);
          } else {
            throw new Error(`Erro desconhecido (${error.code}): ${error.message}`);
          }
        }

        console.log('[useComments] Comment added successfully:', data);
        return data;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: (data) => {
      toast({
        id: uuidv4(),
        title: "Comentário adicionado",
        description: "Seu comentário foi adicionado com sucesso."
      });
      
      // Invalidate and refetch comments for this task
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    },
    onError: (error) => {
      console.error('[useComments] Error adding comment:', error);
      
      toast({
        id: uuidv4(),
        title: "Erro ao adicionar comentário",
        description: error instanceof Error 
          ? error.message 
          : "Não foi possível adicionar seu comentário. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  // Wrapper function for addComment with proper typing
  const addComment = (text: string, callbacks?: MutationCallbacks) => {
    console.log('[useComments] addComment called with text:', text);
    
    mutate(text, {
      onSuccess: () => {
        console.log('[useComments] Comment added successfully via callback');
        if (callbacks?.onSuccess) callbacks.onSuccess();
      },
      onError: (error) => {
        console.error('[useComments] Error in addComment callback:', error);
        if (callbacks?.onError) callbacks.onError(error);
      }
    });
  };

  // Delete comment mutation with proper callback handling
  const { mutate: deleteCommentMutate } = useMutation({
    mutationFn: async (commentId: string) => {
      console.log(`[useComments] Deleting comment: ${commentId}`);
      
      if (!isAuthenticated || !currentUser) {
        console.error('[useComments] User not authenticated when trying to delete');
        throw new Error('Usuário não autenticado. Por favor, faça login novamente.');
      }
      
      const { error } = await supabase
        .from('task_comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error('[useComments] Error deleting comment:', error);
        console.error('[useComments] Error details:', JSON.stringify(error));
        throw error;
      }
      
      console.log('[useComments] Comment deleted successfully');
      return commentId;
    },
    onSuccess: (commentId) => {
      toast({
        id: uuidv4(),
        title: "Comentário excluído",
        description: "O comentário foi excluído com sucesso."
      });
      
      // Invalidate and refetch comments for this task
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    },
    onError: (error) => {
      console.error('[useComments] Error deleting comment:', error);
      
      toast({
        id: uuidv4(),
        title: "Erro ao excluir comentário",
        description: error instanceof Error
          ? error.message
          : "Não foi possível excluir o comentário. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  // Wrapper function for deleteComment with proper typing
  const deleteComment = (commentId: string, callbacks?: MutationCallbacks) => {
    console.log('[useComments] deleteComment called with:', { commentId });
    
    deleteCommentMutate(commentId, {
      onSuccess: () => {
        console.log('[useComments] Comment deleted successfully via callback');
        if (callbacks?.onSuccess) callbacks.onSuccess();
      },
      onError: (error) => {
        console.error('[useComments] Error in deleteComment callback:', error);
        if (callbacks?.onError) callbacks.onError(error);
      }
    });
  };

  // Função para forçar a atualização dos comentários
  const refreshComments = () => {
    console.log('[useComments] Forcing comment refresh');
    return refetch();
  };

  return {
    comments,
    isLoading,
    isSubmitting,
    fetchError,
    addComment,
    deleteComment,
    refreshComments
  };
};
