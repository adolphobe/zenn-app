
import React, { useRef, useEffect } from 'react';
import { isTaskOverdue } from '@/utils';
import { ViewMode } from '@/types';

interface TaskCardTitleProps {
  title: string;
  isEditing: boolean;
  titleValue: string;
  onTitleClick: (e: React.MouseEvent) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleBlur: () => void;
  onTitleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  idealDate?: Date | null;
  viewMode?: ViewMode;
}

const TaskCardTitle: React.FC<TaskCardTitleProps> = ({
  title,
  isEditing,
  titleValue,
  onTitleClick,
  onTitleChange,
  onTitleBlur,
  onTitleKeyDown,
  idealDate,
  viewMode
}) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  // Determine if task is overdue and should have red text
  const isOverdue = idealDate && isTaskOverdue(idealDate);
  const showOverdueStyle = viewMode === 'chronological' && isOverdue;

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <input
        ref={titleInputRef}
        type="text"
        value={titleValue}
        onChange={onTitleChange}
        onBlur={onTitleBlur}
        onKeyDown={onTitleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-transparent border-b border-gray-400 focus:outline-none py-1"
        autoFocus
      />
    );
  }

  return (
    <h3 
        className={`text-base font-medium cursor-text ${showOverdueStyle ? 'text-[#ff5454]' : ''}`}
        onClick={onTitleClick}
    >
      {title}
    </h3>
  );
};

export default TaskCardTitle;
