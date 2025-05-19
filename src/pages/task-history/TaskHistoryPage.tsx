
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/auth';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { logInfo } from '@/utils/logUtils';
import { TaskHistoryContent } from './TaskHistoryContent';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

// Componente otimizado para reduzir re-renderizações
const TaskHistoryPage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { completedTasks, completedTasksLoading } = useTaskDataContext();
  
  // Memoiza o estado de carregamento para evitar re-renderizações
  const isLoading = useMemo(
    () => completedTasksLoading || authLoading,
    [completedTasksLoading, authLoading]
  );

  // Log de diagnóstico - apenas uma vez na montagem e com debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const currentUrl = window.location.href;
      
      // Detecta problemas de URL que podem causar loops
      const hasURLDuplication = currentUrl.includes('/task-history#/task-history');
      const hasNestedPath = currentUrl.includes('/dashboard/task-history');
      
      logInfo('TaskHistory', `Componente montado com ${completedTasks.length} tarefas`, { 
        url: currentUrl,
        isAuthenticated,
        hasURLDuplication,
        hasNestedPath
      });
      
      // Auto-correção de URLs problemáticas
      if (hasURLDuplication || hasNestedPath) {
        // Substitui a URL sem recarregar a página
        window.history.replaceState({}, document.title, '/task-history');
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Renderização condicional baseada no estado
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

  // Usuário autenticado e sem erros - renderiza o conteúdo
  return <TaskHistoryContent setError={setError} />;
};

export default TaskHistoryPage;
