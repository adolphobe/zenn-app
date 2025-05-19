
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../../types';
import { setTaskFeedback as setTaskFeedbackService } from '@/services/task';
import { logDiagnostics, logDateInfo } from '@/utils/diagnosticLog';

export const setTaskFeedback = async (
  dispatch: AppDispatch, 
  id: string, 
  feedback: 'transformed' | 'relief' | 'obligation'
) => {
  try {
    logDiagnostics('SET_FEEDBACK', `Setting feedback "${feedback}" for task ${id}`);
    
    // Get current task data for diagnostics
    const taskStore = document.querySelector('#task-store');
    const tasks = taskStore ? JSON.parse(taskStore.getAttribute('data-tasks') || '[]') : [];
    const task = tasks.find((t: any) => t.id === id);
    
    if (task) {
      logDateInfo('SET_FEEDBACK', 'Current task completedAt before setting feedback', task.completedAt);
    }
    
    // Update in database - only sending the feedback field to avoid disrupting other fields
    const updatedTask = await setTaskFeedbackService(id, feedback);
    
    logDateInfo('SET_FEEDBACK', 'Updated task completedAt from DB', updatedTask.completedAt);
    
    // Update local state
    dispatch({ type: 'SET_TASK_FEEDBACK', payload: { id, feedback } });
    
    // Check final state for diagnostics
    const updatedTaskStore = document.querySelector('#task-store');
    const updatedTasks = updatedTaskStore ? JSON.parse(updatedTaskStore.getAttribute('data-tasks') || '[]') : [];
    const updatedTaskLocal = updatedTasks.find((t: any) => t.id === id);
    
    if (updatedTaskLocal) {
      logDateInfo('SET_FEEDBACK', 'Final task completedAt after dispatch', updatedTaskLocal.completedAt);
    }
  } catch (error) {
    console.error('Error setting task feedback:', error);
    toast({
      id: uuidv4(),
      title: "Erro ao atualizar feedback",
      description: "Não foi possível salvar o feedback. Tente novamente.",
      variant: "destructive",
    });
  }
};

export const completeTaskWithDate = (
  dispatch: AppDispatch,
  title: string,
  completedAt: string
) => {
  logDiagnostics('COMPLETE_WITH_DATE', `Completing task "${title}" with date ${completedAt}`);
  logDateInfo('COMPLETE_WITH_DATE', 'Setting completedAt', completedAt);
  
  dispatch({ type: 'COMPLETE_TASK_WITH_DATE', payload: { title, completedAt } });
};
