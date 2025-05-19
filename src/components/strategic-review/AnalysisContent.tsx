
import React from 'react';
import { Task } from '@/types';
import TaskSummaryCard from './TaskSummaryCard';
import PillarsAnalysisCard from './PillarsAnalysisCard';
import FeedbackAnalysisCard from './FeedbackAnalysisCard';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface AnalysisContentProps {
  tasks: Task[];
  isLoading?: boolean;
}

const AnalysisContent: React.FC<AnalysisContentProps> = ({ tasks, isLoading = false }) => {
  const hasCompletedTasks = tasks && tasks.length > 0;
  
  // Simplified useEffect with less verbose logging
  React.useEffect(() => {
    if (tasks?.length) {
      console.log(`AnalysisContent: Processando ${tasks.length} tarefas`);
    }
  }, [tasks]);
  
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
