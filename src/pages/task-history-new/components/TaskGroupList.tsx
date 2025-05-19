
import React from 'react';
import { Task } from '@/types';
import { TaskTable } from './TaskTable';
import { TaskGrid } from './TaskGrid';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface TaskGroup {
  label: string;
  tasks: Task[];
}

interface TaskGroupListProps {
  groups: TaskGroup[];
  viewMode: 'list' | 'grid';
  onSelectTask: (taskId: string) => void;
  onRestoreTask?: (taskId: string) => void;
}

export const TaskGroupList: React.FC<TaskGroupListProps> = ({ 
  groups, 
  viewMode,
  onSelectTask,
  onRestoreTask
}) => {
  if (!groups.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma tarefa encontrada para os filtros atuais.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group, index) => (
        <div key={index} className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">{group.label}</h3>
            <Badge variant="outline">{group.tasks.length}</Badge>
          </div>
          
          {viewMode === 'list' ? (
            <TaskTable 
              tasks={group.tasks} 
              onSelectTask={onSelectTask}
              onRestoreTask={onRestoreTask} 
            />
          ) : (
            <TaskGrid 
              tasks={group.tasks} 
              onSelectTask={onSelectTask}
              onRestoreTask={onRestoreTask}
            />
          )}
          
          {index < groups.length - 1 && <Separator className="mt-8" />}
        </div>
      ))}
    </div>
  );
};
