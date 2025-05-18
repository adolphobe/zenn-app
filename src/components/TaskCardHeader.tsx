
import React from 'react';
import { formatDate, isTaskOverdue } from '@/utils';
import { DateDisplayOptions } from '@/types';
import TaskCardTitle from './TaskCardTitle';
import { Bell, Hash } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskCardHeaderProps {
  title: string;
  totalScore: number;
  idealDate?: Date | null;
  isEditing: boolean;
  titleValue: string;
  dateDisplayOptions: DateDisplayOptions;
  isHidden: boolean;
  showHiddenTasks: boolean;
  onTitleClick: (e: React.MouseEvent) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleBlur: () => void;
  onTitleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  // Add these new props to access the individual pillar scores
  consequenceScore?: number;
  prideScore?: number;
  constructionScore?: number;
}

const TaskCardHeader: React.FC<TaskCardHeaderProps> = ({
  title,
  totalScore,
  idealDate,
  isEditing,
  titleValue,
  dateDisplayOptions,
  isHidden,
  showHiddenTasks,
  onTitleClick,
  onTitleChange,
  onTitleBlur,
  onTitleKeyDown,
  consequenceScore = 0,
  prideScore = 0,
  constructionScore = 0
}) => {
  const { state: { showPillars, showDates, viewMode, showScores } } = useAppContext();
  
  // Define tooltip message based on view mode and score
  const getTooltipMessage = () => {
    if (viewMode === 'chronological') {
      return "Esta tarefa está oculta no Modo Potência";
    } else {
      // For Power Mode, check the task's score
      if (totalScore < 8) {
        return (
          <>
            Essa tarefa está oculta porque sua potência é inferior a 8.<br /><br />
            Aqui somente as tarefas que tem peso são importantes,<br />
            então ocultamos automáticamente as tarefas menos relevantes.<br /><br />
            Você sempre poderá visualiza-las clicando no filtro "Tarefas Ocultas"
          </>
        );
      } else {
        return (
          <>
            Você ocultou esta tarefa.<br />
            Você pode torná-la visível clicando no botão "Mostrar"
          </>
        );
      }
    }
  };
  
  // Check if task is overdue (before current date and time)
  const taskIsOverdue = idealDate ? isTaskOverdue(idealDate) : false;
  
  // In chronological mode, always show dates regardless of showDates setting
  const shouldShowDate = viewMode === 'chronological' || showDates;
  
  // In chronological mode, only show score if showScores is true
  const shouldShowScore = viewMode !== 'chronological' || showScores;
  
  // Animation variants for the hidden badge
  const badgeVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };
  
  return (
    <div className={`${isHidden && showHiddenTasks ? 'pt-[15px]' : ''}`}>
      {/* Hidden label for hidden tasks that are only visible because of the filter - now with tooltip and animation */}
      <AnimatePresence>
        {isHidden && showHiddenTasks && (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <motion.div 
                  className="absolute top-0 left-0 text-xs font-medium px-3 py-1 z-10 shadow-sm backdrop-blur-sm border-b border-r border-gray-300/50"
                  style={{ 
                    background: '#0000001c',
                    color: '#676767',
                    borderTopLeftRadius: '10px', 
                    borderBottomRightRadius: '9px',
                    borderTopRightRadius: '0px',
                    borderBottomLeftRadius: '0px'
                  }}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={badgeVariants}
                  layout
                >
                  OCULTO
                </motion.div>
              </TooltipTrigger>
              <TooltipContent className="text-sm max-w-xs leading-relaxed border border-gray-200 bg-white/95 backdrop-blur-sm shadow-md"
                           style={{ borderRadius: '6px' }}>
                {getTooltipMessage()}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </AnimatePresence>
      
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <TaskCardTitle 
            title={title}
            isEditing={isEditing}
            titleValue={titleValue}
            onTitleClick={onTitleClick}
            onTitleChange={onTitleChange}
            onTitleBlur={onTitleBlur}
            onTitleKeyDown={onTitleKeyDown}
            idealDate={idealDate}
            viewMode={viewMode}
          />
        </div>
        
        <div className="flex items-center">
          {idealDate && shouldShowDate && (
            <div className="text-xs text-right ml-3 flex items-center">
              {taskIsOverdue && (
                <Bell size={14} className="text-red-400 mr-1" />
              )}
              {formatDate(idealDate, dateDisplayOptions)}
            </div>
          )}
          {shouldShowScore && (
            <div className="flex items-center justify-center bg-white bg-opacity-40 rounded-full px-3 py-1.5 font-semibold ml-2">
              <span className="text-[16px]">{totalScore}</span>
              <span className="text-[10px] self-end mb-1 ml-0.5">/ 15</span>
            </div>
          )}
        </div>
      </div>
      
      {showPillars && (
        <div className="mt-2 text-xs flex flex-wrap gap-2">
          <span>Risco: {consequenceScore}</span>
          <span>|</span>
          <span>Orgulho: {prideScore}</span>
          <span>|</span>
          <span>Crescimento: {constructionScore}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCardHeader;
