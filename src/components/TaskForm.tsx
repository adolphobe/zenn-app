
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Task } from '../types';
import { TaskFormData } from '../types';
import { X } from 'lucide-react';
import { AlwaysVisibleScrollArea } from '@/components/ui/always-visible-scroll-area';
import { useTabNavigation } from '../context/hooks/useTabNavigation';
import { useIsMobile } from '../hooks/use-mobile';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { dateService } from '@/services/dateService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useQueryClient } from '@tanstack/react-query';

// Import our components
import TaskFormFields from './TaskFormFields';
import TaskComments from './TaskComments';
import CommentForm from './CommentForm';
import { useComments } from '@/hooks/useComments';

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
  const commentsContainerRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  
  // Use our comments hook to fetch and manage comments
  const { 
    comments, 
    isLoading: loadingComments, 
    refreshComments,
    isRefetching,
    addComment: submitComment
  } = useComments(taskId || '');

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
  
  // Function to scroll to the bottom of the comments list
  const scrollToBottom = useCallback(() => {
    if (commentsContainerRef.current) {
      const scrollElement = commentsContainerRef.current.querySelector('.native-scrollbar');
      if (scrollElement) {
        console.log('[TaskForm] Scrolling to bottom of comments');
        scrollElement.scrollTop = scrollElement.scrollHeight;
      } else {
        console.log('[TaskForm] Native scrollbar element not found');
      }
    } else {
      console.log('[TaskForm] Comments container ref not found');
    }
  }, []);
  
  // Effect to scroll to the bottom when the comments tab is selected or comments change
  useEffect(() => {
    if (activeTab === 'comments' && comments?.length) {
      // Small delay to ensure the DOM has been updated
      setTimeout(scrollToBottom, 100);
    }
  }, [activeTab, comments?.length, scrollToBottom]);
  
  // Handler for when a comment is added
  const handleCommentAdded = useCallback((): void => {
    console.log('[TaskForm] Comment added callback triggered');
    refreshComments();
    // Try to scroll to bottom immediately and again after a delay
    setTimeout(scrollToBottom, 300);
  }, [refreshComments, scrollToBottom]);
  
  // Simplified content when creating a new task
  if (!isEditing && !taskId) {
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
              Nova Tarefa
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
                
                <TaskFormFields 
                  formData={formData} 
                  handleChange={handleChange} 
                  handleDateChange={handleDateChange} 
                  setFormData={setFormData} 
                />
                
                <div className="pt-4 sm:pt-6 flex justify-end space-x-3">
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                  >
                    Salvar
                  </Button>
                </div>
              </form>
            </AlwaysVisibleScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Full version for editing an existing task
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
        
        <form onSubmit={handleSubmit}>
          <div className="flex-grow overflow-hidden">
            <AlwaysVisibleScrollArea className="h-[calc(85vh-12rem)] sm:h-[calc(85vh-14rem)]">
              <div className="px-4 sm:px-6 py-2 sm:py-4 space-y-6">
                {/* Task title input */}
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
                
                {/* Tabs for levels and comments */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="levels" data-testid="levels-tab">
                      Níveis
                    </TabsTrigger>
                    <TabsTrigger value="comments" data-testid="comments-tab">
                      Comentários {comments && comments.length > 0 ? `(${comments.length})` : ''}
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Levels tab content */}
                  <TabsContent value="levels" className="space-y-6">
                    <TaskFormFields 
                      formData={formData} 
                      handleChange={handleChange} 
                      handleDateChange={handleDateChange} 
                      setFormData={setFormData} 
                    />
                  </TabsContent>
                  
                  {/* Comments tab content */}
                  <TabsContent value="comments">
                    {taskId ? (
                      <div ref={commentsContainerRef} className="space-y-4">
                        {comments && comments.length > 0 ? (
                          <TaskComments 
                            taskId={taskId} 
                            comments={comments}
                            onCommentDeleted={() => refreshComments()}
                          />
                        ) : (
                          <div className="py-4 text-center text-gray-500 italic">
                            {loadingComments || isRefetching ? "Carregando comentários..." : "Sem comentários para esta tarefa"}
                          </div>
                        )}
                        
                        <CommentForm 
                          taskId={taskId}
                          onCommentAdded={handleCommentAdded}
                        />
                      </div>
                    ) : (
                      <div className="text-gray-500 italic">Salve a tarefa primeiro para adicionar comentários</div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </AlwaysVisibleScrollArea>
          </div>
          
          <DialogFooter className="p-4 sm:p-6 border-t">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="mr-2"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
               className="btn-green"
            >
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
