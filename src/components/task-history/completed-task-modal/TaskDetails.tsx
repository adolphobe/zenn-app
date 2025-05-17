
import React from 'react';
import { Task } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskDetailsProps {
  task: Task;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
  const formatDateTime = (date: Date | null | undefined) => {
    if (!date) return '';
    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };
  
  // Format the completion date and time in Brazilian format
  const completedDateTime = task.completedAt 
    ? formatDateTime(new Date(task.completedAt))
    : '-';
  
  // Format the ideal date in Brazilian format
  const idealDate = task.idealDate 
    ? formatDateTime(new Date(task.idealDate))
    : '-';

  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Título da Tarefa
        </label>
        <div className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          {task.title}
        </div>
      </div>
      
      <div className="flex flex-col space-y-2 mt-4">
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div className="mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Concluída em:</span>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{completedDateTime}</span>
          </div>
          {task.idealDate && (
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Data da tarefa:</span>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{idealDate}</span>
            </div>
          )}
        </div>
        {task.feedback && (
          <div className="mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Feedback:</span>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {task.feedback === 'transformed' && 'Foi transformador terminar'}
              {task.feedback === 'relief' && 'Tive alívio ao finalizar'}
              {task.feedback === 'obligation' && 'Terminei por obrigação'}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default TaskDetails;
