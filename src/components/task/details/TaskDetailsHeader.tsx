
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
      transformed: 'Foi transformador terminar',
      relief: 'Tive alívio ao finalizar',
      obligation: 'Terminei por obrigação'
    };
    
    const feedbackStyles = {
      transformed: 'text-green-600 dark:text-green-400',
      relief: 'text-blue-600 dark:text-blue-400',
      obligation: 'text-amber-600 dark:text-amber-400'
    };
    
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mt-4">
        <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Feedback</h3>
        <div className="text-gray-600 dark:text-gray-300 px-2 py-1">
          <span className={`font-medium ${feedbackStyles[task.feedback as keyof typeof feedbackStyles] || ''}`}>
            {feedbackLabels[task.feedback as keyof typeof feedbackLabels] || 'Feedback não disponível'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Task Title */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Título da Tarefa
        </label>
        <div className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          {task.title}
        </div>
      </div>
      
      {/* Task Dates */}
      <div className="flex flex-col space-y-2 mt-4">
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div className="mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Concluída em:</span>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {formatDate(task.completedAt)}
            </span>
          </div>
          {task.idealDate && (
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Data da tarefa:</span>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
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
