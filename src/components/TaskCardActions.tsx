
import React from 'react';
import { Eye, EyeOff, Edit2, CheckSquare, Trash2, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { ViewMode } from '@/types';

interface TaskCardActionsProps {
  isHidden: boolean;
  onToggleHidden: (e: React.MouseEvent) => void;
  onEditTask: (e: React.MouseEvent) => void;
  onCompleteTask: (e: React.MouseEvent) => void;
  onDeleteTask: (e: React.MouseEvent) => void;
  onTogglePowerExtra?: (e: React.MouseEvent) => void;
  isPowerExtra?: boolean;
  showPowerExtraButton?: boolean;
  viewMode?: ViewMode;
}

const TaskCardActions: React.FC<TaskCardActionsProps> = ({
  isHidden,
  onToggleHidden,
  onEditTask,
  onCompleteTask,
  onDeleteTask,
  onTogglePowerExtra,
  isPowerExtra = false,
  showPowerExtraButton = false,
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
            className={`${buttonStyles} ${isHidden ? 'border-green-200 hover:border-green-300 hover:bg-green-50 dark:border-green-900 dark:hover:border-green-800' : ''} transition-colors duration-200`}
            data-task-action="toggle-hidden"
            data-hidden={isHidden ? "true" : "false"}
          >
            {isHidden ? <Eye size={16} className="text-green-600" /> : <EyeOff size={16} />}
            <span className="ml-1">{isHidden ? "Mostrar" : "Ocultar"}</span>
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={onDeleteTask}
          title="Excluir"
          className={`
            ${buttonStyles} 
            btn-red-lixeira
          `}
        >
          <Trash2 size={16} />
        </Button>

        {/* Botão Potência Extra - apenas visível no modo potência e para tarefas com pontuação alta */}
        {viewMode === 'power' && showPowerExtraButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePowerExtra}
            title={isPowerExtra ? "Desativar Potência Extra" : "Ativar Potência Extra"}
            className={`
              ${buttonStyles} 
              ${isPowerExtra ? 'bg-red-50 text-red-600 border-red-300 hover:bg-red-100' : ''}
              transition-colors duration-200
            `}
            data-task-action="toggle-power-extra"
            data-power-extra={isPowerExtra ? "true" : "false"}
          >
            <Zap size={16} className={isPowerExtra ? "text-red-600" : ""} />
            <span className="ml-1">{isPowerExtra ? "Desativar" : "Potência Extra"}</span>
          </Button>
        )}
      </div>
      
      {/* Right side action: Complete */}
      <Button
        variant="outline"
        size="sm"
        onClick={onCompleteTask}
        title="Completar"
        className="btn-green"
      >
        <CheckSquare size={16} />
        <span className="ml-1">Completar</span>
      </Button>
    </div>
  );
};

export default TaskCardActions;
