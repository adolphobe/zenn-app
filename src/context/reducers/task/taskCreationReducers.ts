
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/types';
import { AppState, Action } from '../../types';
import { dateService } from '@/services/dateService';

// Task creation and deletion reducers
export const addTask = (state: AppState, action: Action): AppState => {
  if (action.type !== 'ADD_TASK') return state;
  
  // Garantir que campos de data sejam Date objects
  const idealDate = dateService.parseDate(action.payload.idealDate);
  
  // Calcular o score total
  const consequenceScore = action.payload.consequenceScore || 3;
  const prideScore = action.payload.prideScore || 3;
  const constructionScore = action.payload.constructionScore || 3;
  const totalScore = consequenceScore + prideScore + constructionScore;
  
  // Determinar se a tarefa deve ser oculta com base no score
  // Se o payload já tiver a propriedade hidden definida, use-a, caso contrário calcule com base no score
  const isHidden = action.payload.hidden !== undefined 
    ? action.payload.hidden 
    : totalScore < 8;
  
  const newTask: Task = {
    id: uuidv4(),
    title: action.payload.title,
    consequenceScore: consequenceScore,
    prideScore: prideScore,
    constructionScore: constructionScore,
    totalScore: totalScore,
    idealDate: idealDate,
    hidden: isHidden,
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
