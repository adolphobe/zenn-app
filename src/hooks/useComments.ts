
import { useState, useEffect } from 'react';
import { Comment } from '@/types';
import { useAuth } from '@/context/auth';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { 
  getTaskComments, 
  addComment as addCommentService, 
  deleteComment as deleteCommentService 
} from '@/services/task/taskComments';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { mapToComment } from '@/services/task/taskMapper';

// Define types for callbacks
type MutationCallbacks = {
  onSuccess?: () => void;
  onError?: (error: any) => void;
};

export const useComments = (taskId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Add logging for debugging
  console.log('[useComments] Init with taskId:', taskId, 'isAuthenticated:', isAuthenticated);

  // Use React Query to fetch comments
  const { 
    data: comments = [], 
    isLoading, 
    error: fetchError,
    refetch: refreshComments,
    isRefetching
  } = useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => getTaskComments(taskId),
    // Don't fetch if no taskId or we're not authenticated
    enabled: !!taskId && isAuthenticated,
    staleTime: 1000 * 60, // 1 minute
    select: (data) => {
      // Log the raw data from database for debugging
      console.log('[useComments] Raw comment data:', data);
      
      // Map database fields to UI format
      return data.map(comment => mapToComment(comment));
    }
  });

  // Mutation for adding a comment
  const addCommentMutation = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      if (!isAuthenticated || !currentUser?.id) {
        throw new Error('User not authenticated');
      }
      
      console.log('[useComments] Adding comment to taskId:', taskId, 'userId:', currentUser.id, 'text:', text);
      return addCommentService(taskId, currentUser.id, text);
    },
    onSuccess: () => {
      console.log('[useComments] Comment added successfully, invalidating queries');
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      
      toast({
        id: uuidv4(),
        title: "Comentário adicionado",
        description: "Seu comentário foi adicionado com sucesso."
      });
    },
    onError: (error) => {
      console.error('[useComments] Error adding comment:', error);
      
      toast({
        id: uuidv4(),
        title: "Erro ao adicionar comentário",
        description: "Não foi possível adicionar seu comentário. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  // Wrapper function for adding a comment
  const addComment = async (text: string, callbacks?: MutationCallbacks) => {
    if (!isAuthenticated || !currentUser?.id) {
      console.error('[useComments] Cannot add comment: User not authenticated');
      if (callbacks?.onError) {
        callbacks.onError(new Error('User not authenticated'));
      }
      return;
    }

    console.log('[useComments] Adding comment, text:', text, 'taskId:', taskId);
    setIsSubmitting(true);
    
    try {
      // Add comment using the mutation
      const newComment = await addCommentMutation.mutateAsync({ text });
      console.log('[useComments] Comment added successfully:', newComment);
      
      // Call success callback if provided
      if (callbacks?.onSuccess) {
        console.log('[useComments] Calling onSuccess callback');
        callbacks.onSuccess();
      }
      
      return newComment;
    } catch (error) {
      console.error('[useComments] Error adding comment:', error);
      if (callbacks?.onError) {
        callbacks.onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mutation for deleting a comment
  const deleteComment = async (commentId: string, callbacks?: MutationCallbacks) => {
    try {
      console.log('[useComments] Deleting comment:', commentId);
      
      // Delete comment from database
      await deleteCommentService(commentId);
      console.log('[useComments] Comment deleted successfully');
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      
      toast({
        id: uuidv4(),
        title: "Comentário excluído",
        description: "O comentário foi excluído com sucesso."
      });
      
      if (callbacks?.onSuccess) {
        callbacks.onSuccess();
      }
    } catch (error) {
      console.error('[useComments] Error deleting comment:', error);
      
      toast({
        id: uuidv4(),
        title: "Erro ao excluir comentário",
        description: "Não foi possível excluir o comentário. Tente novamente.",
        variant: "destructive",
      });
      
      if (callbacks?.onError) {
        callbacks.onError(error);
      }
    }
  };

  return {
    comments,
    isLoading,
    isSubmitting,
    isRefetching,
    fetchError,
    addComment,
    deleteComment,
    refreshComments
  };
};
