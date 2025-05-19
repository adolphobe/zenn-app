
import React from 'react';
import { Task } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlwaysVisibleScrollArea } from '@/components/ui/always-visible-scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

// Re-use existing components
import TaskDetails from '@/components/task-history/completed-task-modal/TaskDetails';
import TaskLevelsContent from '@/components/task-history/completed-task-modal/TaskLevelsContent';
import CommentsContent from '@/components/task-history/completed-task-modal/CommentsContent';

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (taskId: string) => void;
}

export const TaskModal = ({ task, isOpen, onClose, onRestore }: TaskModalProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = React.useState('levels');
  const commentsContainerRef = React.useRef<HTMLDivElement | null>(null);

  // If no task is provided, don't render
  if (!task) return null;
  
  // Handle comments scrolling when tab changes
  React.useEffect(() => {
    if (activeTab === 'comments' && task?.comments?.length) {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        if (commentsContainerRef.current) {
          const scrollElement = commentsContainerRef.current.querySelector('.native-scrollbar');
          if (scrollElement) {
            scrollElement.scrollTop = scrollElement.scrollHeight;
          }
        }
      }, 100);
    }
  }, [activeTab, task?.comments?.length]);

  // Handler for comments added
  const handleCommentAdded = () => {
    if (commentsContainerRef.current) {
      const scrollElement = commentsContainerRef.current.querySelector('.native-scrollbar');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  const handleRestore = () => {
    onRestore(task.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`bg-white dark:bg-gray-800 rounded-xl ${isMobile ? 'w-full max-w-lg' : 'w-full max-w-3xl'}`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Visualizar Tarefa</DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow overflow-hidden" style={{ maxHeight: isMobile ? '60vh' : '70vh' }}>
          <AlwaysVisibleScrollArea className="h-full">
            <div className="p-5 space-y-6">
              <TaskDetails task={task} />
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="levels" data-testid="levels-tab">
                    Níveis
                  </TabsTrigger>
                  <TabsTrigger value="comments" data-testid="comments-tab">
                    Comentários
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="levels" className="space-y-6">
                  <TaskLevelsContent task={task} isMobile={isMobile} />
                </TabsContent>
                
                <TabsContent value="comments">
                  <div ref={commentsContainerRef}>
                    <CommentsContent 
                      task={task} 
                      onCommentAdded={handleCommentAdded} 
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleRestore}
                  className="px-5 py-2.5 text-sm font-medium flex items-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                    <path d="M3 3v5h5"></path>
                  </svg>
                  Restaurar tarefa
                </Button>
                
                <Button
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-medium"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </AlwaysVisibleScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
