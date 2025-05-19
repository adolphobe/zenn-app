
import React from 'react';
import { Task } from '@/types';
import TaskSummaryCard from './TaskSummaryCard';
import PillarsAnalysisCard from './PillarsAnalysisCard';
import FeedbackAnalysisCard from './FeedbackAnalysisCard';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CalendarClock } from 'lucide-react';

interface AnalysisContentProps {
  tasks: Task[];
  isLoading?: boolean;
}

const AnalysisContent: React.FC<AnalysisContentProps> = ({ tasks, isLoading = false }) => {
  const hasCompletedTasks = tasks && tasks.length > 0;
  
  React.useEffect(() => {
    console.log("AnalysisContent: Recebeu tasks:", tasks?.length || 0);
    console.log("AnalysisContent: Estado de carregamento:", isLoading ? "Carregando" : "Completo");
    
    // Log básico de informações sobre as tarefas recebidas
    if (tasks && tasks.length > 0) {
      console.log("AnalysisContent: Há tarefas para análise");
      tasks.slice(0, 2).forEach((task, idx) => {
        console.log(`AnalysisContent: Tarefa #${idx+1}:`, {
          id: task.id,
          title: task.title,
          completedAt: task.completedAt,
          pillar: task.pillar,
          scores: {
            consequenceScore: task.consequenceScore,
            prideScore: task.prideScore,
            constructionScore: task.constructionScore
          },
          feedback: task.feedback
        });
      });
    } else {
      console.log("AnalysisContent: Sem tarefas para análise");
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
        <AlertDescription className="space-y-3">
          <p>
            Não foram encontradas tarefas concluídas no período selecionado.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button 
              variant="outline" 
              onClick={() => {
                // Find the "Todo o Tempo" tab and click it
                const allTimeTab = document.querySelector('[value="all-time"]');
                if (allTimeTab && allTimeTab instanceof HTMLElement) {
                  allTimeTab.click();
                }
              }}
              size="sm"
              className="mt-2"
            >
              <CalendarClock className="mr-2 h-4 w-4" />
              Ver todas as tarefas concluídas
            </Button>
          </div>
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
