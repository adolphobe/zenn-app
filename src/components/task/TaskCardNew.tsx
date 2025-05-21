
import React from 'react';
import TaskCard from './TaskCard';
import { Task, ViewMode } from '@/types';
import { useAppContext } from '@/context/AppContext';

interface TaskCardProps {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: (taskId: string) => void;
  viewMode?: ViewMode;
}

// Este componente agora é apenas um wrapper que usa nossa nova estrutura modular
const TaskCardNew: React.FC<TaskCardProps> = ({ task, isExpanded, onToggleExpand, viewMode: propViewMode }) => {
  // Get the current view mode from the context
  const { state } = useAppContext();
  const { viewMode: contextViewMode } = state;
  
  // Use the provided viewMode prop if available, otherwise use the one from context
  // Strategic mode should fallback to power mode for task display
  const baseViewMode = propViewMode || contextViewMode;
  
  // Convert strategic to power for the TaskCard component
  const safeViewMode: 'power' | 'chronological' = 
    baseViewMode === 'strategic' ? 'power' : baseViewMode as 'power' | 'chronological';
  
  // Debug the viewMode being passed
  console.log('TaskCardNew rendering with viewMode:', safeViewMode, 'for task:', task.id);
  
  return (
    <TaskCard 
      task={task}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      viewMode={safeViewMode}
    />
  );
};

export default TaskCardNew;
