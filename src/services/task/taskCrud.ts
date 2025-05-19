
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskFormData } from '@/types';
import { dateService } from '../dateService';
import { logDiagnostics } from '@/utils/diagnosticLog';
import { 
  mapToTask, 
  calculateDominantPillar, 
  calculateTotalScore 
} from './taskMapper';
import { validateTaskExists } from './taskValidation';

/**
 * Fetches tasks from the database with error handling and validation
 */
export const fetchTasks = async (userId: string, completed: boolean = false): Promise<Task[]> => {
  if (!userId) throw new Error('User ID is required');
  
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      comments:task_comments(*)
    `)
    .eq('user_id', userId)
    .eq('completed', completed)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }

  // Map data with consistent date handling
  return (data || []).map(mapToTask);
};

/**
 * Creates a new task with validation and error handling
 */
export const createTask = async (taskData: TaskFormData, userId: string): Promise<Task> => {
  if (!userId) throw new Error('User ID is required');
  if (!taskData.title) throw new Error('Task title is required');

  const totalScore = calculateTotalScore(
    taskData.consequenceScore || 0,
    taskData.prideScore || 0,
    taskData.constructionScore || 0
  );

  // Determine dominant pillar
  const dominantPillar = calculateDominantPillar(
    taskData.consequenceScore || 0,
    taskData.prideScore || 0,
    taskData.constructionScore || 0
  );

  // Convert Date to ISO string for the database
  const idealDateISO = dateService.toISOString(taskData.idealDate);
  
  // Determinar se a tarefa deve ser oculta com base no score
  // Se taskData.hidden estiver definido, use-o, caso contrário, defina como true se totalScore < 8
  const isHidden = taskData.hidden !== undefined ? taskData.hidden : totalScore < 8;

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: userId,
      title: taskData.title,
      consequence_score: taskData.consequenceScore || 3,
      pride_score: taskData.prideScore || 3,
      construction_score: taskData.constructionScore || 3,
      total_score: totalScore,
      ideal_date: idealDateISO,
      pillar: dominantPillar,
      hidden: isHidden,
      completed: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }

  return mapToTask({...data, comments: []});
};

/**
 * Updates a task with validation and error handling
 */
export const updateTask = async (id: string, taskData: Partial<TaskFormData>): Promise<Task> => {
  // First validate the task exists
  await validateTaskExists(id);
  
  let updateData: Record<string, any> = {};
  
  // Map task data fields to database fields
  if (taskData.title !== undefined) updateData.title = taskData.title;
  if (taskData.consequenceScore !== undefined) updateData.consequence_score = taskData.consequenceScore;
  if (taskData.prideScore !== undefined) updateData.pride_score = taskData.prideScore;
  if (taskData.constructionScore !== undefined) updateData.construction_score = taskData.constructionScore;
  if (taskData.idealDate !== undefined) {
    // Convert Date to ISO string for the database
    updateData.ideal_date = dateService.toISOString(taskData.idealDate);
  }
  
  // Calculate total score if any score component is updated
  if (taskData.consequenceScore !== undefined || taskData.prideScore !== undefined || taskData.constructionScore !== undefined) {
    // First get the current task to have the complete data
    const { data: currentTask } = await supabase
      .from('tasks')
      .select('consequence_score, pride_score, construction_score')
      .eq('id', id)
      .single();
    
    if (currentTask) {
      const consequenceScore = taskData.consequenceScore ?? currentTask.consequence_score;
      const prideScore = taskData.prideScore ?? currentTask.pride_score;
      const constructionScore = taskData.constructionScore ?? currentTask.construction_score;
      
      updateData.total_score = calculateTotalScore(
        consequenceScore,
        prideScore,
        constructionScore
      );
      
      // Update dominant pillar if scores changed
      updateData.pillar = calculateDominantPillar(
        consequenceScore,
        prideScore,
        constructionScore
      );
    }
  }

  const { data, error } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      comments:task_comments(*)
    `)
    .single();

  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }

  return mapToTask(data);
};

/**
 * Deletes a task with validation and error handling
 */
export const deleteTask = async (id: string): Promise<void> => {
  // First validate the task exists
  await validateTaskExists(id);
  
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
