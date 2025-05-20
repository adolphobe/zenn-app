
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Task } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';
import { AlwaysVisibleScrollArea } from '@/components/ui/always-visible-scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQueryClient } from '@tanstack/react-query';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

// Importing helper components
import TaskDetailsHeader from './details/TaskDetailsHeader';
import TaskLevelsContent from './details/TaskLevelsContent';
import TaskCommentsContent from './details/TaskCommentsContent';

export interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onRestore?: (task: Task) => void;
  onCommentAdded?: () => void;
  title?: string;
  showRestoreButton?: boolean;
  isFullScreen?: boolean;
  className?: string;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  isOpen,
  onClose,
  onRestore,
  onCommentAdded,
  title = "Detalhes da Tarefa",
  showRestoreButton = false,
  isFullScreen = false,
  className
}) => {
  // States and refs - IMPORTANT: hooks BEFORE any conditional
  const [activeTab, setActiveTab] = useState('levels');
  const isMobile = useIsMobile();
  const commentsContainerRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  
  // Function to scroll to the bottom of comments - defined outside of any conditional
  const scrollToBottom = useCallback(() => {
    if (commentsContainerRef.current) {
      const scrollElement = commentsContainerRef.current.querySelector('.native-scrollbar');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, []);

  // Effect to scroll to bottom when comments tab is selected
  useEffect(() => {
    if (isOpen && activeTab === 'comments' && task?.id) {
      // Small delay to ensure the DOM has updated
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab, isOpen, task?.id, scrollToBottom]);
  
  // When the modal is opened, refresh the data
  useEffect(() => {
    if (isOpen && task?.id) {
      // Invalidate queries to refresh data
      console.log('[TaskDetailsModal] Modal opened, refreshing data for task:', task.id);
      queryClient.invalidateQueries({ queryKey: ['comments', task.id] });
      queryClient.invalidateQueries({ queryKey: ['task', task.id] });
    }
  }, [isOpen, task?.id, queryClient]);

  // Handler for when a comment is added
  const handleCommentAdded = useCallback(async () => {
    // Force data refresh
    if (task?.id) {
      console.log('[TaskDetailsModal] Comment added, refreshing data');
      await queryClient.invalidateQueries({ queryKey: ['comments', task.id] });
      await queryClient.invalidateQueries({ queryKey: ['task', task.id] });
      
      // Call the parent's onCommentAdded if provided
      if (onCommentAdded) {
        onCommentAdded();
      }
      
      // Scroll to bottom after a small delay
      setTimeout(scrollToBottom, 300);
    }
  }, [task?.id, queryClient, scrollToBottom, onCommentAdded]);
  
  // Handler for restore task
  const handleRestore = () => {
    if (onRestore && task) {
      onRestore(task);
      onClose();
    }
  };
  
  // If no task, render a simplified modal
  if (!task) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-center text-muted-foreground">Não foi possível carregar os detalhes da tarefa.</p>
            <div className="mt-6 flex justify-end">
              <Button onClick={onClose}>Fechar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Mobile fullscreen view using Drawer component
  if (isFullScreen) {
    return (
      <Drawer 
        open={isOpen} 
        onOpenChange={onClose} 
        direction="bottom" 
        className={cn("h-[100dvh] p-0 max-w-full z-[100]", className)}
      >
        <DrawerContent className="h-[100dvh] max-h-[100dvh] p-0">
          <div className="flex flex-col h-full">
            <div className="border-b flex items-center justify-between sticky top-0 bg-background z-10 py-3 px-4 pt-[30px]">
              <h2 className="text-xl font-semibold">{title}</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={20} />
              </Button>
            </div>
            
            <div className="overflow-auto flex-grow">
              <div className="space-y-6 pt-3">
                {/* Header with task information */}
                <TaskDetailsHeader task={task} />
                
                {/* Tabs for levels and comments */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="levels">
                      Níveis
                    </TabsTrigger>
                    <TabsTrigger value="comments">
                      Comentários
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Tab contents */}
                  <TabsContent value="levels" className="space-y-6">
                    <TaskLevelsContent task={task} isMobile={isMobile} />
                  </TabsContent>
                  
                  <TabsContent value="comments">
                    <div ref={commentsContainerRef}>
                      <TaskCommentsContent 
                        task={task} 
                        onCommentAdded={handleCommentAdded} 
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div className="p-4 border-t mt-auto flex justify-between">
              {showRestoreButton && onRestore && (
                <Button
                  variant="outline"
                  onClick={handleRestore}
                  className="flex items-center gap-1.5"
                >
                  <RefreshCw size={16} />
                  Restaurar tarefa
                </Button>
              )}
              
              <Button onClick={onClose} className="ml-auto">
                Fechar
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop version
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn("bg-white dark:bg-gray-800 rounded-xl max-w-3xl sm:max-w-lg md:max-w-2xl lg:max-w-3xl p-0", className)}
        style={{ width: "95vw", maxHeight: isMobile ? "90vh" : "85vh" }}
      >
        <DialogHeader className="p-4 sm:p-6">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow overflow-hidden">
          <AlwaysVisibleScrollArea className="h-[calc(90vh-12rem)] sm:h-[calc(85vh-14rem)]">
            <div className="px-4 sm:px-6 py-2 sm:py-4 space-y-6">
              {/* Header with task information */}
              <TaskDetailsHeader task={task} />
              
              {/* Tabs for levels and comments */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="levels">
                    Níveis
                  </TabsTrigger>
                  <TabsTrigger value="comments">
                    Comentários
                  </TabsTrigger>
                </TabsList>
                
                {/* Tab contents */}
                <TabsContent value="levels" className="space-y-6">
                  <TaskLevelsContent task={task} isMobile={isMobile} />
                </TabsContent>
                
                <TabsContent value="comments">
                  <div ref={commentsContainerRef}>
                    <TaskCommentsContent 
                      task={task} 
                      onCommentAdded={handleCommentAdded} 
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </AlwaysVisibleScrollArea>
        </div>
        
        <DialogFooter className="flex items-center justify-between p-4 sm:p-6 border-t">
          {showRestoreButton && onRestore && (
            <Button
              variant="outline"
              onClick={handleRestore}
              className="flex items-center gap-1.5"
            >
              <RefreshCw size={16} />
              Restaurar tarefa
            </Button>
          )}
          
          <Button onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsModal;
