
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../../types';
import { setTaskFeedback as setTaskFeedbackService } from '@/services/taskService';

export const setTaskFeedback = async (
  dispatch: AppDispatch, 
  id: string, 
  feedback: 'transformed' | 'relief' | 'obligation'
) => {
  try {
    // Update in database
    await setTaskFeedbackService(id, feedback);
    
    // Update local state
    dispatch({ type: 'SET_TASK_FEEDBACK', payload: { id, feedback } });
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
  dispatch({ type: 'COMPLETE_TASK_WITH_DATE', payload: { title, completedAt } });
};
