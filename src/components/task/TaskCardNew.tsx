
import React from 'react';
import TaskCard from './TaskCard';
import { Task, ViewMode } from '@/types';
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
  
  // Ensure we only pass valid view modes to TaskCard
  // Convert "strategic" to "power" as a fallback
  const safeViewMode = viewMode === 'strategic' ? 'power' : viewMode;
  
  return (
    <TaskCard 
      task={task}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      // Pass the safe view mode
      viewMode={safeViewMode}
    />
  );
};

export default TaskCardNew;
