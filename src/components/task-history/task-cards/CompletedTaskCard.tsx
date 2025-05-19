
import React, { useState, useMemo, useCallback } from 'react';
import { Task } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Eye } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useExpandedTask } from '@/context/hooks';
import TaskPillarDetails from '@/components/TaskPillarDetails';
import TaskComments from '@/components/TaskComments';
import RestoreTaskConfirmation from '../RestoreTaskConfirmation';
import CompletedTaskModal from '../completed-task-modal';
import DateTimeDisplay from '@/components/DateTimeDisplay';
import { dateService } from '@/services/dateService';
import { logDateInfo } from '@/utils/diagnosticLog';
import { logError } from '@/utils/logUtils';
import { useQueryClient } from '@tanstack/react-query';

interface CompletedTaskCardProps {
  task: Task;
}

export const CompletedTaskCard: React.FC<CompletedTaskCardProps> = ({ task }) => {
  const { expandedTaskId, toggleTaskExpanded, isTaskExpanded } = useExpandedTask();
  const expanded = isTaskExpanded(task.id);
  const [showRestoreConfirmation, setShowRestoreConfirmation] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Validate and format the completion date
  const completionDate = useMemo(() => {
    try {
      // If no completedAt, default to current date for completed tasks
      if (!task.completedAt && task.completed) {
        return new Date();
      }
      
      // Parse the completedAt date
      const parsedDate = task.completedAt instanceof Date ? 
        task.completedAt : 
        dateService.parseDate(task.completedAt);
      
      // Check if date is valid
      if (!parsedDate || isNaN(parsedDate.getTime())) {
        setDateError(`Data inválida para tarefa ${task.id}`);
        return new Date(); // Fallback to current date
      }
      
      return parsedDate;
    } catch (error) {
      const errorMsg = `Erro ao processar data de conclusão: ${
        error instanceof Error ? error.message : String(error)
      }`;
      setDateError(errorMsg);
      logError('CompletedTaskCard', errorMsg, { taskId: task.id });
      return new Date(); // Fallback to current date
    }
  }, [task.completedAt, task.completed, task.id]);
  
  // Updated to match TaskScoreDisplay colors
  const getScoreColor = (score: number) => {
    if (score >= 14) return 'text-red-600';
    if (score >= 11) return 'text-orange-500';
    if (score >= 8) return 'text-blue-600';
    return 'text-slate-500';
  };

  const feedbackColors = {
    transformed: 'bg-[#deffe0] text-[#3d8c40] border-[#a8d9aa]',
    relief: 'bg-[#e2f2ff] text-[#2970a8] border-[#a3d0f0]',
    obligation: 'bg-[#f1f1f1] text-[#6e6e6e] border-[#d0d0d0]',
  };

  // Consistent feedback mapping across the application
  const feedbackLabels = {
    transformed: 'Foi transformador terminar',
    relief: 'Tive alívio ao finalizar',
    obligation: 'Terminei por obrigação'
  };

  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowRestoreConfirmation(true);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTaskModal(true);
  };

  // Prevent expanded content from collapsing card on click
  const handleExpandedContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // Handle comment deletion in the card
  const handleCommentDeleted = useCallback(() => {
    console.log('[CompletedTaskCard] Comment deleted, refreshing task data');
    
    // Refresh task data across the application
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['task', task.id] });
    queryClient.invalidateQueries({ queryKey: ['completedTasks'] });
  }, [queryClient, task.id]);

  const scoreColor = getScoreColor(task.totalScore);

  return (
    <>
      <Card 
        className="mb-3 border-l-4 border-l-green-500"
        onClick={() => toggleTaskExpanded(task.id)}
      >
        <CardContent className="pt-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 opacity-70">{task.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Concluída em {dateError ? (
                  <span title={dateError} className="text-orange-500">
                    (data indisponível)
                  </span>
                ) : task.idealDate ? (
                  <DateTimeDisplay 
                    date={completionDate} 
                    showRelative={false} 
                    fallback="(data não disponível)"
                  />
                ) : (
                  <span className="text-gray-400">SEM PRAZO</span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              {task.feedback && (
                <Badge className={feedbackColors[task.feedback] || 'bg-gray-100 text-gray-800'} variant="outline">
                  {feedbackLabels[task.feedback] || '-'}
                </Badge>
              )}
              <Badge variant="outline" className={`bg-gray-100 ${scoreColor}`}>
                {task.totalScore}/15
              </Badge>
            </div>
          </div>

          {expanded && (
            <div className="mt-4 animate-fade-in" onClick={handleExpandedContentClick}>
              <TaskPillarDetails task={task} />
              
              {/* Display comments if they exist */}
              {task.comments && task.comments.length > 0 && (
                <div className="mt-4">
                  <TaskComments 
                    taskId={task.id} 
                    comments={task.comments} 
                    onCommentDeleted={handleCommentDeleted}
                  />
                </div>
              )}
              
              <div className="mt-4 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleView}
                >
                  <Eye size={16} />
                  Visualizar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleRestore}
                >
                  <RefreshCw size={16} />
                  Restaurar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showTaskModal && (
        <CompletedTaskModal 
          task={task} 
          isOpen={showTaskModal} 
          onClose={() => setShowTaskModal(false)} 
        />
      )}

      {showRestoreConfirmation && (
        <RestoreTaskConfirmation
          task={task}
          isOpen={showRestoreConfirmation}
          onClose={() => setShowRestoreConfirmation(false)}
        />
      )}
    </>
  );
};

export default CompletedTaskCard;
