
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
    error: fetchError 
  } = useQuery({
    queryKey: ['comments', taskId],
    queryFn: async () => {
      console.log(`[useComments] Fetching comments for task: ${taskId}`);
      const { data, error } = await supabase
        .from('task_comments')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('[useComments] Error fetching comments:', error);
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
    mutationFn: async (payload: { text: string; callbacks?: MutationCallbacks }) => {
      const { text, callbacks } = payload;
      
      if (!isAuthenticated || !currentUser) {
        console.error('[useComments] User not authenticated');
        throw new Error('User not authenticated');
      }
      
      if (!text.trim()) {
        console.error('[useComments] Comment text is empty');
        throw new Error('Comment text cannot be empty');
      }
      
      console.log(`[useComments] Adding comment to task ${taskId} by user ${currentUser.id}`);
      setIsSubmitting(true);
      
      try {
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
          throw error;
        }

        console.log('[useComments] Comment added successfully:', data);
        return data;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: (_, variables) => {
      toast({
        id: uuidv4(),
        title: "Comentário adicionado",
        description: "Seu comentário foi adicionado com sucesso."
      });
      
      // Invalidate and refetch comments for this task
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      
      // Call the onSuccess callback if provided
      if (variables.callbacks?.onSuccess) {
        variables.callbacks.onSuccess();
      }
      
      return true;
    },
    onError: (error, variables) => {
      console.error('[useComments] Error adding comment:', error);
      
      toast({
        id: uuidv4(),
        title: "Erro ao adicionar comentário",
        description: error instanceof Error 
          ? error.message 
          : "Não foi possível adicionar seu comentário. Tente novamente.",
        variant: "destructive",
      });
      
      // Call the onError callback if provided
      if (variables.callbacks?.onError) {
        variables.callbacks.onError(error);
      }
      
      return false;
    }
  });

  // Wrapper function for addComment with proper typing
  const addComment = (text: string, callbacks?: MutationCallbacks) => {
    console.log('[useComments] addComment called with:', { text, callbacks });
    return mutate({ text, callbacks });
  };

  // Delete comment mutation with proper callback handling
  const { mutate: deleteCommentMutate } = useMutation({
    mutationFn: async (payload: { commentId: string; callbacks?: MutationCallbacks }) => {
      const { commentId } = payload;
      
      console.log(`[useComments] Deleting comment: ${commentId}`);
      
      const { error } = await supabase
        .from('task_comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error('[useComments] Error deleting comment:', error);
        throw error;
      }
      
      console.log('[useComments] Comment deleted successfully');
      return commentId;
    },
    onSuccess: (_, variables) => {
      toast({
        id: uuidv4(),
        title: "Comentário excluído",
        description: "O comentário foi excluído com sucesso."
      });
      
      // Invalidate and refetch comments for this task
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      
      // Call the onSuccess callback if provided
      if (variables.callbacks?.onSuccess) {
        variables.callbacks.onSuccess();
      }
      
      return true;
    },
    onError: (error, variables) => {
      console.error('[useComments] Error deleting comment:', error);
      
      toast({
        id: uuidv4(),
        title: "Erro ao excluir comentário",
        description: "Não foi possível excluir o comentário. Tente novamente.",
        variant: "destructive",
      });
      
      // Call the onError callback if provided
      if (variables.callbacks?.onError) {
        variables.callbacks.onError(error);
      }
      
      return false;
    }
  });

  // Wrapper function for deleteComment with proper typing
  const deleteComment = (commentId: string, callbacks?: MutationCallbacks) => {
    console.log('[useComments] deleteComment called with:', { commentId, callbacks });
    return deleteCommentMutate({ commentId, callbacks });
  };

  return {
    comments,
    isLoading,
    isSubmitting,
    fetchError,
    addComment,
    deleteComment,
  };
};
