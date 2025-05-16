
import React from 'react';
import { Eye, EyeOff, Edit2, CheckSquare } from 'lucide-react';
import { Button } from './ui/button';

interface TaskCardActionsProps {
  isHidden: boolean;
  onToggleHidden: (e: React.MouseEvent) => void;
  onEditTask: (e: React.MouseEvent) => void;
  onCompleteTask: (e: React.MouseEvent) => void;
  viewMode?: 'power' | 'chronological';
}

const TaskCardActions: React.FC<TaskCardActionsProps> = ({
  isHidden,
  onToggleHidden,
  onEditTask,
  onCompleteTask,
  viewMode = 'power'
}) => {
  return (
    <div className="flex justify-end space-x-2 mt-4">
      {/* Only show the hide/show button in Power mode */}
      {viewMode !== 'chronological' && (
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
        onClick={onEditTask}
        title="Editar"
      >
        <Edit2 size={16} />
        <span className="ml-1">Editar</span>
      </Button>
      
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
