
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { TaskFormData, Task } from '../types';
import RatingSlider from './RatingSlider';
import TaskScoreDisplay from './TaskScoreDisplay';
import CommentForm from './CommentForm';
import TaskComments from './TaskComments';
import { 
  CONSEQUENCE_PHRASES, 
  PRIDE_PHRASES, 
  CONSTRUCTION_PHRASES 
} from '../constants';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TaskFormProps {
  onClose: () => void;
  initialData?: TaskFormData;
  taskId?: string;
  task?: Task;
  isEditing?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, initialData, taskId, task, isEditing = false }) => {
  const [formData, setFormData] = useState<TaskFormData>(initialData || {
    title: '',
    consequenceScore: 3,
    prideScore: 3,
    constructionScore: 3,
    idealDate: null
  });
  
  const { addTask, updateTask } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      // Show error
      return;
    }
    
    if (taskId) {
      updateTask(taskId, formData);
    } else {
      addTask(formData);
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setFormData(prev => ({ ...prev, idealDate: null }));
      return;
    }

    // Convert local datetime string to Date object
    const date = new Date(e.target.value);
    setFormData(prev => ({ ...prev, idealDate: date }));
  };

  const totalScore = formData.consequenceScore + formData.prideScore + formData.constructionScore;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" 
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-lg overflow-hidden"
           onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold">{isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <ScrollArea className="max-h-[calc(100vh-12rem)]">
          <form onSubmit={handleSubmit} className="p-5 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Título da Tarefa
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="O que precisa ser feito?"
                required
              />
            </div>

            <RatingSlider
              value={formData.consequenceScore}
              onChange={(value) => setFormData(prev => ({ ...prev, consequenceScore: value }))}
              color="blue"
              label="Consequência de Ignorar"
              description={CONSEQUENCE_PHRASES}
            />

            <RatingSlider
              value={formData.prideScore}
              onChange={(value) => setFormData(prev => ({ ...prev, prideScore: value }))}
              color="orange"
              label="Orgulho pós-execução"
              description={PRIDE_PHRASES}
            />

            <RatingSlider
              value={formData.constructionScore}
              onChange={(value) => setFormData(prev => ({ ...prev, constructionScore: value }))}
              color="green"
              label="Força de construção pessoal"
              description={CONSTRUCTION_PHRASES}
            />

            <div>
              <label htmlFor="idealDate" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                A partir de quando você quer se ver envolvido com isso?
              </label>
              <input
                type="datetime-local"
                id="idealDate"
                name="idealDate"
                value={formData.idealDate ? new Date(formData.idealDate.getTime() - (formData.idealDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : ''}
                onChange={handleDateChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="mt-5 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
              <TaskScoreDisplay score={totalScore} />
            </div>

            {/* Comment section - only for editing */}
            {isEditing && taskId && task && (
              <div className="border-t pt-4">
                <CommentForm taskId={taskId} />
                {task.comments && task.comments.length > 0 && (
                  <TaskComments taskId={taskId} comments={task.comments || []} />
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all"
              >
                Salvar
              </button>
            </div>
          </form>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TaskForm;
