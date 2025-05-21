
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Task } from '@/types';

interface TaskDetailsHeaderProps {
  task: Task;
}

const TaskDetailsHeader: React.FC<TaskDetailsHeaderProps> = ({ task }) => {
  // Helper para formatação de datas
  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Data não disponível';
    try {
      return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Data inválida';
    }
  };
  
  // Helper para exibição de feedback
  const renderFeedback = () => {
    if (!task.feedback) return null;
    
    const feedbackLabels = {
      transformed: '🤩 Foi transformador terminar',
      relief: '🍃 Tive alívio ao finalizar',
      obligation: '😐 Terminei por obrigação'
    };
    
    const feedbackStyles = {
      transformed: 'text-green-600 dark:text-green-400',
      relief: 'text-blue-600 dark:text-blue-400',
      obligation: 'text-gray-600 dark:text-gray-400'
    };
    
    return (
      <div className="mt-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Feedback:</span>
        <span className={`ml-2 text-sm ${feedbackStyles[task.feedback as keyof typeof feedbackStyles] || ''}`}>
          {feedbackLabels[task.feedback as keyof typeof feedbackLabels] || 'Feedback não disponível'}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Task Title */}
      <div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Título da Tarefa: 
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {task.title}
        </div>
      </div>
      
      {/* Task Dates */}
      <div className="flex flex-col mt-2 space-y-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:space-y-0 space-y-1">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Concluída em: </span>
            <span className=" text-sm text-gray-600 dark:text-gray-400">
              {formatDate(task.completedAt)}
            </span>
          </div>
          {task.idealDate && (
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Data da tarefa: </span>
              <span className=" text-sm text-gray-600 dark:text-gray-400">
                {formatDate(task.idealDate)}
              </span>
            </div>
          )}
        </div>
        
        {/* Feedback Section */}
        {renderFeedback()}
      </div>
    </div>
  );
};

export default TaskDetailsHeader;
