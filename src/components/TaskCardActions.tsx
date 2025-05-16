
import React from 'react';
import { Eye, EyeOff, Edit2, CheckSquare, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { ViewMode } from '@/types';

interface TaskCardActionsProps {
  isHidden: boolean;
  onToggleHidden: (e: React.MouseEvent) => void;
  onEditTask: (e: React.MouseEvent) => void;
  onCompleteTask: (e: React.MouseEvent) => void;
  onDeleteTask: (e: React.MouseEvent) => void;
  viewMode?: ViewMode;
}

const TaskCardActions: React.FC<TaskCardActionsProps> = ({
  isHidden,
  onToggleHidden,
  onEditTask,
  onCompleteTask,
  onDeleteTask,
  viewMode = 'power'
}) => {
  return (
    <div className="flex justify-between space-x-2 mt-4">
      {/* Left side actions: Edit, Hide, Delete */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onEditTask}
          title="Editar"
        >
          <Edit2 size={16} />
          <span className="ml-1">Editar</span>
        </Button>
        
        {viewMode === 'power' && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleHidden}
            title={isHidden ? "Mostrar" : "Ocultar"}
          >
            {isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
            <span className="ml-1">{isHidden ? "Mostrar" : "Ocultar"}</span>
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={onDeleteTask}
          title="Excluir"
          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 size={16} />
        </Button>
      </div>
      
      {/* Right side action: Complete */}
      <Button
        variant="default"
        size="sm"
        onClick={onCompleteTask}
        title="Completar"
        className="bg-green-600 hover:bg-green-700"
      >
        <CheckSquare size={16} />
        <span className="ml-1">Completar</span>
      </Button>
    </div>
  );
};

export default TaskCardActions;
