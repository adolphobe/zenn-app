
import { useState, useEffect } from 'react';
import { Comment } from '@/types';
import { useAuth } from '@/context/auth';
import { getTaskComments } from '@/services/task/taskComments';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { addComment as addCommentService, deleteComment as deleteCommentService } from '@/services/task/taskComments';

// Define types for callbacks
type MutationCallbacks = {
  onSuccess?: () => void;
  onError?: (error: any) => void;
};

export const useComments = (taskId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Use React Query to fetch comments
  const { 
    data: comments = [], 
    isLoading, 
    error: fetchError,
    refetch: refreshComments
  } = useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => getTaskComments(taskId),
    // Don't fetch if no taskId or we're not authenticated
    enabled: !!taskId && isAuthenticated,
    staleTime: 1000 * 60, // 1 minute
  });

  // Mutation for adding a comment
  const addComment = async (text: string, callbacks?: MutationCallbacks) => {
    if (!isAuthenticated || !currentUser?.id) {
      console.error('Cannot add comment: User not authenticated');
      if (callbacks?.onError) {
        callbacks.onError(new Error('User not authenticated'));
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Add comment to database
      const newComment = await addCommentService(taskId, currentUser.id, text);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      
      if (callbacks?.onSuccess) {
        callbacks.onSuccess();
      }
      
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
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
      // Delete comment from database
      await deleteCommentService(commentId);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      
      if (callbacks?.onSuccess) {
        callbacks.onSuccess();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      if (callbacks?.onError) {
        callbacks.onError(error);
      }
    }
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
