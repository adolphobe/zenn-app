
import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useTaskData } from '@/hooks/useTaskData';
import { Task, TaskFormData } from '@/types';
import { dateService } from '@/services/dateService';
import { logInfo } from '@/utils/logUtils';

// Define o tipo do contexto
type TaskDataContextType = ReturnType<typeof useTaskData> & {
  completedTasks: Task[];
  completedTasksLoading: boolean;
};

// Cria o contexto
const TaskDataContext = createContext<TaskDataContextType | undefined>(undefined);

// Provider component com otimizações para evitar re-renderizações
export const TaskDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Usa o hook para gerenciar tarefas ativas
  const activeTasksData = useTaskData(false);
  
  // Usa uma instância separada para gerenciar tarefas concluídas
  const completedTasksData = useTaskData(true);
  
  // Função otimizada para processar uma única tarefa - evita recalcular em cada renderização
  const processCompletedTask = useCallback((task: Task): Task => {
    try {
      // Cache local para evitar processamento redundante de datas
      const processedTask = { ...task };
      
      // Processa apenas datas se precisar
      // Fast path: se já for uma Data válida, reuse-a
      if (!(task.completedAt instanceof Date) || isNaN(task.completedAt.getTime())) {
        if (task.completedAt) {
          processedTask.completedAt = dateService.parseDate(task.completedAt) || new Date();
        } else if (task.completed) {
          processedTask.completedAt = new Date();
        } else {
          processedTask.completedAt = null;
        }
      }
      
      // Otimiza processamento de outras datas também
      if (!(task.createdAt instanceof Date) || isNaN(task.createdAt.getTime())) {
        processedTask.createdAt = task.createdAt ? 
          dateService.parseDate(task.createdAt) || new Date() : 
          new Date();
      }
      
      // Garante que idealDate seja validado mas mantenha a estrutura de tipo original
      if (task.idealDate && (!(task.idealDate instanceof Date) || isNaN(task.idealDate.getTime()))) {
        processedTask.idealDate = dateService.parseDate(task.idealDate);
      }
      
      return processedTask;
    } catch (error) {
      // Em caso de erro, retorna objeto com valores de fallback
      console.error('Erro ao processar tarefa', error);
      return {
        ...task,
        completedAt: task.completed ? new Date() : null,
        idealDate: null,
        createdAt: new Date()
      };
    }
  }, []);
  
  // Processa tarefas concluídas - otimizado com useMemo e cache
  const processedCompletedTasks = useMemo(() => {
    const tasks = completedTasksData.tasks || [];
    
    if (tasks.length === 0) {
      return [];
    }
    
    return tasks.map(processCompletedTask);
  }, [completedTasksData.tasks, processCompletedTask]);
  
  // Logs apenas em desenvolvimento e apenas quando realmente muda
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development' && processedCompletedTasks.length > 0) {
      logInfo('TaskDataProvider', `${processedCompletedTasks.length} tarefas concluídas processadas`);
    }
  }, [processedCompletedTasks.length]);

  // Cria valor do contexto com tarefas ativas e concluídas
  const contextValue: TaskDataContextType = useMemo(() => ({
    ...activeTasksData,
    completedTasks: processedCompletedTasks,
    completedTasksLoading: completedTasksData.isLoading,
  }), [activeTasksData, processedCompletedTasks, completedTasksData.isLoading]);

  return (
    <TaskDataContext.Provider value={contextValue}>
      {children}
    </TaskDataContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useTaskDataContext = (): TaskDataContextType => {
  const context = useContext(TaskDataContext);
  if (context === undefined) {
    throw new Error('useTaskDataContext deve ser usado dentro de um TaskDataProvider');
  }
  return context;
};
