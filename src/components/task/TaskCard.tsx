
import React, { useState, useEffect } from 'react';
import { Task } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCardHeader from '../TaskCardHeader';
import TaskCardExpanded from './TaskCardExpanded';
import TaskModals from './TaskModals';
import { getTaskPriorityClass } from '@/utils';
import { useAppContext } from '@/context/AppContext';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { useTaskToasts } from './utils/taskToasts';

interface TaskCardProps {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isExpanded, onToggleExpand }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(task.title);
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  
  const { state, updateTaskTitle } = useAppContext();
  const { showHiddenTasks, viewMode, dateDisplayOptions } = state;
  const { toggleTaskHidden } = useTaskDataContext();
  const { showToggleHiddenToast } = useTaskToasts();
  
  // Atualizar titleValue quando a tarefa muda
  useEffect(() => {
    setTitleValue(task.title);
  }, [task.title]);
  
  // Aplicar classe de prioridade apenas no modo potência
  const cardClass = viewMode === 'chronological' 
    ? 'bg-white text-gray-800 border-gray-200' 
    : getTaskPriorityClass(task.totalScore);
  
  // Manipulador para expansão do card
  const handleCardClick = (e: React.MouseEvent) => {
    if (isEditingTitle) return;
    onToggleExpand(task.id);
  };

  // Título relacionado
  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };

  const handleTitleBlur = () => {
    if (titleValue.trim() !== task.title) {
      updateTaskTitle(task.id, titleValue.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (titleValue.trim() !== task.title) {
        updateTaskTitle(task.id, titleValue.trim());
      }
      setIsEditingTitle(false);
    } else if (e.key === 'Escape') {
      setTitleValue(task.title);
      setIsEditingTitle(false);
    }
  };

  // Funções relacionadas a ações
  const handleCollapseTask = () => {
    onToggleExpand(task.id);
  };

  const handleExpandedContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const handleToggleHidden = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToggleHiddenToast(task);
  };

  const handleEditTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTaskModalOpen(true);
  };

  const handleCompleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFeedbackModalOpen(true);
  };

  const handleDeleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmModalOpen(true);
  };

  // Determine se a tarefa tem uma animação de saída pendente
  const isPendingHiddenUpdate = task._pendingHiddenUpdate || false;
  const exitClass = isPendingHiddenUpdate ? 'animate-fade-out' : '';

  return (
    <>
      <motion.div
        layout
        layoutId={`task-card-${task.id}`}
        className={`task-card ${cardClass} ${task.completed ? 'opacity-50' : ''} ${exitClass} relative cursor-pointer`}
        onClick={handleCardClick}
        data-task-id={task.id}
        transition={{ 
          layout: { duration: 0.3, ease: "easeInOut" },
          opacity: { duration: 0.2 }
        }}
        exit={{ 
          opacity: 0, 
          scale: 0.9, 
          y: -20,
          transition: { duration: 0.2, ease: "easeInOut" }
        }}
      >
        <TaskCardHeader 
          title={task.title}
          totalScore={task.totalScore}
          idealDate={task.idealDate}
          isEditing={isEditingTitle}
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

        <AnimatePresence initial={false}>
          {isExpanded && (
            <TaskCardExpanded 
              task={task}
              onToggleHidden={handleToggleHidden}
              onEditTask={handleEditTask}
              onCompleteTask={handleCompleteTask}
              onDeleteTask={handleDeleteTask}
              handleExpandedContentClick={handleExpandedContentClick}
              viewMode={viewMode}
              onCollapseTask={handleCollapseTask}
            />
          )}
        </AnimatePresence>
      </motion.div>

      <TaskModals 
        task={task}
        editTaskModalOpen={editTaskModalOpen}
        feedbackModalOpen={feedbackModalOpen}
        deleteConfirmModalOpen={deleteConfirmModalOpen}
        onCloseEditModal={() => setEditTaskModalOpen(false)}
        onCloseFeedbackModal={() => setFeedbackModalOpen(false)}
        onCloseDeleteModal={() => setDeleteConfirmModalOpen(false)}
      />
    </>
  );
};

export default TaskCard;
