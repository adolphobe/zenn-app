
import React from 'react';
import { Task } from '@/types';
import TaskSummaryCard from './TaskSummaryCard';
import PillarsAnalysisCard from './PillarsAnalysisCard';
import FeedbackAnalysisCard from './FeedbackAnalysisCard';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { logDiagnostics } from '@/utils/diagnosticLog';

interface AnalysisContentProps {
  tasks: Task[];
  isLoading?: boolean;
}

const AnalysisContent: React.FC<AnalysisContentProps> = ({ tasks, isLoading = false }) => {
  const hasCompletedTasks = tasks && tasks.length > 0;
  
  // Log for diagnosis but with less verbosity
  React.useEffect(() => {
    logDiagnostics('AnalysisContent', `Rendering with ${tasks?.length || 0} tasks, loading: ${isLoading}`);
    
    // Add high-level task information for debugging
    if (tasks?.length) {
      const tasksInfo = tasks.map(t => ({
        id: t.id,
        title: t.title,
        completed: t.completed,
        hasCompletedAt: !!t.completedAt,
        feedback: t.feedback,
      }));
      
      logDiagnostics('AnalysisContent', 'Tasks summary:', tasksInfo);
    }
  }, [tasks, isLoading]);
  
  if (isLoading) {
    return (
      <Alert>
        <AlertTitle>Carregando dados</AlertTitle>
        <AlertDescription>
          Aguarde enquanto carregamos seus dados de tarefas.
        </AlertDescription>
      </Alert>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Nenhuma tarefa concluída encontrada</AlertTitle>
        <AlertDescription>
          Não foram encontradas tarefas concluídas no período selecionado.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <TaskSummaryCard tasks={tasks} />
      
      {/* Only show analysis cards if there are tasks */}
      {hasCompletedTasks && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Making each card have the same height with matching flex */}
          <div className="flex">
            <FeedbackAnalysisCard tasks={tasks} />
          </div>
          
          {/* Right column */}
          <div className="flex">
            <PillarsAnalysisCard tasks={tasks} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisContent;
