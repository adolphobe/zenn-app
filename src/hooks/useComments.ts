
import { useState } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Comment } from '@/types';
import { useAuth } from '@/context/auth';
import { v4 as uuidv4 } from 'uuid';
import { logComment } from '@/utils/commentLogger';

// Define types for mutation callbacks
type MutationCallbacks = {
  onSuccess?: () => void;
  onError?: (error: any) => void;
};

export const useComments = (taskId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { currentUser, isAuthenticated } = useAuth();
  
  logComment.render('useComments hook', { taskId, userId: currentUser?.id, isAuthenticated });
  
  // Registrar informações da sessão atual do Supabase (para debug)
  supabase.auth.getSession().then(({ data }) => {
    logComment.authCheck(!!data.session, data.session?.user?.id);
    logComment.api.response('getSession', { 
      hasSession: !!data.session, 
      userId: data.session?.user?.id 
    });
  });

  // Fetch comments for a specific task
  const { 
    data: comments = [], 
    isLoading, 
    error: fetchError,
    refetch
  } = useQuery({
    queryKey: ['comments', taskId],
    queryFn: async () => {
      logComment.api.request('fetchComments', { taskId });
      
      // Verificação extra de autenticação
      const sessionCheck = await supabase.auth.getSession();
      logComment.api.response('sessionCheck', { 
        hasSession: !!sessionCheck.data.session,
        userId: sessionCheck.data.session?.user?.id || 'none'
      });
      
      const { data, error } = await supabase
        .from('task_comments')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error) {
        logComment.api.error('fetchComments', error);
        throw error;
      }
      
      logComment.api.response('fetchComments', { count: data?.length || 0 });
      
      // Map database comments to our Comment type
      return data.map((comment: any): Comment => ({
        id: comment.id,
        text: comment.text,
        createdAt: comment.created_at,
        userId: comment.user_id
      }));
    },
    enabled: !!taskId,
    staleTime: 10000, // 10 segundos para considerar dados obsoletos
    refetchInterval: false, // Não refetch automaticamente
  });

  // Add comment mutation with proper callback handling
  const { mutate } = useMutation({
    mutationFn: async (text: string) => {
      logComment.attempt(taskId, text, currentUser?.id);
      
      if (!isAuthenticated || !currentUser) {
        logComment.authError('Usuário não autenticado para adicionar comentário');
        
        // Verificação detalhada de sessão
        const { data: sessionData } = await supabase.auth.getSession();
        logComment.authCheck(!!sessionData.session, sessionData.session?.user?.id);
        logComment.api.response('getSessionInAddComment', { 
          hasSession: !!sessionData.session,
          sessionUserId: sessionData.session?.user?.id,
          currentUser: currentUser?.id,
          isAuthenticated
        });
        
        throw new Error('Usuário não autenticado. Por favor, faça login novamente.');
      }
      
      if (!text.trim()) {
        logComment.validation('Texto do comentário está vazio');
        throw new Error('O texto do comentário não pode estar vazio');
      }
      
      if (!taskId) {
        logComment.validation('ID da tarefa está ausente', { taskId });
        throw new Error('ID da tarefa ausente');
      }
      
      logComment.api.request('addComment', { taskId, userId: currentUser.id, textLength: text.length });
      setIsSubmitting(true);
      
      try {
        // Primeiro, vamos verificar se a tarefa existe
        logComment.api.request('checkTaskExists', { taskId });
        const { data: taskCheck, error: taskError } = await supabase
          .from('tasks')
          .select('id')
          .eq('id', taskId)
          .single();
          
        if (taskError || !taskCheck) {
          logComment.api.error('checkTaskExists', { taskError, taskId });
          throw new Error(`A tarefa (${taskId}) não foi encontrada. Verifique se a tarefa existe.`);
        }
        
        logComment.api.response('checkTaskExists', { exists: true, taskId });
        
        // Agora temos certeza que o taskId é válido, vamos adicionar o comentário
        logComment.api.request('insertComment', { taskId, userId: currentUser.id });
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
          logComment.api.error('insertComment', error);
          
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

        logComment.success(taskId, data.id);
        logComment.api.response('insertComment', data);
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
      
      // Forçar o refetch imediatamente
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['comments', taskId] });
        queryClient.refetchQueries({ queryKey: ['tasks'] });
        queryClient.refetchQueries({ queryKey: ['task', taskId] });
      }, 100);
    },
    onError: (error) => {
      logComment.error('Erro em mutação onError', error);
      
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
    logComment.attempt(taskId, text, currentUser?.id);
    
    mutate(text, {
      onSuccess: () => {
        logComment.success(taskId, 'callback-success');
        if (callbacks?.onSuccess) {
          // Chamar o callback após um pequeno delay para garantir que as atualizações de estado ocorreram
          setTimeout(() => callbacks.onSuccess(), 50);
        }
      },
      onError: (error) => {
        logComment.error('Erro em addComment callback', error);
        if (callbacks?.onError) callbacks.onError(error);
      }
    });
  };

  // Delete comment mutation with proper callback handling
  const { mutate: deleteCommentMutate } = useMutation({
    mutationFn: async (commentId: string) => {
      logComment.api.request('deleteComment', { commentId });
      
      if (!isAuthenticated || !currentUser) {
        logComment.authError('Usuário não autenticado para excluir comentário');
        throw new Error('Usuário não autenticado. Por favor, faça login novamente.');
      }
      
      const { error } = await supabase
        .from('task_comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        logComment.api.error('deleteComment', error);
        throw error;
      }
      
      logComment.api.response('deleteComment', { success: true, commentId });
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
      
      // Forçar o refetch imediatamente
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['comments', taskId] });
        queryClient.refetchQueries({ queryKey: ['tasks'] });
        queryClient.refetchQueries({ queryKey: ['task', taskId] });
      }, 100);
    },
    onError: (error) => {
      logComment.error('Erro em deleteComment mutation', error);
      
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
    logComment.api.request('deleteComment', { commentId });
    
    deleteCommentMutate(commentId, {
      onSuccess: () => {
        logComment.api.response('deleteComment callback', { success: true });
        if (callbacks?.onSuccess) {
          // Chamar o callback após um pequeno delay para garantir que as atualizações de estado ocorreram
          setTimeout(() => callbacks.onSuccess(), 50);
        }
      },
      onError: (error) => {
        logComment.error('Erro em deleteComment callback', error);
        if (callbacks?.onError) callbacks.onError(error);
      }
    });
  };

  // Função para forçar a atualização dos comentários
  const refreshComments = () => {
    logComment.api.request('refreshComments', { taskId });
    queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
    queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    
    // Forçar o refetch imediatamente
    setTimeout(() => {
      queryClient.refetchQueries({ queryKey: ['comments', taskId] });
      queryClient.refetchQueries({ queryKey: ['task', taskId] });
    }, 50);
    
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
