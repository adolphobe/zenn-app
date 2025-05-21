
import React from 'react';
import TaskCard from './TaskCard';
import { Task, ViewMode } from '@/types';
import { useAppContext } from '@/context/AppContext';

interface TaskCardProps {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: (taskId: string) => void;
  // Add viewMode as an optional prop to ensure backward compatibility
  viewMode?: ViewMode;
}

// Este componente agora é apenas um wrapper que usa nossa nova estrutura modular
const TaskCardNew: React.FC<TaskCardProps> = ({ task, isExpanded, onToggleExpand, viewMode: propViewMode }) => {
  // Get the current view mode from the context
  const { state } = useAppContext();
  const { viewMode: contextViewMode } = state;
  
  // Use the provided viewMode prop if available, otherwise use the one from context
  // Ensure we only pass valid view modes to TaskCard
  // Convert "strategic" to "power" as a fallback
  const safeViewMode = propViewMode || 
    (contextViewMode === 'strategic' ? 'power' : contextViewMode);
  
  return (
    <TaskCard 
      task={task}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      // Pass the safe view mode
      viewMode={safeViewMode as 'power' | 'chronological'}
    />
  );
};

export default TaskCardNew;
