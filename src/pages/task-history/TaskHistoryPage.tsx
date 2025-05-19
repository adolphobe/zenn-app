
import React, { useState } from 'react';
import { useAuth } from '@/context/auth';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import TaskSummaryCard from '@/components/strategic-review/TaskSummaryCard';
import PillarsAnalysisCard from '@/components/strategic-review/PillarsAnalysisCard';
import FeedbackAnalysisCard from '@/components/strategic-review/FeedbackAnalysisCard';
import { TaskHistoryContent } from './TaskHistoryContent';

/**
 * TaskHistoryPage component that displays completed tasks with analysis
 */
const TaskHistoryPage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { completedTasks, completedTasksLoading } = useTaskDataContext();
  const [error, setError] = useState<string | null>(null);
  
  const isLoading = completedTasksLoading || authLoading;

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

  // If there's an error, show it
  if (error) {
    return (
      <div className="container p-4 mx-auto">
        <Alert variant="destructive">
          <AlertTitle>Erro ao carregar o histórico</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If there are no tasks, show simplified content
  if (!completedTasks || completedTasks.length === 0) {
    return (
      <div className="container p-4 mx-auto">
        <h1 className="text-2xl font-bold mb-4">Histórico de Tarefas</h1>
        <Alert>
          <AlertTitle>Nenhuma tarefa concluída</AlertTitle>
          <AlertDescription>
            Quando você concluir tarefas, elas aparecerão aqui.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If we have tasks, show the full content with analysis
  return (
    <div className="container p-4 mx-auto flex flex-col space-y-8">
      <h1 className="text-2xl font-bold">Histórico de Tarefas</h1>
      
      {/* Task Analysis Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <TaskSummaryCard tasks={completedTasks} />
        </div>
        <div className="col-span-1">
          <FeedbackAnalysisCard tasks={completedTasks} />
        </div>
        <div className="col-span-1">
          <PillarsAnalysisCard tasks={completedTasks} />
        </div>
      </div>
      
      {/* Task History Content with advanced features */}
      <TaskHistoryContent setError={setError} />
    </div>
  );
};

export default TaskHistoryPage;
