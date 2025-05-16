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
  // Estilo base para todos os botões de ação (excluindo o de completar)
  const buttonStyles = "bg-white text-gray-700 hover:text-gray-900 border-gray-200 hover:bg-gray-50 hover:border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-750 dark:hover:border-gray-600";
  
  return (
    <div className="flex justify-between space-x-2 mt-4">
      {/* Left side actions: Edit, Hide, Delete */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onEditTask}
          title="Editar"
          className={buttonStyles}
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
            className={buttonStyles}
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
          className={buttonStyles}
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
        className="bg-green-600 text-white hover:bg-green-700 hover:text-white dark:bg-green-700 dark:hover:bg-green-600 dark:text-white dark:hover:text-white"
      >
        <CheckSquare size={16} />
        <span className="ml-1">Completar</span>
      </Button>
    </div>
  );
};

export default TaskCardActions;