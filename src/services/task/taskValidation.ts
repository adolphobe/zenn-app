
import { supabase } from '@/integrations/supabase/client';

/**
 * Validates that a task ID exists in the database
 * Returns the task if found, throws an error if not
 */
export const validateTaskExists = async (taskId: string): Promise<any> => {
  if (!taskId) throw new Error('Task ID is required');
  
  const { data, error } = await supabase
    .from('tasks')
    .select('id')
    .eq('id', taskId)
    .single();
    
  if (error || !data) {
    console.error('Task validation error:', error || 'Task not found');
    throw new Error(`Task with ID ${taskId} not found`);
  }
  
  return data;
};
