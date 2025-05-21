
import React from 'react';
import TaskCard from './TaskCard';
import { Task } from '@/types';
import { useAppContext } from '@/context/AppContext';

interface TaskCardProps {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: (taskId: string) => void;
}

// Este componente agora é apenas um wrapper que usa nossa nova estrutura modular
const TaskCardNew: React.FC<TaskCardProps> = ({ task, isExpanded, onToggleExpand }) => {
  // Get the current view mode from the context
  const { state } = useAppContext();
  const { viewMode } = state;
  
  return (
    <TaskCard 
      task={task}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      // Always pass the current view mode
      viewMode={viewMode}
    />
  );
};

export default TaskCardNew;
