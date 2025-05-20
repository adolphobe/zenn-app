
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
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export const TaskGroupList: React.FC<TaskGroupListProps> = ({ 
  groups, 
  viewMode,
  onSelectTask,
  onRestoreTask,
  onSort,
  sortField,
  sortDirection
}) => {
  if (!groups.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma tarefa encontrada para os filtros atuais.</p>
      </div>
    );
  }

  return (
    // Added overflow-x-hidden to prevent horizontal scrollbar
    <div className="space-y-8 overflow-x-hidden">
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
              onSort={onSort}
              sortField={sortField}
              sortDirection={sortDirection}
            />
          ) : (
            <TaskGrid 
              tasks={group.tasks} 
              onSelectTask={onSelectTask}
              onRestoreTask={onRestoreTask}
              onSort={onSort}
              sortField={sortField}
              sortDirection={sortDirection}
            />
          )}
          
          {index < groups.length - 1 && <Separator className="mt-8" />}
        </div>
      ))}
    </div>
  );
};
