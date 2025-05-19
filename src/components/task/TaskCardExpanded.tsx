
import React, { useCallback } from 'react';
import { Task } from '@/types';
import TaskPillarDetails from '../TaskPillarDetails';
import TaskCardActions from '../TaskCardActions';
import TaskComments from '../TaskComments';
import { motion } from 'framer-motion';
import { ViewMode } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useComments } from '@/hooks/useComments';

interface TaskCardExpandedProps {
  task: Task;
  onToggleHidden: (e: React.MouseEvent) => void;
  onEditTask: (e: React.MouseEvent) => void;
  onCompleteTask: (e: React.MouseEvent) => void;
  onDeleteTask: (e: React.MouseEvent) => void;
  handleExpandedContentClick: (e: React.MouseEvent) => void;
  viewMode: ViewMode;
  onCollapseTask: () => void; // Prop to handle task collapsing
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
  viewMode,
  onCollapseTask
}) => {
  const queryClient = useQueryClient();
  
  // Use the comments hook to get real-time comments
  const { comments, refreshComments } = useComments(task.id);
  
  // Handler for comment deletion
  const handleCommentDeleted = useCallback(() => {
    console.log('[TaskCardExpanded] Comment deleted, refreshing task data');
    refreshComments();
  }, [refreshComments]);
  
  // Get the comments to display - either from the hook (preferred) or fallback to task.comments
  const commentsToShow = comments?.length > 0 ? comments : task.comments;
  
  return (
    <motion.div 
      className="mt-4 overflow-hidden"
      variants={expandedContentVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={handleExpandedContentClick}
    >
      <TaskPillarDetails task={task} onCollapseTask={onCollapseTask} />
      
      {/* Display comments if they exist - shown in both modes */}
      {commentsToShow && commentsToShow.length > 0 && (
        <div className="mt-4 cursor-default">
          <TaskComments 
            taskId={task.id} 
            comments={commentsToShow} 
            onCommentDeleted={handleCommentDeleted} 
          />
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
