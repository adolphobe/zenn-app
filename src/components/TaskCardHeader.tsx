
import React from 'react';
import { formatDate, isTaskOverdue } from '@/utils';
import { DateDisplayOptions } from '@/types';
import TaskCardTitle from './TaskCardTitle';
import { Bell } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const { state: { showPillars, showDates, viewMode } } = useAppContext();
  
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
  
  return (
    <>
      {/* Hidden label for hidden tasks that are only visible because of the filter - now with tooltip */}
      {isHidden && showHiddenTasks && (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="absolute top-0 left-0 bg-gray-600 text-white text-xs font-semibold px-3 py-1 rounded-tl-lg z-10">
                OCULTO
              </div>
            </TooltipTrigger>
            <TooltipContent className="text-sm max-w-xs leading-relaxed">
              {getTooltipMessage()}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
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
          <div className="flex items-center justify-center bg-white bg-opacity-40 rounded-full px-3 py-1.5 font-semibold ml-2">
            <span className="text-[16px]">{totalScore}</span>
            <span className="text-[10px] self-end mb-1 ml-0.5">/ 15</span>
          </div>
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
    </>
  );
};

export default TaskCardHeader;
