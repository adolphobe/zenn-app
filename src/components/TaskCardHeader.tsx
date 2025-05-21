
import React from 'react';
import { format } from 'date-fns';
import { Eye, CalendarDays } from 'lucide-react';
import { Badge } from './ui/badge';
import { DateDisplayOptions } from '@/types/dates';

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
}) => {
  // Format date with the appropriate settings
  // Use dateFormat from dateDisplayOptions, falling back to a default format if not provided
  const formatString = dateDisplayOptions.dateFormat || 'dd/MM/yyyy';
  const formattedDate = idealDate ? format(new Date(idealDate), formatString) : null;
  
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
            className="text-base md:text-lg font-medium cursor-pointer"
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
            Cons: {consequenceScore}
          </Badge>
        )}
        {prideScore !== undefined && (
          <Badge variant="outline" className="bg-opacity-80 text-xs task-text-secondary">
            Org: {prideScore}
          </Badge>
        )}
        {constructionScore !== undefined && (
          <Badge variant="outline" className="bg-opacity-80 text-xs task-text-secondary">
            Constr: {constructionScore}
          </Badge>
        )}
      </div>

      {/* Data Ideal (se existir) */}
      {idealDate && (
        <div className="mt-2 flex items-center task-text-secondary text-sm">
          <CalendarDays size={14} className="mr-1" /> 
          {formattedDate}
        </div>
      )}
    </div>
  );
};

export default TaskCardHeader;
