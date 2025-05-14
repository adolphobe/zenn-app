
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types';
import { AppState, Action } from './types';

// Reducer
export const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_TASK': {
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
        feedback: null
      };
      return { ...state, tasks: [...state.tasks, newTask] };
    }

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };

    case 'TOGGLE_TASK_COMPLETED':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        )
      };

    case 'TOGGLE_TASK_HIDDEN':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, hidden: !task.hidden } : task
        )
      };

    case 'UPDATE_TASK': {
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
    }

    case 'UPDATE_TASK_TITLE':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, title: action.payload.title } : task
        )
      };

    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };

    case 'TOGGLE_SHOW_HIDDEN_TASKS':
      return { ...state, showHiddenTasks: !state.showHiddenTasks };

    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case 'UPDATE_DATE_DISPLAY_OPTIONS':
      return { ...state, dateDisplayOptions: action.payload };

    case 'SET_SORT_OPTIONS': {
      const { sortDirection, noDateAtEnd } = action.payload;
      const viewMode = state.viewMode;
      
      return {
        ...state,
        sortOptions: {
          ...state.sortOptions,
          [viewMode]: {
            ...state.sortOptions[viewMode],
            sortDirection,
            ...(viewMode === 'chronological' && noDateAtEnd !== undefined ? { noDateAtEnd } : {})
          }
        }
      };
    }
    
    case 'SET_TASK_FEEDBACK': {
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, feedback: action.payload.feedback } : task
        )
      };
    }

    default:
      return state;
  }
};
