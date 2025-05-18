
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/types';
import { AppState, Action } from '../../types';
import { dateService } from '@/services/dateService';

// Task creation and deletion reducers
export const addTask = (state: AppState, action: Action): AppState => {
  if (action.type !== 'ADD_TASK') return state;
  
  // Garantir que campos de data sejam Date objects
  const idealDate = dateService.parseDate(action.payload.idealDate);
  
  const newTask: Task = {
    id: uuidv4(),
    title: action.payload.title,
    consequenceScore: action.payload.consequenceScore,
    prideScore: action.payload.prideScore,
    constructionScore: action.payload.constructionScore,
    totalScore: action.payload.consequenceScore + action.payload.prideScore + action.payload.constructionScore,
    idealDate: idealDate,
    hidden: (action.payload.consequenceScore + action.payload.prideScore + action.payload.constructionScore) < 8,
    completed: false,
    completedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: action.payload.userId || '',
    feedback: null,
    comments: [],
    operationLoading: {}
  };
  
  // Adicionar pillar se for fornecido
  if (action.payload.pillar) {
    newTask.pillar = action.payload.pillar;
  }
  
  return { ...state, tasks: [...state.tasks, newTask] };
};

// Added a new reducer to clear all tasks
export const clearTasks = (state: AppState, action: Action): AppState => {
  if (action.type !== 'CLEAR_TASKS') return state;
  return { ...state, tasks: [] };
};

export const deleteTask = (state: AppState, action: Action): AppState => {
  if (action.type !== 'DELETE_TASK') return state;

  return {
    ...state,
    tasks: state.tasks.filter(task => task.id !== action.payload)
  };
};
