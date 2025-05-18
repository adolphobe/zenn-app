
import { TaskFormData } from '@/types';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../types';

// Task-related actions
export const addTask = (dispatch: AppDispatch, task: TaskFormData) => {
  dispatch({ type: 'ADD_TASK', payload: task });
};

export const deleteTask = (dispatch: AppDispatch, id: string) => {
  dispatch({ type: 'DELETE_TASK', payload: id });
};

export const toggleTaskCompleted = (dispatch: AppDispatch, id: string) => {
  dispatch({ type: 'TOGGLE_TASK_COMPLETED', payload: id });
};

export const toggleTaskHidden = (dispatch: AppDispatch, id: string) => {
  dispatch({ type: 'TOGGLE_TASK_HIDDEN', payload: id });
};

export const updateTask = (dispatch: AppDispatch, id: string, data: Partial<TaskFormData>) => {
  dispatch({ type: 'UPDATE_TASK', payload: { id, data } });
};

export const updateTaskTitle = (dispatch: AppDispatch, id: string, title: string) => {
  dispatch({ type: 'UPDATE_TASK_TITLE', payload: { id, title } });
};

export const setTaskFeedback = (
  dispatch: AppDispatch, 
  id: string, 
  feedback: 'transformed' | 'relief' | 'obligation'
) => {
  dispatch({ type: 'SET_TASK_FEEDBACK', payload: { id, feedback } });
};

export const restoreTask = (dispatch: AppDispatch, taskId: string) => {
  dispatch({ type: 'RESTORE_TASK', payload: taskId });
  toast({
    id: uuidv4(),
    title: "Tarefa restaurada",
    description: "A tarefa foi restaurada com sucesso."
  });
};

export const completeTaskWithDate = (
  dispatch: AppDispatch,
  title: string,
  completedAt: string
) => {
  dispatch({ type: 'COMPLETE_TASK_WITH_DATE', payload: { title, completedAt } });
};

export const addComment = (dispatch: AppDispatch, taskId: string, text: string) => {
  dispatch({ type: 'ADD_COMMENT', payload: { taskId, text } });
  toast({
    id: uuidv4(),
    title: "Comentário adicionado",
    description: "Seu comentário foi adicionado com sucesso."
  });
};

export const deleteComment = (dispatch: AppDispatch, taskId: string, commentId: string) => {
  dispatch({ type: 'DELETE_COMMENT', payload: { taskId, commentId } });
  toast({
    id: uuidv4(),
    title: "Comentário removido",
    description: "O comentário foi removido com sucesso."
  });
};
