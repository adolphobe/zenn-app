
import React from 'react';
import { Task } from '@/types';
import TaskSummaryCard from './TaskSummaryCard';
import PillarsAnalysisCard from './PillarsAnalysisCard';
import FeedbackAnalysisCard from './FeedbackAnalysisCard';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface AnalysisContentProps {
  tasks: Task[];
}

const AnalysisContent: React.FC<AnalysisContentProps> = ({ tasks }) => {
  const hasCompletedTasks = tasks && tasks.length > 0;
  
  React.useEffect(() => {
    console.log("AnalysisContent: Recebeu tasks:", tasks?.length || 0);
    
    // Log básico de informações sobre as tarefas recebidas
    if (tasks && tasks.length > 0) {
      console.log("AnalysisContent: Há tarefas para análise");
    } else {
      console.log("AnalysisContent: Sem tarefas para análise");
    }
  }, [tasks]);
  
  if (!tasks) {
    return (
      <Alert>
        <AlertTitle>Carregando dados</AlertTitle>
        <AlertDescription>
          Aguarde enquanto carregamos seus dados de tarefas.
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
