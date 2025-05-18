import { supabase } from '@/integrations/supabase/client';
import { Task, TaskFormData } from '@/types';

// Função auxiliar para mapear a resposta do Supabase para o formato Task
const mapToTask = (data: any): Task => ({
  id: data.id,
  title: data.title,
  consequenceScore: data.consequence_score,
  prideScore: data.pride_score,
  constructionScore: data.construction_score,
  totalScore: data.total_score,
  idealDate: data.ideal_date ? new Date(data.ideal_date) : null,
  hidden: data.hidden,
  completed: data.completed,
  completedAt: data.completed_at,
  createdAt: new Date(data.created_at),
  feedback: data.feedback,
  pillar: data.pillar,
  comments: data.comments || []
});

export const fetchTasks = async (userId: string, completed: boolean = false): Promise<Task[]> => {
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

  return (data || []).map(mapToTask);
};

export const createTask = async (taskData: TaskFormData, userId: string): Promise<Task> => {
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

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: userId,
      title: taskData.title,
      consequence_score: taskData.consequenceScore || 3,
      pride_score: taskData.prideScore || 3,
      construction_score: taskData.constructionScore || 3,
      total_score: totalScore,
      ideal_date: taskData.idealDate ? new Date(taskData.idealDate).toISOString() : null,
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

export const updateTask = async (id: string, taskData: Partial<TaskFormData>): Promise<Task> => {
  let updateData: Record<string, any> = { ...taskData };
  
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
  
  // Format idealDate if it exists
  if (taskData.idealDate) {
    updateData.ideal_date = new Date(taskData.idealDate).toISOString();
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

export const deleteTask = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const toggleTaskCompletion = async (id: string, currentStatus: boolean): Promise<Task> => {
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

export const toggleTaskHidden = async (id: string, currentStatus: boolean): Promise<Task> => {
  console.log(`Tentando atualizar tarefa com ID ${id}, status atual hidden: ${currentStatus}`);
  
  const { data, error } = await supabase
    .from('tasks')
    .update({ hidden: !currentStatus })
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

  console.log('Tarefa atualizada com sucesso:', data);

  return mapToTask(data);
};

export const setTaskFeedback = async (
  id: string, 
  feedback: 'transformed' | 'relief' | 'obligation'
): Promise<Task> => {
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

export const addComment = async (taskId: string, userId: string, text: string): Promise<any> => {
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

export const deleteComment = async (commentId: string): Promise<void> => {
  const { error } = await supabase
    .from('task_comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export const restoreTask = async (id: string): Promise<Task> => {
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
