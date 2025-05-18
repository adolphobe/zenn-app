
import React from 'react';
import { Task } from '@/types';
import TaskPillarDetails from '../TaskPillarDetails';
import TaskCardActions from '../TaskCardActions';
import TaskComments from '../TaskComments';
import { motion } from 'framer-motion';
import { ViewMode } from '@/types';

interface TaskCardExpandedProps {
  task: Task;
  onToggleHidden: (e: React.MouseEvent) => void;
  onEditTask: (e: React.MouseEvent) => void;
  onCompleteTask: (e: React.MouseEvent) => void;
  onDeleteTask: (e: React.MouseEvent) => void;
  handleExpandedContentClick: (e: React.MouseEvent) => void;
  viewMode: ViewMode;
}

const expandedContentVariants = {
  hidden: { 
    opacity: 0,
    height: 0,
    scale: 0.98,
    transformOrigin: "top",
    transition: { 
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  visible: { 
    opacity: 1,
    height: "auto",
    scale: 1,
    transformOrigin: "top",
    transition: {
      height: {
        duration: 0.25,
        ease: "easeInOut"
      },
      opacity: {
        duration: 0.15,
        delay: 0.1
      },
      scale: {
        duration: 0.2
      }
    }
  }
};

const TaskCardExpanded: React.FC<TaskCardExpandedProps> = ({
  task,
  onToggleHidden,
  onEditTask,
  onCompleteTask,
  onDeleteTask,
  handleExpandedContentClick,
  viewMode
}) => {
  return (
    <motion.div 
      className="mt-4 overflow-hidden"
      variants={expandedContentVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={handleExpandedContentClick}
    >
      <TaskPillarDetails task={task} />
      
      {/* Display comments if they exist - shown in both modes */}
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
    </motion.div>
  );
};

export default TaskCardExpanded;
