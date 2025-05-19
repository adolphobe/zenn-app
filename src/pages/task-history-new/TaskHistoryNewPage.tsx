
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useCompletedTasksData } from './hooks/useCompletedTasksData';
import { TaskStats } from './components/TaskStats';
import { TaskTable } from './components/TaskTable';

/**
 * New Task History Page component that will gradually incorporate features from the existing one
 */
const TaskHistoryNewPage = () => {
  const { 
    tasks: completedTasks, 
    isLoading: completedTasksLoading,
    stats,
    selectedTaskId,
    setSelectedTaskId
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

  // Handle task selection
  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-2xl font-bold mb-6">Histórico de Tarefas (Novo)</h1>
      
      {/* Display task statistics */}
      <TaskStats 
        count={stats.count}
        highScoreCount={stats.highScoreCount}
        averageScore={stats.averageScore}
      />
      
      {/* Display tasks table */}
      <TaskTable 
        tasks={completedTasks} 
        onSelectTask={handleSelectTask}
      />
      
      {/* Add simple task info selection message */}
      {selectedTaskId && (
        <div className="mt-4 p-4 bg-muted rounded-md">
          <p className="text-sm">
            Tarefa selecionada: <span className="font-medium">{
              completedTasks.find(task => task.id === selectedTaskId)?.title
            }</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Na próxima fase, implementaremos uma visualização detalhada da tarefa.
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskHistoryNewPage;
