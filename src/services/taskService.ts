
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskFormData } from '@/types';
import { dateService } from './dateService';

// Helper function to map the response from Supabase to the Task type
const mapToTask = (data: any): Task => ({
  id: data.id,
  title: data.title,
  consequenceScore: data.consequence_score,
  prideScore: data.pride_score,
  constructionScore: data.construction_score,
  totalScore: data.total_score,
  // Usamos dateService para garantir datas consistentes
  idealDate: dateService.parseDate(data.ideal_date),
  hidden: data.hidden,
  completed: data.completed,
  completedAt: dateService.parseDate(data.completed_at),
  // Garantir que createdAt seja sempre uma data válida
  createdAt: dateService.parseDate(data.created_at) || new Date(),
  updatedAt: dateService.parseDate(data.updated_at) || new Date(),
  userId: data.user_id || '',
  feedback: data.feedback,
  pillar: data.pillar,
  comments: data.comments || [],
  operationLoading: {}
});

/**
 * Validates that a task ID exists in the database
 * Returns the task if found, throws an error if not
 */
const validateTaskExists = async (taskId: string): Promise<any> => {
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

  // Mapear dados com tratamento consistente de datas
  return (data || []).map(mapToTask);
};

/**
 * Creates a new task with validation and error handling
 */
export const createTask = async (taskData: TaskFormData, userId: string): Promise<Task> => {
  if (!userId) throw new Error('User ID is required');
  if (!taskData.title) throw new Error('Task title is required');

  const totalScore = (taskData.consequenceScore || 0) + 
                    (taskData.prideScore || 0) + 
                    (taskData.constructionScore || 0);

  // Determine dominant pillar
  const scores = [
    { name: 'risco', value: taskData.consequenceScore || 0 },
    { name: 'orgulho', value: taskData.prideScore || 0 },
    { name: 'crescimento', value: taskData.constructionScore || 0 },
  ];
  
  const dominantPillar = scores.reduce((prev, current) => 
    (prev.value > current.value) ? prev : current
  ).name;

  // Converter Date para ISO string para o banco de dados
  const idealDateISO = dateService.toISOString(taskData.idealDate);

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
      hidden: false,
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
    // Converter Date para ISO string para o banco de dados
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
      
      updateData.total_score = consequenceScore + prideScore + constructionScore;
      
      // Update dominant pillar if scores changed
      const scores = [
        { name: 'risco', value: consequenceScore },
        { name: 'orgulho', value: prideScore },
        { name: 'crescimento', value: constructionScore },
      ];
      
      updateData.pillar = scores.reduce((prev, current) => 
        (prev.value > current.value) ? prev : current
      ).name;
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

/**
 * Toggles a task's completion status with validation and error handling
 */
export const toggleTaskCompletion = async (id: string, currentStatus: boolean): Promise<Task> => {
  // First validate the task exists
  await validateTaskExists(id);
  
  const completionData = currentStatus ? 
    { completed: false, completed_at: null } : 
    { completed: true, completed_at: new Date().toISOString() };
  
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

  return mapToTask(data);
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
