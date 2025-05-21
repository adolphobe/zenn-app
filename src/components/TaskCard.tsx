
// This file acts as a wrapper to maintain compatibility with existing code
import { Task, ViewMode } from '@/types';
import TaskCardNew from './task/TaskCardNew';

interface TaskCardProps {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: (taskId: string) => void;
  viewMode?: ViewMode; 
}

// Re-export TaskCardNew as default
export default TaskCardNew;
