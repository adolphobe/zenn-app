
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { SAMPLE_TASKS } from '../constants';
import { TaskFormData, ViewMode, DateDisplayOptions, SortDirection } from '../types';
import { AppContextType, AppState, Action } from './types';
import { appReducer } from './appReducer';
import { initialState } from './initialState';
import { toast } from '../hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { addDaysToDate } from '../utils';

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize with sample tasks
  useEffect(() => {
    if (state.tasks.length === 0) {
      // Add original sample tasks
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
      
      // Add completed tasks for the past 7 days for demonstration
      const demoCompletedTasks = [
        // Day -7
        { title: "Concluir relatório mensal", consequenceScore: 4, prideScore: 3, constructionScore: 2, daysAgo: 7, feedback: 'obligation' },
        { title: "Organizar planejamento Q3", consequenceScore: 5, prideScore: 5, constructionScore: 5, daysAgo: 7, feedback: 'transformed' },
        
        // Day -6
        { title: "Enviar proposta cliente A", consequenceScore: 5, prideScore: 4, constructionScore: 4, daysAgo: 6, feedback: 'transformed' },
        { title: "Revisar documentação técnica", consequenceScore: 2, prideScore: 2, constructionScore: 4, daysAgo: 6, feedback: 'relief' },
        { title: "Validar pendências fiscais", consequenceScore: 4, prideScore: 1, constructionScore: 1, daysAgo: 6, feedback: 'obligation' },
        
        // Day -5 
        { title: "Preparar apresentação executiva", consequenceScore: 5, prideScore: 5, constructionScore: 4, daysAgo: 5, feedback: 'transformed' },
        { title: "Limpar inbox de emails", consequenceScore: 3, prideScore: 2, constructionScore: 1, daysAgo: 5, feedback: 'relief' },
        
        // Day -4
        { title: "Publicar artigo técnico", consequenceScore: 3, prideScore: 5, constructionScore: 4, daysAgo: 4, feedback: 'transformed' },
        { title: "Refatorar código do módulo X", consequenceScore: 2, prideScore: 4, constructionScore: 5, daysAgo: 4, feedback: 'transformed' },
        
        // Day -3
        { title: "Finalizar análise de mercado", consequenceScore: 5, prideScore: 3, constructionScore: 3, daysAgo: 3, feedback: 'relief' },
        { title: "Revisar orçamento trimestral", consequenceScore: 5, prideScore: 2, constructionScore: 2, daysAgo: 3, feedback: 'obligation' },
        { title: "Atualizar pipeline de vendas", consequenceScore: 4, prideScore: 3, constructionScore: 2, daysAgo: 3, feedback: 'obligation' },
        
        // Day -2
        { title: "Conduzir reunião de alinhamento", consequenceScore: 4, prideScore: 4, constructionScore: 3, daysAgo: 2, feedback: 'relief' },
        { title: "Implementar feature principal", consequenceScore: 3, prideScore: 5, constructionScore: 5, daysAgo: 2, feedback: 'transformed' },
        { title: "Resolver problemas do cliente B", consequenceScore: 5, prideScore: 3, constructionScore: 2, daysAgo: 2, feedback: 'relief' },
        
        // Day -1
        { title: "Finalizar apresentação de vendas", consequenceScore: 4, prideScore: 5, constructionScore: 4, daysAgo: 1, feedback: 'transformed' },
        { title: "Revisar métricas de desempenho", consequenceScore: 3, prideScore: 3, constructionScore: 4, daysAgo: 1, feedback: 'relief' },
        
        // Today
        { title: "Preparar roadmap trimestral", consequenceScore: 5, prideScore: 5, constructionScore: 5, daysAgo: 0, feedback: 'transformed' },
        { title: "Responder solicitações pendentes", consequenceScore: 3, prideScore: 2, constructionScore: 1, daysAgo: 0, feedback: 'obligation' },
        { title: "Fechar planilha de custos", consequenceScore: 4, prideScore: 3, constructionScore: 2, daysAgo: 0, feedback: 'relief' }
      ];
      
      demoCompletedTasks.forEach(task => {
        const today = new Date();
        const taskDate = addDaysToDate(today, -task.daysAgo);
        
        // First add the task
        dispatch({
          type: 'ADD_TASK',
          payload: {
            title: task.title,
            consequenceScore: task.consequenceScore,
            prideScore: task.prideScore,
            constructionScore: task.constructionScore,
            idealDate: taskDate
          }
        });
        
        // Get the latest task (the one we just added)
        const newTaskId = state.tasks.length > 0 ? state.tasks[state.tasks.length - 1].id : null;
        if (newTaskId) {
          // Mark it as completed
          dispatch({
            type: 'TOGGLE_TASK_COMPLETED',
            payload: newTaskId
          });
          
          // Add feedback
          dispatch({
            type: 'SET_TASK_FEEDBACK',
            payload: {
              id: newTaskId,
              feedback: task.feedback as 'transformed' | 'relief' | 'obligation'
            }
          });
        }
      });
      
      // Add some hidden tasks with various scores
      const hiddenTasks = [
        { title: "Tarefa oculta 1", consequenceScore: 2, prideScore: 2, constructionScore: 3 },
        { title: "Tarefa oculta 2", consequenceScore: 1, prideScore: 3, constructionScore: 3 },
        { title: "Tarefa oculta 3", consequenceScore: 3, prideScore: 2, constructionScore: 2 },
        { title: "Tarefa oculta 4", consequenceScore: 2, prideScore: 1, constructionScore: 1 },
        { title: "Tarefa oculta 5", consequenceScore: 1, prideScore: 2, constructionScore: 2 }
      ];
      
      hiddenTasks.forEach(task => {
        const taskData = {
          ...task,
          idealDate: addDaysToDate(new Date(), Math.floor(Math.random() * 14) + 1) // Random date in next 14 days
        };
        
        dispatch({
          type: 'ADD_TASK',
          payload: taskData
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
    toast({
      id: uuidv4(), // Add the ID here
      title: "Tarefa adicionada",
      description: `"${task.title}" foi adicionada com sucesso.`
    });
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
  
  const setTaskFeedback = (id: string, feedback: 'transformed' | 'relief' | 'obligation') => {
    dispatch({ type: 'SET_TASK_FEEDBACK', payload: { id, feedback } });
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
        setSortOptions,
        setTaskFeedback
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
