
import React from 'react';
import { Task } from '@/types';
import { Badge } from '@/components/ui/badge';
import CompletedTaskCard from './CompletedTaskCard';

interface TaskGroup {
  label: string;
  tasks: Task[];
}

interface TaskGroupGridProps {
  groups: TaskGroup[];
}

export const TaskGroupGrid: React.FC<TaskGroupGridProps> = ({ groups }) => (
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

export default TaskGroupGrid;
