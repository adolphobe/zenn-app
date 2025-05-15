
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Task } from '@/types'; 
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RefreshCw } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface TaskGroup {
  label: string;
  tasks: Task[];
}

// Task card component
export const CompletedTaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const [expanded, setExpanded] = useState(false);
  const { restoreTask } = useAppContext();

  // Determine dominant pillar based on scores
  const getDominantPillar = () => {
    const scores = [
      { name: 'consequência', value: task.consequenceScore },
      { name: 'orgulho', value: task.prideScore },
      { name: 'construção', value: task.constructionScore },
    ];
    const max = scores.reduce((prev, current) => 
      (prev.value > current.value) ? prev : current
    );
    return max.name;
  };

  const dominantPillar = getDominantPillar();
  const pillarColors = {
    consequência: 'bg-orange-100 text-orange-800 border-orange-200',
    orgulho: 'bg-purple-100 text-purple-800 border-purple-200',
    construção: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const feedbackColors = {
    transformed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    relief: 'bg-blue-100 text-blue-800 border-blue-200',
    obligation: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  const feedbackLabels = {
    transformed: 'Foi transformador terminar',
    relief: 'Tive alívio ao finalizar',
    obligation: 'Terminei por obrigação'
  };

  // Make sure we have a completedAt value before trying to format it
  const completedDate = task.completedAt ? format(new Date(task.completedAt), 'dd/MM/yyyy') : '-';

  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (restoreTask) {
      restoreTask(task.id);
    }
  };

  return (
    <Card className="mb-3 border-l-4 border-l-gray-300" onClick={() => setExpanded(!expanded)}>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 line-through opacity-70">{task.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Concluída em {completedDate}
            </p>
          </div>
          <div className="flex gap-2">
            {task.feedback && (
              <Badge className={feedbackColors[task.feedback] || 'bg-gray-100 text-gray-800'} variant="outline">
                {feedbackLabels[task.feedback] || '-'}
              </Badge>
            )}
            <Badge hidden className={pillarColors[dominantPillar] || 'bg-gray-100 text-gray-800'} variant="outline">
              {dominantPillar}
            </Badge>
            <Badge variant="outline" className="bg-gray-100 text-gray-800">
              {task.totalScore}/15
            </Badge>
          </div>
        </div>

        {expanded && (
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
        )}
      </CardContent>
    </Card>
  );
};

export const TaskGroupGrid: React.FC<{ groups: TaskGroup[] }> = ({ groups }) => (
  <div className="space-y-6">
    {groups.map((group, index) => (
      <div key={index}>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-medium">{group.label}</h3>
          <Badge variant="outline">{group.tasks.length}</Badge>
          <Separator className="flex-grow" />
        </div>
        <div className="grid grid-cols-1">
          {group.tasks.map(task => (
            <CompletedTaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    ))}
  </div>
);
