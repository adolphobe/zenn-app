
import React from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface TaskGridProps {
  tasks: Task[];
  onSelectTask: (taskId: string) => void;
}

export const TaskGrid: React.FC<TaskGridProps> = ({ tasks, onSelectTask }) => {
  if (!tasks.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma tarefa encontrada para os filtros atuais.</p>
      </div>
    );
  }

  const getFeedbackColor = (feedback: string | undefined) => {
    switch (feedback) {
      case 'transformed': return 'bg-green-500 hover:bg-green-600';
      case 'relief': return 'bg-blue-500 hover:bg-blue-600';
      case 'obligation': return 'bg-orange-500 hover:bg-orange-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <Card 
          key={task.id} 
          className="hover:border-primary cursor-pointer transition-colors"
          onClick={() => onSelectTask(task.id)}
        >
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-medium line-clamp-1">{task.title}</CardTitle>
            <div className="text-xs text-muted-foreground">
              {task.completedAt ? format(new Date(task.completedAt), 'dd/MM/yyyy • HH:mm') : 'Data desconhecida'}
            </div>
          </CardHeader>
          
          <CardContent className="p-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  {task.totalScore || 0} pontos
                </Badge>
                
                {task.feedback && (
                  <Badge className={getFeedbackColor(task.feedback)}>
                    {task.feedback === 'transformed' ? 'Transformador' : 
                     task.feedback === 'relief' ? 'Alívio' : 
                     task.feedback === 'obligation' ? 'Obrigação' : ''}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
            {task.consequenceScore > 0 && <span className="mr-2">C:{task.consequenceScore}</span>}
            {task.prideScore > 0 && <span className="mr-2">O:{task.prideScore}</span>}
            {task.constructionScore > 0 && <span>Co:{task.constructionScore}</span>}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
