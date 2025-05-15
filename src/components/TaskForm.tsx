
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { TaskFormData, Task } from '../types';
import TaskFormTabs from './TaskFormTabs';
import TaskFormActions from './TaskFormActions';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTabNavigation } from '../context/hooks/useTabNavigation';

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
  const { activeTab, setActiveTab } = useTabNavigation('levels');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  // Close only when clicking directly on the backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if the click is directly on the backdrop element
    if (e.target === e.currentTarget) {
      console.log('Backdrop clicked, closing modal');
      onClose();
    } else {
      // This click was on some element inside the modal, don't close
      console.log('Click inside modal, not closing');
    }
  };

  useEffect(() => {
    // Add a global event handler for the Escape key
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('Escape key pressed, closing modal');
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" 
      onClick={handleBackdropClick}
      data-testid="task-form-backdrop"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-lg overflow-hidden"
        onClick={(e) => {
          e.stopPropagation();
          console.log('Modal container clicked, propagation stopped');
        }}
        data-testid="task-form-modal"
      >
        <div 
          className="flex justify-between items-center p-5 border-b"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold">{isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        <ScrollArea className="max-h-[calc(100vh-12rem)]">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit(e);
            }} 
            className="p-5 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {isEditing ? (
              <>
                <div onClick={(e) => e.stopPropagation()}>
                  <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Título da Tarefa
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="O que precisa ser feito?"
                    required
                  />
                </div>
                
                <TaskFormTabs 
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  formData={formData}
                  handleChange={handleChange}
                  handleDateChange={handleDateChange}
                  setFormData={setFormData}
                  taskId={taskId}
                  task={task}
                />
              </>
            ) : (
              // Simple form for new task
              <div onClick={(e) => e.stopPropagation()}>
                <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Título da Tarefa
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="O que precisa ser feito?"
                  required
                />
              </div>
            )}

            <TaskFormActions onClose={onClose} />
          </form>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TaskForm;
