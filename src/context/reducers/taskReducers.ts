
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../../types';
import { AppState, Action } from '../types';

// Task-related reducers
export const addTask = (state: AppState, action: Action): AppState => {
  if (action.type !== 'ADD_TASK') return state;
  
  const newTask: Task = {
    id: uuidv4(),
    title: action.payload.title,
    consequenceScore: action.payload.consequenceScore,
    prideScore: action.payload.prideScore,
    constructionScore: action.payload.constructionScore,
    totalScore: action.payload.consequenceScore + action.payload.prideScore + action.payload.constructionScore,
    idealDate: action.payload.idealDate || null,
    hidden: (action.payload.consequenceScore + action.payload.prideScore + action.payload.constructionScore) < 8,
    completed: false,
    createdAt: new Date(),
    feedback: null,
    comments: []
  };
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

export const toggleTaskCompleted = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_TASK_COMPLETED') return state;

  return {
    ...state,
    tasks: state.tasks.map(task =>
      task.id === action.payload ? { 
        ...task, 
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      } : task
    )
  };
};

export const toggleTaskHidden = (state: AppState, action: Action): AppState => {
  if (action.type !== 'TOGGLE_TASK_HIDDEN') return state;

  return {
    ...state,
    tasks: state.tasks.map(task =>
      task.id === action.payload ? { ...task, hidden: !task.hidden } : task
    )
  };
};

export const updateTask = (state: AppState, action: Action): AppState => {
  if (action.type !== 'UPDATE_TASK') return state;

  return {
    ...state,
    tasks: state.tasks.map(task => {
      if (task.id === action.payload.id) {
        const updatedTask = { ...task, ...action.payload.data };
        
        // Recalculate total score if any of the score components changed
        if (
          action.payload.data.consequenceScore !== undefined ||
          action.payload.data.prideScore !== undefined ||
          action.payload.data.constructionScore !== undefined
        ) {
          const consequenceScore = action.payload.data.consequenceScore ?? task.consequenceScore;
          const prideScore = action.payload.data.prideScore ?? task.prideScore;
          const constructionScore = action.payload.data.constructionScore ?? task.constructionScore;
          
          updatedTask.totalScore = consequenceScore + prideScore + constructionScore;
          
          // Update hidden status based on total score
          updatedTask.hidden = updatedTask.totalScore < 8;
        }
        
        return updatedTask;
      }
      return task;
    })
  };
};

export const updateTaskTitle = (state: AppState, action: Action): AppState => {
  if (action.type !== 'UPDATE_TASK_TITLE') return state;

  return {
    ...state,
    tasks: state.tasks.map(task =>
      task.id === action.payload.id ? { ...task, title: action.payload.title } : task
    )
  };
};

export const restoreTask = (state: AppState, action: Action): AppState => {
  if (action.type !== 'RESTORE_TASK') return state;

  return {
    ...state,
    tasks: state.tasks.map(task =>
      task.id === action.payload ? { 
        ...task, 
        completed: false, 
        completedAt: null,
        idealDate: new Date(), // Set today as the ideal date
        feedback: null // Clear the feedback
      } : task
    )
  };
};

export const setTaskFeedback = (state: AppState, action: Action): AppState => {
  if (action.type !== 'SET_TASK_FEEDBACK') return state;

  return {
    ...state,
    tasks: state.tasks.map(task =>
      task.id === action.payload.id ? { ...task, feedback: action.payload.feedback } : task
    )
  };
};

export const completeTaskByTitle = (state: AppState, action: Action): AppState => {
  if (action.type !== 'COMPLETE_TASK_BY_TITLE') return state;

  const now = new Date();
  
  return {
    ...state,
    tasks: state.tasks.map(task => 
      task.title === action.payload 
        ? { 
            ...task, 
            completed: true,
            // Garantir que sempre tenha uma data de conclusão válida para cada tarefa concluída
            completedAt: task.completedAt || now.toISOString(),
          } 
        : task
    )
  };
};

export const setTaskFeedbackByTitle = (state: AppState, action: Action): AppState => {
  if (action.type !== 'SET_TASK_FEEDBACK_BY_TITLE') return state;

  return {
    ...state,
    tasks: state.tasks.map(task => 
      task.title === action.payload.title
        ? { ...task, feedback: action.payload.feedback }
        : task
    )
  };
};
