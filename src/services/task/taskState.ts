
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types';
import { dateService } from '../dateService';
import { logDiagnostics, logDateInfo } from '@/utils/diagnosticLog';
import { validateTaskExists } from './taskValidation';
import { mapToTask } from './taskMapper';

/**
 * Toggles a task's completion status with validation and error handling
 */
export const toggleTaskCompletion = async (id: string, currentStatus: boolean): Promise<Task> => {
  // First validate the task exists
  await validateTaskExists(id);
  
  // Get the current timestamp in ISO format
  const now = new Date();
  const nowIso = now.toISOString();
  
  logDiagnostics('TASK_SERVICE', `Toggling task completion for ${id}, current status: ${currentStatus}`);
  logDateInfo('TASK_SERVICE', 'Using completion timestamp', now);
  
  // Prepare completion data with explicit date handling
  const completionData = currentStatus ? 
    { completed: false, completed_at: null } : 
    { completed: true, completed_at: nowIso };
  
  logDiagnostics('TASK_SERVICE', 'Setting completion data', completionData);
  
  const { data, error } = await supabase
    .from('tasks')
    .update(completionData)
    .eq('id', id)
    .select(`
      *,
      comments:task_comments(*)
    `)
    .single();

  if (error) {
    console.error('Error toggling task completion:', error);
    throw error;
  }

  // Log the returned data for diagnosis
  logDateInfo('TASK_SERVICE', 'DB returned completed_at', data.completed_at);
  
  // Map the data to our Task type
  const mappedTask = mapToTask(data);
  
  // Log the mapped task
  logDateInfo('TASK_SERVICE', 'Mapped task completedAt', mappedTask.completedAt);
  
  return mappedTask;
};

/**
 * Toggles a task's hidden status with validation and error handling
 */
export const toggleTaskHidden = async (id: string): Promise<Task> => {
  // First validate the task exists
  const existingTask = await validateTaskExists(id);
  
  if (!existingTask) {
    throw new Error(`Tarefa com ID ${id} não foi encontrada no banco de dados`);
  }
  
  // Fetch current hidden status
  const { data: taskData, error: fetchError } = await supabase
    .from('tasks')
    .select('hidden')
    .eq('id', id)
    .single();
    
  if (fetchError || !taskData) {
    console.error('Error fetching task hidden status:', fetchError || 'Task not found');
    throw new Error('Could not determine current task visibility status');
  }
  
  // Update with confirmed current state
  const { data, error } = await supabase
    .from('tasks')
    .update({ hidden: !taskData.hidden })
    .eq('id', id)
    .select(`
      *,
      comments:task_comments(*)
    `)
    .single();

  if (error) {
    console.error('Error toggling task hidden status:', error);
    throw error;
  }

  return mapToTask(data);
};

/**
 * Sets a task's feedback with validation and error handling
 */
export const setTaskFeedback = async (
  id: string, 
  feedback: 'transformed' | 'relief' | 'obligation'
): Promise<Task> => {
  // First validate the task exists
  await validateTaskExists(id);
  
  const { data, error } = await supabase
    .from('tasks')
    .update({ feedback })
    .eq('id', id)
    .select(`
      *,
      comments:task_comments(*)
    `)
    .single();

  if (error) {
    console.error('Error setting task feedback:', error);
    throw error;
  }

  return mapToTask(data);
};

/**
 * Restores a completed task with validation and error handling
 */
export const restoreTask = async (id: string): Promise<Task> => {
  // First validate the task exists
  await validateTaskExists(id);
  
  const { data, error } = await supabase
    .from('tasks')
    .update({
      completed: false,
      completed_at: null
    })
    .eq('id', id)
    .select(`
      *,
      comments:task_comments(*)
    `)
    .single();

  if (error) {
    console.error('Error restoring task:', error);
    throw error;
  }

  return mapToTask(data);
};
