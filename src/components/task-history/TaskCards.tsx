
import React from 'react';
import { Card } from '@/components/ui/card';
import { Task } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';

// Time period header component
const TimelineHeader: React.FC<{ title: string, invisible?: boolean }> = ({ title, invisible = false }) => (
  <div className="flex items-center space-x-4 mb-4">
    <h3 className="text-lg font-medium">{title}</h3>
    <Separator className="grow" invisible={invisible} /> {/* Use invisible prop here */}
  </div>
);

// Individual task card component
export const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  // Determine dominant pillar based on scores
  const getDominantPillar = () => {
    const scores = [
      { name: 'consequência', value: task.consequenceScore },
      { name: 'orgulho', value: task.prideScore },
      { name: 'construção', value: task.constructionScore },
    ];
    return scores.reduce((prev, current) => 
      (prev.value > current.value) ? prev : current
    ).name;
  };

  const dominantPillar = getDominantPillar();
  const feedbackLabels = {
    transformed: 'Foi transformador terminar',
    relief: 'Tive alívio ao finalizar',
    obligation: 'Terminei por obrigação'
  };

  // Format completion date, making sure completedAt exists
  const formattedDate = task.completedAt 
    ? format(new Date(task.completedAt), "d 'de' MMMM", { locale: ptBR }) 
    : '-';

  return (
    <Card className="p-4 h-full flex flex-col">
      <div className="line-through opacity-70 mb-2">{task.title}</div>
      <div className="text-sm text-muted-foreground mb-1">Concluído em {formattedDate}</div>
      <div className="text-sm mb-1">Pontuação: {task.totalScore}/15</div>
      <div className="text-sm mb-1 capitalize">Pilar: {dominantPillar}</div>
      <div className="text-sm text-muted-foreground mt-auto pt-2">
        {task.feedback ? feedbackLabels[task.feedback] : '-'}
      </div>
    </Card>
  );
};

// Group of task cards for a time period
export const TaskGroup: React.FC<{ 
  title: string; 
  tasks: Task[];
  invisible?: boolean;
}> = ({ title, tasks, invisible }) => (
  <div className="mb-8">
    <TimelineHeader title={title} invisible={invisible} />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  </div>
);

// Grid of task groups
export const TaskGroupGrid: React.FC<{ 
  groups: { title: string; tasks: Task[]; invisible?: boolean }[] 
}> = ({ groups }) => (
  <div>
    {groups.map((group, index) => (
      <TaskGroup 
        key={index} 
        title={group.title} 
        tasks={group.tasks} 
        invisible={group.invisible}
      />
    ))}
  </div>
);
