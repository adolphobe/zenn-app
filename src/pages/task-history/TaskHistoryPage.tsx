
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/auth';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { logInfo, logError } from '@/utils/logUtils';
import { TaskHistoryContent } from './TaskHistoryContent';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const TaskHistoryPage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  // Use the TaskDataContext for completed tasks
  const { completedTasks, completedTasksLoading } = useTaskDataContext();
  const isLoading = completedTasksLoading || authLoading;
  
  // Check for URL duplication and log relevant info at mount
  useEffect(() => {
    const currentUrl = window.location.href;
    logInfo('TaskHistory', 'Componente montado', { 
      url: currentUrl,
      isAuthenticated, 
      authLoading,
      tasksLoaded: completedTasks.length 
    });
    
    // Verificar se temos uma URL com duplicação do path
    if (currentUrl.includes('/task-history#/task-history')) {
      logError('TaskHistory', 'URL com duplicação detectada', currentUrl);
    }
    
    // Validate any tasks with completedAt dates
    if (completedTasks.length > 0) {
      completedTasks.forEach(task => {
        if (task.completedAt) {
          const isValid = task.completedAt instanceof Date && 
            !isNaN(task.completedAt.getTime());
          
          if (!isValid) {
            logError('TaskHistory', `Task ${task.id} tem data de conclusão inválida`, task.completedAt);
          }
        }
      });
    }
    
    // Clean up function to help with debugging
    return () => {
      logInfo('TaskHistory', 'Componente desmontado');
    };
  }, [isAuthenticated, authLoading, completedTasks]);

  if (isLoading) {
    return (
      <div className="container p-4 mx-auto flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando histórico de tarefas...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container p-4 mx-auto">
        <Alert variant="destructive">
          <AlertTitle>Erro ao carregar tarefas</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="container p-4 mx-auto">
        <Alert>
          <AlertTitle>Você não está autenticado</AlertTitle>
          <AlertDescription>
            Faça login para ver o histórico de tarefas.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <TaskHistoryContent setError={setError} />;
};

export default TaskHistoryPage;
