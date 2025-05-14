
import { TaskFormData } from '@/types';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../types';

// Task-related actions
export const addTask = (dispatch: AppDispatch, task: TaskFormData) => {
  dispatch({ type: 'ADD_TASK', payload: task });
  toast({
    id: uuidv4(),
    title: "Tarefa adicionada",
    description: `"${task.title}" foi adicionada com sucesso.`
  });
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
