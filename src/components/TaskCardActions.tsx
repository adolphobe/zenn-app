
import React from 'react';
import { Button } from './ui/button';
import { EyeOff, CheckCircle } from 'lucide-react';

interface TaskCardActionsProps {
  isHidden: boolean;
  onToggleHidden: (e: React.MouseEvent) => void;
  onCompleteTask: (e: React.MouseEvent) => void;
}

const TaskCardActions: React.FC<TaskCardActionsProps> = ({ 
  isHidden, 
  onToggleHidden, 
  onCompleteTask 
}) => {
  return (
    <div className="flex gap-2 mt-4 justify-start">
      <Button 
        variant="outline"
        size="sm"
        className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
        onClick={onToggleHidden}
      >
        <EyeOff size={14} />
        {isHidden ? 'Mostrar' : 'Ocultar'}
      </Button>
      <Button 
        variant="outline"
        size="sm"
        className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
        onClick={onCompleteTask}
      >
        <CheckCircle size={14} />
        Concluir
      </Button>
    </div>
  );
};

export default TaskCardActions;
