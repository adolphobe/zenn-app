
import React from 'react';
import { format } from 'date-fns';
import { Bell, Eye } from 'lucide-react';
import { Badge } from './ui/badge';
import { DateDisplayOptions } from '@/types/dates';
import { isTaskOverdue } from '@/utils';

interface TaskCardHeaderProps {
  title: string;
  totalScore: number;
  idealDate?: string;
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
  viewMode?: string;
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
  consequenceScore,
  prideScore,
  constructionScore,
  isPowerExtra,
  viewMode,
}) => {
  // Format date with the appropriate settings
  const formatDate = dateDisplayOptions.dateFormat || 'dd/MM/yyyy';
  const formatTime = 'HH:mm'; // Time format to show hours and minutes
  const formattedDate = idealDate ? format(new Date(idealDate), formatDate) : null;
  const formattedTime = idealDate ? format(new Date(idealDate), formatTime) : null;
  
  // Verificar se a data está vencida
  const isOverdue = idealDate ? isTaskOverdue(idealDate) : false;
  
  // Definir classe para o título de acordo com o modo e se está vencido
  const titleClassName = `text-base md:text-lg font-medium cursor-pointer ${
    viewMode === 'chronological' && isOverdue ? 'text-[#ea384c]' : ''
  }`;
  
  // Definir classe para o texto "SEM DATA" de acordo com o modo
  const noDateClassName = viewMode === 'chronological' 
    ? 'text-gray-500 dark:text-gray-400' 
    : 'task-text-secondary'; // No modo potência, usa a classe que herda a cor do card
  
  return (
    <div>
      {/* Title */}
      {isEditing ? (
        <input
          type="text"
          value={titleValue}
          onChange={onTitleChange}
          onBlur={onTitleBlur}
          onKeyDown={onTitleKeyDown}
          className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      ) : (
        <div className="flex justify-between items-start mb-2">
          <h3 
            className={titleClassName}
            onClick={onTitleClick}
          >
            {isPowerExtra && (
              <span className="power-extra-indicator" aria-hidden="true"></span>
            )}
            {title}
          </h3>
          
          {isHidden && showHiddenTasks && (
            <div 
              className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 text-xs py-0.5 px-1.5 ml-2 rounded-md flex items-center"
              data-hidden-badge="true"
            >
              <Eye size={12} className="mr-1" /> Oculta
            </div>
          )}
        </div>
      )}

      {/* Valor dos pilares */}
      <div className="flex flex-wrap gap-2 items-center mt-2">
        {consequenceScore !== undefined && (
          <Badge variant="outline" className="bg-opacity-80 text-xs task-text-secondary">
            Risco: {consequenceScore}
          </Badge>
        )}
        {prideScore !== undefined && (
          <Badge variant="outline" className="bg-opacity-80 text-xs task-text-secondary">
            Orgulho: {prideScore}
          </Badge>
        )}
        {constructionScore !== undefined && (
          <Badge variant="outline" className="bg-opacity-80 text-xs task-text-secondary">
            Crescimento: {constructionScore}
          </Badge>
        )}
      </div>

      {/* Data Ideal (se existir) ou "SEM DATA" */}
      <div className="text-[12px] mt-2 flex items-center text-sm">
        {idealDate ? (
          <span className="task-text-secondary flex items-center">
            {isOverdue && <Bell size={12} className="mr-1 text-[#ea384c]" />}
            {formattedDate} {formattedTime && <span className="ml-1">às {formattedTime}</span>}
          </span>
        ) : (
          <span className={noDateClassName}>Sem Data</span>
        )}
      </div>
    </div>
  );
};

export default TaskCardHeader;
