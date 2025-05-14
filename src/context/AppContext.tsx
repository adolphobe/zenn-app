import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppState, Task, TaskFormData, ViewMode, DateDisplayOptions, SortDirection, SortOption } from '../types';
import { SAMPLE_TASKS } from '../constants';

// Actions
type Action =
  | { type: 'ADD_TASK'; payload: TaskFormData }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK_COMPLETED'; payload: string }
  | { type: 'TOGGLE_TASK_HIDDEN'; payload: string }
  | { type: 'UPDATE_TASK'; payload: { id: string; data: Partial<TaskFormData> } }
  | { type: 'UPDATE_TASK_TITLE'; payload: { id: string; title: string } }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'TOGGLE_SHOW_HIDDEN_TASKS' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'UPDATE_DATE_DISPLAY_OPTIONS'; payload: DateDisplayOptions }
  | { type: 'SET_SORT_OPTIONS'; payload: { sortDirection: SortDirection; noDateAtEnd?: boolean } };

// Context interface
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addTask: (task: TaskFormData) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompleted: (id: string) => void;
  toggleTaskHidden: (id: string) => void;
  updateTask: (id: string, data: Partial<TaskFormData>) => void;
  updateTaskTitle: (id: string, title: string) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleShowHiddenTasks: () => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  updateDateDisplayOptions: (options: DateDisplayOptions) => void;
  setSortOptions: (options: { sortDirection: SortDirection; noDateAtEnd?: boolean }) => void;
}

// Initial state
const initialState: AppState = {
  tasks: [],
  viewMode: 'power',
  showHiddenTasks: false,
  darkMode: false,
  sidebarOpen: true,
  dateDisplayOptions: {
    hideYear: false,
    hideTime: false,
    hideDate: false
  },
  sortOptions: {
    power: {
      sortDirection: 'desc',
    },
    chronological: {
      sortDirection: 'asc',
      noDateAtEnd: true
    }
  }
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Reducer
const appReducer = (state: AppState, action: Action): AppState => {
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
        createdAt: new Date()
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

    default:
      return state;
  }
};

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize with sample tasks
  useEffect(() => {
    if (state.tasks.length === 0) {
      SAMPLE_TASKS.forEach(task => {
        dispatch({
          type: 'ADD_TASK',
          payload: {
            title: task.title,
            consequenceScore: task.consequenceScore,
            prideScore: task.prideScore,
            constructionScore: task.constructionScore,
            idealDate: task.idealDate || undefined
          }
        });
      });
    }
  }, []);

  // Handle dark mode
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // Actions
  const addTask = (task: TaskFormData) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const toggleTaskCompleted = (id: string) => {
    dispatch({ type: 'TOGGLE_TASK_COMPLETED', payload: id });
  };

  const toggleTaskHidden = (id: string) => {
    dispatch({ type: 'TOGGLE_TASK_HIDDEN', payload: id });
  };

  const updateTask = (id: string, data: Partial<TaskFormData>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, data } });
  };

  const updateTaskTitle = (id: string, title: string) => {
    dispatch({ type: 'UPDATE_TASK_TITLE', payload: { id, title } });
  };

  const setViewMode = (mode: ViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  };

  const toggleShowHiddenTasks = () => {
    dispatch({ type: 'TOGGLE_SHOW_HIDDEN_TASKS' });
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const updateDateDisplayOptions = (options: DateDisplayOptions) => {
    dispatch({ type: 'UPDATE_DATE_DISPLAY_OPTIONS', payload: options });
  };

  const setSortOptions = (options: { sortDirection: SortDirection; noDateAtEnd?: boolean }) => {
    dispatch({ type: 'SET_SORT_OPTIONS', payload: options });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        addTask,
        deleteTask,
        toggleTaskCompleted,
        toggleTaskHidden,
        updateTask,
        updateTaskTitle,
        setViewMode,
        toggleShowHiddenTasks,
        toggleDarkMode,
        toggleSidebar,
        updateDateDisplayOptions,
        setSortOptions
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
