
import React from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Task } from '@/types'; 
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useExpandedTask } from '@/context/hooks';
import TaskPillarDetails from '@/components/TaskPillarDetails';
import TaskComments from '@/components/TaskComments';

interface TaskGroup {
  label: string;
  tasks: Task[];
}

// Task card component
export const CompletedTaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const { restoreTask } = useAppContext();
  const { expandedTaskId, toggleTaskExpanded, isTaskExpanded } = useExpandedTask();
  const expanded = isTaskExpanded(task.id);

  // Determine dominant pillar based on scores
  const getDominantPillar = () => {
    const scores = [
      { name: 'risco', value: task.consequenceScore },
      { name: 'orgulho', value: task.prideScore },
      { name: 'crescimento', value: task.constructionScore },
    ];
    const max = scores.reduce((prev, current) => 
      (prev.value > current.value) ? prev : current
    );
    return max.name;
  };

  // Determine border color based on task score
  const getBorderColor = () => {
    if (task.totalScore >= 12) { // Critical
      return 'border-l-red-300';
    } else if (task.totalScore >= 9) { // Important
      return 'border-l-orange-300';
    } else if (task.totalScore >= 6) { // Moderate
      return 'border-l-blue-300';
    } else {
      return 'border-l-gray-300'; // Default
    }
  };

  const dominantPillar = getDominantPillar();
  const pillarColors = {
    risco: 'bg-orange-100 text-orange-800 border-orange-200',
    orgulho: 'bg-purple-100 text-purple-800 border-purple-200',
    crescimento: 'bg-blue-100 text-blue-800 border-blue-200',
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

  // Format the completion date and time in Brazilian format (DD/MM/YYYY HH:MM)
  const formatCompletionDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    try {
      const date = parseISO(dateString);
      console.log(`[TaskCards] Formatting date for "${task.title}": ${dateString} -> parsed as ${date}`);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch (e) {
      console.error("Error formatting date:", e);
      console.error("Invalid date string:", dateString);
      return '-';
    }
  };

  const completedDateTime = formatCompletionDateTime(task.completedAt);

  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (restoreTask) {
      restoreTask(task.id);
    }
  };

  // Prevent expanded content from collapsing card on click
  const handleExpandedContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card 
      className={`mb-3 border-l-4 ${getBorderColor()}`}
      onClick={() => toggleTaskExpanded(task.id)}
    >
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 opacity-70">{task.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Concluída em {completedDateTime}
            </p>
          </div>
          <div className="flex gap-2">
            {task.feedback && (
              <Badge className={feedbackColors[task.feedback] || 'bg-gray-100 text-gray-800'} variant="outline">
                {feedbackLabels[task.feedback] || '-'}
              </Badge>
            )}
            <Badge
              className={`${pillarColors[dominantPillar] || 'bg-gray-100 text-gray-800'} hidden`}
              variant="outline"
            >
              {dominantPillar}
            </Badge>
            <Badge variant="outline" className="bg-gray-100 text-gray-800">
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
                <TaskComments taskId={task.id} comments={task.comments} />
              </div>
            )}
            
            <div className="mt-4 flex justify-end">
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
  );
};

export const TaskGroupGrid: React.FC<{ groups: TaskGroup[] }> = ({ groups }) => (
  <div className="space-y-6">
    {groups.map((group, index) => (
      <div key={index}>
        {group.label && (
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-medium">{group.label}</h3>
            <Badge variant="outline">{group.tasks.length}</Badge>
          </div>
        )}
        <div className="grid grid-cols-1">
          {group.tasks.map(task => (
            <CompletedTaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    ))}
  </div>
);
