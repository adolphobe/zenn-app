
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useCompletedTasksData } from './hooks/useCompletedTasksData';
import { TaskStats } from './components/TaskStats';

/**
 * New Task History Page component that will gradually incorporate features from the existing one
 */
const TaskHistoryNewPage = () => {
  const { 
    tasks: completedTasks, 
    isLoading: completedTasksLoading,
    stats
  } = useCompletedTasksData();
  
  // Loading state
  if (completedTasksLoading) {
    return (
      <div className="container p-4 mx-auto flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando histórico de tarefas...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!completedTasks || completedTasks.length === 0) {
    return (
      <div className="container p-4 mx-auto">
        <h1 className="text-2xl font-bold mb-4">Histórico de Tarefas (Novo)</h1>
        <Alert>
          <AlertTitle>Nenhuma tarefa concluída</AlertTitle>
          <AlertDescription>
            Quando você concluir tarefas, elas aparecerão aqui.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Basic content with task stats
  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-2xl font-bold mb-6">Histórico de Tarefas (Novo)</h1>
      
      {/* Display task statistics */}
      <TaskStats 
        count={stats.count}
        highScoreCount={stats.highScoreCount}
        averageScore={stats.averageScore}
      />
      
      {/* Placeholder for future task list/grid */}
      <div className="bg-muted p-8 rounded-lg text-center">
        <p className="text-muted-foreground">
          Lista de tarefas será implementada nas próximas fases
        </p>
      </div>
    </div>
  );
};

export default TaskHistoryNewPage;
