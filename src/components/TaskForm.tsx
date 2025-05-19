
import React, { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import { TaskFormData } from '../types';
import TaskFormTabs from './TaskFormTabs';
import TaskFormActions from './TaskFormActions';
import { X } from 'lucide-react';
import { AlwaysVisibleScrollArea } from '@/components/ui/always-visible-scroll-area';
import { useTabNavigation } from '../context/hooks/useTabNavigation';
import { useIsMobile } from '../hooks/use-mobile';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { dateService } from '@/services/dateService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
    description: '',
    consequenceScore: 3,
    prideScore: 3,
    constructionScore: 3,
    idealDate: null
  });
  
  // Log component rendering with props
  console.log('[TaskForm] Render with props:', { initialData, taskId, isEditing });
  
  const { addTask, updateTask } = useTaskDataContext();
  const { activeTab, setActiveTab } = useTabNavigation('levels');
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!formData.title.trim()) {
      // Show error
      return;
    }
    
    console.log('[TaskForm] Submitting task form. taskId:', taskId, 'formData:', formData);
    
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

    // Converter string datetime-local para objeto Date
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setFormData(prev => ({ ...prev, idealDate: date }));
    } else {
      console.warn('[TaskForm] Invalid date provided:', e.target.value);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent 
        className="max-w-3xl sm:max-w-lg md:max-w-2xl lg:max-w-3xl p-0"
        style={{ 
          width: "95vw", 
          maxHeight: isMobile ? "90vh" : "85vh"
        }}
      >
        <DialogHeader className="p-4 sm:p-6 border-b">
          <DialogTitle className="text-xl font-semibold">
            {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow overflow-hidden">
          <AlwaysVisibleScrollArea className="h-[calc(85vh-8rem)] sm:h-[calc(85vh-10rem)]">
            <form 
              onSubmit={handleSubmit} 
              className="p-4 sm:p-6 space-y-5"
            >
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
          </AlwaysVisibleScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
