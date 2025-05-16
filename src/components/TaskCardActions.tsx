import React from 'react';
import { Eye, EyeOff, Edit2, CheckSquare, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { ViewMode } from '@/types';
import { cn } from '@/lib/utils'; // Assumindo que você use o auxiliar de classe cn

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
  // Estilo base para os botões normais
  const buttonStyles = "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700/50";
  
  // Estilo para o botão de exclusão
  const deleteButtonStyles = "bg-white text-gray-700 border-[#ffcaca] hover:bg-[#fff5f5] dark:bg-gray-800 dark:text-gray-300 dark:border-red-900/30 dark:hover:bg-red-900/20";
  
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
          className={deleteButtonStyles}
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
        className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800"
      >
        <CheckSquare size={16} />
        <span className="ml-1">Completar</span>
      </Button>
    </div>
  );
};

export default TaskCardActions;