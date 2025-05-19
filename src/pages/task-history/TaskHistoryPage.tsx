
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/auth';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { logInfo } from '@/utils/logUtils';
import { TaskHistoryContent } from './TaskHistoryContent';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const TaskHistoryPage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  // Use the TaskDataContext for completed tasks
  const { completedTasks, completedTasksLoading } = useTaskDataContext();
  const isLoading = completedTasksLoading || authLoading;
  
  // Log page load only once to reduce console noise
  useEffect(() => {
    logInfo('TaskHistory', 'Página de histórico de tarefas carregada', {
      autenticado: isAuthenticated,
      carregando: isLoading,
      tarefas: completedTasks.length
    });
  }, []);

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
