// src/components/TaskCardHeader.tsx
import React from 'react';
import { formatDate } from '@/utils';
import { DateDisplayOptions } from '@/types';
import TaskCardTitle from './TaskCardTitle';
import { Eye } from 'lucide-react';
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
  onTitleKeyDown
}) => {
  const { state: { showPillars, showDates, viewMode } } = useAppContext();
  
  // Define tooltip message based on view mode
  const getTooltipMessage = () => {
    if (viewMode === 'chronological') {
      return "Esta tarefa está oculta no Modo Potência";
    } else {
      return (
        <>
          Essa tarefa está oculta porque sua potência é inferior a 8.<br /><br />
          Aqui somente as tarefas que tem peso são importantes,<br />
          então ocultamos automáticamente as tarefas menos relevantes.<br /><br />
          Você sempre poderá visualiza-las clicando no filtro "Tarefas Ocultas"
        </>
      );
    }
  };
  
  return (
    <>
      {/* Eye icon for hidden tasks that are only visible because of the filter - now with tooltip */}
      {isHidden && showHiddenTasks && (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="absolute bottom-2 right-2 bg-gray-800/30 dark:bg-gray-200/30 text-white dark:text-gray-800 rounded-full p-1 z-10 opacity-40">
                <Eye size={16} />
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
          />
        </div>
        
        <div className="flex items-center">
          {idealDate && showDates && (
            <div className="text-xs text-right ml-3">
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
          <span>Risco: {totalScore ? Math.floor(totalScore / 3) : 0}</span>
          <span>|</span>
          <span>Orgulho: {totalScore ? Math.floor(totalScore / 3) : 0}</span>
          <span>|</span>
          <span>Crescimento: {totalScore ? Math.ceil(totalScore / 3) : 0}</span>
        </div>
      )}
    </>
  );
};

export default TaskCardHeader;