//src/components/TaskCard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Task } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { getTaskPriorityClass } from '@/utils';
import TaskPillarDetails from './TaskPillarDetails';
import TaskCardHeader from './TaskCardHeader';
import TaskCardActions from './TaskCardActions';
import PostCompletionFeedback from './PostCompletionFeedback';
import TaskForm from './TaskForm';
import TaskComments from './TaskComments';
import DeleteTaskConfirmation from './DeleteTaskConfirmation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskDataContext } from '@/context/TaskDataProvider';

interface TaskCardProps {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isExpanded, onToggleExpand }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(task.title);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [showBorderAnimation, setShowBorderAnimation] = useState(false);
  const { state, updateTaskTitle } = useAppContext();
  const { toggleTaskHidden, toggleTaskCompleted, setTaskFeedback } = useTaskDataContext();
  const { dateDisplayOptions, showHiddenTasks, viewMode } = state;
  const prevHiddenRef = useRef(task.hidden);
  
  // Aplicar classe de prioridade apenas no modo potência
  // No modo cronológico, usar um estilo neutro claro
  const cardClass = viewMode === 'chronological' 
    ? 'bg-white text-gray-800 border-gray-200' 
    : getTaskPriorityClass(task.totalScore);

  // Add border animation class when task changes from hidden to visible
  const borderAnimationClass = showBorderAnimation ? 'animate-border-pulse' : '';
  
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

  const handleCompleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFeedbackModalOpen(true);
  };

  // Implementação melhorada da função de alternar visibilidade para evitar animação de layout
  const handleToggleHidden = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Ocultar/Mostrar tarefa clicado:', task.id, 'Status atual:', task.hidden);
    
    // Mostrar animação apenas quando estiver mudando de oculto para visível no modo potência
    if (viewMode === 'power' && task.hidden && showHiddenTasks) {
      // Ativar animação de borda ao mostrar a tarefa
      setShowBorderAnimation(true);
      // Resetar a animação após ela terminar
      setTimeout(() => {
        setShowBorderAnimation(false);
      }, 1200); // Animação dura 1.2 segundos
    }
    
    // Usar o método do TaskDataProvider que tem atualização otimista
    toggleTaskHidden(task.id);
  };

  const handleEditTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTaskModalOpen(true);
  };
  
  const handleDeleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmModalOpen(true);
  };

  const handleFeedbackConfirm = (feedbackType: 'transformed' | 'relief' | 'obligation') => {
    // Primeiro marcamos a tarefa como completa
    toggleTaskCompleted(task.id);
    
    // Depois salvamos o feedback
    if (setTaskFeedback) {
      setTaskFeedback(task.id, feedbackType);
    }
    
    setFeedbackModalOpen(false);
  };

  const handleFeedbackCancel = () => {
    setFeedbackModalOpen(false);
  };

  // Variantes de animação para o conteúdo expandido
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

  // Manipulador para expansão do card
  const handleCardClick = (e: React.MouseEvent) => {
    // Se estivermos editando o título, não faremos nada
    if (isEditingTitle) return;
    
    // Chamar a função de toggle
    onToggleExpand(task.id);
  };

  // Manipulador para cliques em áreas expandidas
  const handleExpandedContentClick = (e: React.MouseEvent) => {
    // Impedir a propagação para o card
    e.stopPropagation();
  };

  useEffect(() => {
    setTitleValue(task.title);
  }, [task.title]);

  return (
    <>
      <div
        className={`task-card ${cardClass} ${borderAnimationClass} ${task.completed ? 'opacity-50' : ''} relative cursor-pointer`}
        onClick={handleCardClick}
        data-task-id={task.id}
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
                onToggleHidden={handleToggleHidden}
                onEditTask={handleEditTask}
                onCompleteTask={handleCompleteTask}
                onDeleteTask={handleDeleteTask}
                viewMode={viewMode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PostCompletionFeedback
        task={task}
        isOpen={feedbackModalOpen}
        onClose={handleFeedbackCancel}
        onConfirm={handleFeedbackConfirm}
      />
      
      {editTaskModalOpen && (
        <TaskForm
          onClose={() => setEditTaskModalOpen(false)}
          initialData={{
            title: task.title,
            consequenceScore: task.consequenceScore,
            prideScore: task.prideScore,
            constructionScore: task.constructionScore,
            idealDate: task.idealDate instanceof Date ? task.idealDate : task.idealDate ? new Date(task.idealDate) : null
          }}
          taskId={task.id}
          task={task}
          isEditing={true}
        />
      )}
      
      <DeleteTaskConfirmation
        task={task}
        isOpen={deleteConfirmModalOpen}
        onClose={() => setDeleteConfirmModalOpen(false)}
      />
    </>
  );
};

export default TaskCard;
