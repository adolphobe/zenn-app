
import React from 'react';
import { Task, ViewMode } from '@/types';
import TaskCardActions from '../TaskCardActions';
import TaskPillarDetails from '../TaskPillarDetails';
import TaskComments from '../TaskComments';

interface TaskCardExpandedProps {
  task: Task;
  onToggleHidden: (e: React.MouseEvent) => void;
  onEditTask: (e: React.MouseEvent) => void;
  onCompleteTask: (e: React.MouseEvent) => void;
  onDeleteTask: (e: React.MouseEvent) => void;
  handleExpandedContentClick: (e: React.MouseEvent) => void;
  viewMode: ViewMode;
  onCollapseTask: () => void;
}

const TaskCardExpanded: React.FC<TaskCardExpandedProps> = ({
  task,
  onToggleHidden,
  onEditTask,
  onCompleteTask,
  onDeleteTask,
  handleExpandedContentClick,
  viewMode,
  onCollapseTask
}) => {
  return (
    <div 
      className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 animate-fade-in"
      onClick={handleExpandedContentClick}
      data-testid="task-card-expanded"
    >
      <TaskPillarDetails task={task} />
      
      {task.comments && task.comments.length > 0 && (
        <div className="mt-4">
          <TaskComments taskId={task.id} comments={task.comments} />
        </div>
      )}
      
      <TaskCardActions
        isHidden={task.hidden}
        onToggleHidden={onToggleHidden}
        onEditTask={onEditTask}
        onCompleteTask={onCompleteTask}
        onDeleteTask={onDeleteTask}
        viewMode={viewMode}
      />
    </div>
  );
};

export default TaskCardExpanded;
