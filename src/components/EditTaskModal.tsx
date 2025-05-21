
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Task, TaskFormData } from '@/types';
import { AlwaysVisibleScrollArea } from '@/components/ui/always-visible-scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TaskFormFields from './TaskFormFields';
import TaskComments from './TaskComments';
import CommentForm from './CommentForm';
import { useComments } from '@/hooks/useComments';
import { useTabNavigation } from '@/context/hooks/useTabNavigation';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, isOpen, onClose }) => {
  // Initialize form data with current task values
  // Note: We're removing the 'description' field as it doesn't exist in the Task type
  const [formData, setFormData] = useState<TaskFormData>({
    title: task.title,
    consequenceScore: task.consequenceScore,
    prideScore: task.prideScore,
    constructionScore: task.constructionScore,
    idealDate: task.idealDate
  });

  const { updateTask } = useTaskDataContext();
  const { activeTab, setActiveTab } = useTabNavigation('levels');
  const isMobile = useIsMobile();
  const commentsContainerRef = useRef<HTMLDivElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  // Use our comments hook to manage comments
  const { 
    comments, 
    isLoading: loadingComments, 
    refreshComments,
    isRefetching
  } = useComments(task.id);
  
  console.log('[EditTaskModal] Rendering for task:', task.id, 'comments:', comments?.length);
  
  // Update form data when task changes
  useEffect(() => {
    setFormData({
      title: task.title,
      consequenceScore: task.consequenceScore,
      prideScore: task.prideScore,
      constructionScore: task.constructionScore,
      idealDate: task.idealDate
    });
  }, [task]);
  
  // Function to save task changes
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!formData.title.trim()) {
      toast({
        id: uuidv4(),
        title: "Erro ao salvar tarefa",
        description: "O título da tarefa não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }
    
    console.log('[EditTaskModal] Saving task:', task.id, 'formData:', formData);
    
    updateTask(task.id, formData);
    toast({
      id: uuidv4(),
      title: "Tarefa atualizada",
      description: "As alterações foram salvas com sucesso.",
    });
    onClose();
  };

  // Handlers for inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setFormData(prev => ({ ...prev, idealDate: null }));
      return;
    }

    // Convert datetime-local string to Date object
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setFormData(prev => ({ ...prev, idealDate: date }));
    } else {
      console.warn('[EditTaskModal] Invalid date:', e.target.value);
    }
  };
  
  // Function to scroll to bottom of comments list
  const scrollToBottom = useCallback(() => {
    if (commentsContainerRef.current) {
      const scrollElement = commentsContainerRef.current.querySelector('.native-scrollbar');
      if (scrollElement) {
        console.log('[EditTaskModal] Scrolling to bottom of comments');
        scrollElement.scrollTop = scrollElement.scrollHeight;
      } else {
        console.log('[EditTaskModal] Scroll element not found');
      }
    } else {
      console.log('[EditTaskModal] Comments container ref not found');
    }
  }, []);
  
  // Scroll to bottom when comments tab is selected or comments change
  useEffect(() => {
    if (activeTab === 'comments' && comments?.length > 0) {
      // Small delay to ensure DOM has updated
      setTimeout(scrollToBottom, 300);
    }
  }, [activeTab, comments?.length, scrollToBottom]);
  
  // Handler for when a comment is added
  const handleCommentAdded = useCallback((): void => {
    console.log('[EditTaskModal] Comment added, updating...');
    
    // Force comments refresh
    refreshComments();
    
    // Try to scroll to bottom immediately and after a delay
    setTimeout(scrollToBottom, 500);
  }, [refreshComments, scrollToBottom]);

  // If not on mobile, focus the title input after the modal is displayed
  // For mobile, we'll completely skip the autofocus to avoid the keyboard popping up
  useEffect(() => {
    if (!isMobile && titleInputRef.current) {
      // Only focus on desktop
      const timer = setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
    // Explicitly not focusing on mobile
  }, [isMobile]);

  // Render the mobile version using Sheet
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[100dvh] p-0 max-w-full">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Editar Tarefa</h2>
            </div>
            
            <div className="flex-1 overflow-auto">
              <div className="px-4 py-4 space-y-6">
                {/* Task title input - removed autoFocus */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Título da Tarefa
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    ref={titleInputRef}
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="O que precisa ser feito?"
                    autoFocus={false}
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
                    <div ref={commentsContainerRef} className="space-y-4">
                      {comments && comments.length > 0 ? (
                        <TaskComments 
                          taskId={task.id} 
                          comments={comments}
                          onCommentDeleted={() => refreshComments()}
                        />
                      ) : (
                        <div className="py-4 text-center text-gray-500 italic">
                          {loadingComments || isRefetching ? "Carregando comentários..." : "Sem comentários para esta tarefa"}
                        </div>
                      )}
                      
                      {/* Comment form component */}
                      <CommentForm 
                        taskId={task.id}
                        onCommentAdded={handleCommentAdded}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div className="p-4 border-t mt-auto flex justify-between">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleSaveTask}
                className="btn-green"
              >
                Salvar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop version
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-3xl sm:max-w-lg md:max-w-2xl lg:max-w-3xl p-0"
        style={{ 
          width: "95vw", 
          maxHeight: "85vh"
        }}
      >
        <DialogHeader className="p-4 sm:p-6 border-b">
          <DialogTitle className="text-xl font-semibold">
            Editar Tarefa
          </DialogTitle>
        </DialogHeader>
        
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
                  ref={titleInputRef}
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
                  <div ref={commentsContainerRef} className="space-y-4">
                    {comments && comments.length > 0 ? (
                      <TaskComments 
                        taskId={task.id} 
                        comments={comments}
                        onCommentDeleted={() => refreshComments()}
                      />
                    ) : (
                      <div className="py-4 text-center text-gray-500 italic">
                        {loadingComments || isRefetching ? "Carregando comentários..." : "Sem comentários para esta tarefa"}
                      </div>
                    )}
                    
                    {/* Comment form component */}
                    <CommentForm 
                      taskId={task.id}
                      onCommentAdded={handleCommentAdded}
                    />
                  </div>
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
            type="button"
            onClick={handleSaveTask}
            className="btn-green"
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskModal;
