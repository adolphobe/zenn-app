
import { supabase } from '@/integrations/supabase/client';
import { validateTaskExists } from './taskValidation';

/**
 * Adds a comment to a task with validation and error handling
 */
export const addComment = async (taskId: string, userId: string, text: string): Promise<any> => {
  // First validate the task exists
  await validateTaskExists(taskId);
  
  if (!userId) throw new Error('User ID is required');
  if (!text) throw new Error('Comment text is required');
  
  console.log(`[taskComments] Adding comment to task ${taskId} by user ${userId}`);
  
  const { data, error } = await supabase
    .from('task_comments')
    .insert({
      task_id: taskId,
      user_id: userId,
      text
    })
    .select()
    .single();

  if (error) {
    console.error('[taskComments] Error adding comment:', error);
    throw error;
  }

  console.log('[taskComments] Comment added successfully:', data);
  return data;
};

/**
 * Deletes a comment with validation and error handling
 */
export const deleteComment = async (commentId: string): Promise<void> => {
  if (!commentId) throw new Error('Comment ID is required');
  
  console.log(`[taskComments] Deleting comment ${commentId}`);
  
  const { error } = await supabase
    .from('task_comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    console.error('[taskComments] Error deleting comment:', error);
    throw error;
  }

  console.log('[taskComments] Comment deleted successfully');
};

/**
 * Fetches comments for a specific task
 */
export const getTaskComments = async (taskId: string): Promise<any[]> => {
  if (!taskId) throw new Error('Task ID is required');
  
  console.log(`[taskComments] Fetching comments for task ${taskId}`);
  
  const { data, error } = await supabase
    .from('task_comments')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[taskComments] Error fetching comments:', error);
    throw error;
  }

  console.log(`[taskComments] Fetched ${data?.length || 0} comments for task ${taskId}`);
  return data || [];
};
