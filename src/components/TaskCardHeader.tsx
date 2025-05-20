
import React from 'react';
import { formatDate } from '@/utils';
import { DateDisplayOptions } from '@/types/dates';
import TaskCardTitle from './TaskCardTitle';
import { Bell, Hash } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { dateService } from '@/services/dateService';

interface TaskCardHeaderProps {
  title: string;
  totalScore: number;
  idealDate?: Date | string | null;
  isEditing: boolean;
  titleValue: string;
  dateDisplayOptions: DateDisplayOptions;
  isHidden: boolean;
  showHiddenTasks: boolean;
  onTitleClick: (e: React.MouseEvent) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleBlur: () => void;
  onTitleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  consequenceScore?: number;
  prideScore?: number;
  constructionScore?: number;
  isPowerExtra?: boolean;
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
  
  // Convert idealDate to Date object using dateService 
  const parsedDate = dateService.parseDate(idealDate);
  
  // Check if task is overdue (before current date and time)
  const taskIsOverdue = dateService.isTaskOverdue(parsedDate);
  
  // In chronological mode, always show dates regardless of showDates setting
  const shouldShowDate = viewMode === 'chronological' || showDates;
  
  // In chronological mode, only show score if showScores is true
  const shouldShowScore = viewMode !== 'chronological' || showScores;
  
  return (
    <div className={`${isHidden && showHiddenTasks ? 'pt-[15px]' : ''} relative`}>
      {/* Hidden label with improved reactivity */}
      <AnimatePresence mode="wait">
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
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  layoutId={`hidden-badge-${title.substring(0, 10)}`}
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
          {shouldShowScore && (
            <div className="flex items-center justify-center bg-white bg-opacity-40 rounded-full px-3 py-1.5 font-semibold ml-2">
              <span className="text-[16px]">{totalScore}</span>
              <span className="text-[10px] self-end mb-1 ml-0.5">/ 15</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Moved pillars to appear first, before the date */}
      {showPillars && (
        <div className="mt-1 text-xs flex flex-wrap gap-2">
          <span>Risco: {consequenceScore}</span>
          <span>|</span>
          <span>Orgulho: {prideScore}</span>
          <span>|</span>
          <span>Crescimento: {constructionScore}</span>
        </div>
      )}
      
      {/* Data movida para depois dos pilares, com padding-top adicionado */}
      {shouldShowDate && (
        <div className="text-xs flex items-center mt-1 mb-1 pt-2">
          {taskIsOverdue && parsedDate && (
            <Bell size={14} className="text-red-400 mr-1" />
          )}
          {parsedDate ? (
            <span className="text-inherit">{formatDate(parsedDate, dateDisplayOptions)}</span>
          ) : viewMode === 'chronological' ? (
            <span className="text-gray-400">SEM PRAZO</span>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default TaskCardHeader;
