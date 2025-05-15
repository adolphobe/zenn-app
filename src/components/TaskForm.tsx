
import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { TaskFormData, Task } from '../types';
import TaskFormTabs from './TaskFormTabs';
import TaskFormActions from './TaskFormActions';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTabNavigation } from '../context/hooks/useTabNavigation';
import { useIsMobile } from '../hooks/use-mobile';

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
  const isMobile = useIsMobile();

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

  // Capture mousedown on backdrop to prevent the default click behavior
  const handleBackdropMouseDown = useCallback((e: React.MouseEvent) => {
    // Only close if the click is directly on the backdrop element
    if (e.target === e.currentTarget) {
      console.log('Backdrop clicked directly, will close modal on mouseup');
      
      // Create a function to handle the mouseup event
      const handleMouseUp = (upEvent: MouseEvent) => {
        console.log('Mouse up detected, checking if still on backdrop');
        
        // Get the element under the mouse on mouseup
        const elementUnderMouse = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
        
        // Check if the mouseup is still on the backdrop
        if (elementUnderMouse === e.currentTarget) {
          console.log('Mouse up on backdrop, closing modal');
          onClose();
        } else {
          console.log('Mouse up not on backdrop, modal stays open');
        }
        
        // Remove the listener after handling
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      // Add a one-time mouseup listener to the document
      document.addEventListener('mouseup', handleMouseUp);
    }
  }, [onClose]);
  
  // Prevent all click events from the modal itself from bubbling up
  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Modal container clicked, preventing propagation');
  }, []);

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
      onMouseDown={handleBackdropMouseDown}
      data-testid="task-form-backdrop"
    >
      <div 
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${isMobile ? 'w-full max-w-md' : 'w-full max-w-4xl'}`}
        onClick={handleModalClick}
        onMouseDown={(e) => {
          e.stopPropagation();
          console.log('Preventing mousedown propagation from modal container');
        }}
        data-testid="task-form-modal"
      >
        <div className="flex justify-between items-center p-5 border-b">
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
              isEditing={isEditing}
            />

            <TaskFormActions onClose={onClose} />
          </form>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TaskForm;
