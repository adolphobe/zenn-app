
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
    console.error('Error adding comment:', error);
    throw error;
  }

  return data;
};

/**
 * Deletes a comment with validation and error handling
 */
export const deleteComment = async (commentId: string): Promise<void> => {
  if (!commentId) throw new Error('Comment ID is required');
  
  const { error } = await supabase
    .from('task_comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};
