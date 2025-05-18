
import React, { useState, useEffect } from 'react';
import { Task } from '@/types';
import { isTaskOverdue, safeParseDate } from '@/utils';
import { useAppContext } from '@/context/AppContext';
import TaskCardHeader from '../TaskCardHeader';
import TaskCardExpanded from '../task/TaskCardExpanded';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
}

const TaskCardNew: React.FC<TaskCardProps> = ({ task, isExpanded, onToggleExpand }) => {
  const { 
    deleteTask,
    updateTask,
    toggleTaskCompleted, 
    toggleTaskHidden 
  } = useTaskDataContext();
  const { state: { viewMode, dateDisplayOptions, showHiddenTasks } } = useAppContext();
  
  const [isEditing, setIsEditing] = useState(false);
  const [titleValue, setTitleValue] = useState(task.title);
  
  // Reset title value when task changes
  useEffect(() => {
    setTitleValue(task.title);
  }, [task.title]);

  // Toggle card expansion
  const handleCardClick = () => {
    if (!isEditing) {
      onToggleExpand(task.id);
    }
  };

  // Prevent expanded content click from triggering card collapse
  const handleExpandedContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Title editing handlers
  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };

  const handleTitleBlur = () => {
    if (titleValue.trim() !== '' && titleValue !== task.title) {
      updateTask(task.id, { title: titleValue });
    } else {
      setTitleValue(task.title); // Reset to original if empty or unchanged
    }
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (titleValue.trim() !== '' && titleValue !== task.title) {
        updateTask(task.id, { title: titleValue });
      } else {
        setTitleValue(task.title);
      }
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setTitleValue(task.title);
      setIsEditing(false);
    }
  };

  // Task action handlers
  const handleToggleHidden = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskHidden(task.id);
  };

  const handleEditTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    handleTitleClick(e);
  };

  const handleCompleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskCompleted(task.id);
  };

  const handleDeleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  // Determine if task is overdue
  const parsedDate = task.idealDate ? safeParseDate(task.idealDate) : null;
  const isOverdue = parsedDate ? isTaskOverdue(parsedDate) : false;
  
  // Dynamic border and background styles
  const getBorderStyle = () => {
    if (task.hidden && showHiddenTasks) {
      return 'border-gray-300/30 dark:border-gray-700/30';
    }
    
    if (viewMode === 'chronological' && isOverdue) {
      return 'border-red-200/50 dark:border-red-900/30';
    }
    
    return 'border-gray-200/50 dark:border-gray-800/50';
  };
  
  const getBackgroundStyle = () => {
    if (task.hidden && showHiddenTasks) {
      return 'bg-gray-50/80 dark:bg-gray-900/30';
    }
    
    if (viewMode === 'chronological' && isOverdue) {
      return 'bg-red-50/30 dark:bg-red-950/10';
    }
    
    return 'bg-white/40 dark:bg-gray-950/40 backdrop-blur-[2px]';
  };

  return (
    <motion.div 
      className={`rounded-[10px] border ${getBorderStyle()} ${getBackgroundStyle()} 
                shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer p-4`}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      onClick={handleCardClick}
      layoutId={`task-card-${task.id}`}
    >
      <TaskCardHeader 
        title={task.title}
        totalScore={task.totalScore}
        idealDate={task.idealDate}
        isEditing={isEditing}
        titleValue={titleValue}
        dateDisplayOptions={dateDisplayOptions}
        isHidden={task.hidden}
        showHiddenTasks={showHiddenTasks}
        onTitleClick={handleTitleClick}
        onTitleChange={handleTitleChange}
        onTitleBlur={handleTitleBlur}
        onTitleKeyDown={handleTitleKeyDown}
        consequenceScore={task.consequenceScore}
        prideScore={task.prideScore}
        constructionScore={task.constructionScore}
      />
      
      <AnimatePresence>
        {isExpanded && (
          <TaskCardExpanded 
            task={task}
            onToggleHidden={handleToggleHidden}
            onEditTask={handleEditTask}
            onCompleteTask={handleCompleteTask}
            onDeleteTask={handleDeleteTask}
            handleExpandedContentClick={handleExpandedContentClick}
            viewMode={viewMode}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskCardNew;
