
import React, { useRef, useEffect } from 'react';

interface TaskCardTitleProps {
  title: string;
  isEditing: boolean;
  titleValue: string;
  onTitleClick: (e: React.MouseEvent) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleBlur: () => void;
  onTitleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TaskCardTitle: React.FC<TaskCardTitleProps> = ({
  title,
  isEditing,
  titleValue,
  onTitleClick,
  onTitleChange,
  onTitleBlur,
  onTitleKeyDown
}) => {
  const titleInputRef = useRef<HTMLInputElement>(null);

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
      className="text-base font-medium cursor-pointer"
      onClick={onTitleClick}
    >
      {title}
    </h3>
  );
};

export default TaskCardTitle;
