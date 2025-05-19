
import React, { useState, useEffect, useRef } from 'react';
import { Task } from '@/types';
import { AlwaysVisibleScrollArea } from '@/components/ui/always-visible-scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

// Import our components
import TaskDetails from './TaskDetails';
import TaskLevelsContent from './TaskLevelsContent';
import CommentsContent from './CommentsContent';

interface CompletedTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

const CompletedTaskModal: React.FC<CompletedTaskModalProps> = ({ task, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('levels');
  const isMobile = useIsMobile();
  const commentsContainerRef = useRef<HTMLDivElement | null>(null);
  
  // Se não tiver uma tarefa, não renderiza o conteúdo interno
  if (!task) return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-800 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Tarefa Concluída</DialogTitle>
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
  
  // Função para rolagem até o final dos comentários
  const scrollToBottomOfComments = () => {
    if (commentsContainerRef.current) {
      const scrollElement = commentsContainerRef.current.querySelector('.native-scrollbar');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };
  
  // Scroll to bottom of comments when tab is changed
  useEffect(() => {
    if (activeTab === 'comments' && task?.comments?.length) {
      // Small delay to ensure DOM has updated
      const timer = setTimeout(scrollToBottomOfComments, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab, task?.comments?.length]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`bg-white dark:bg-gray-800 rounded-xl ${isMobile ? 'w-full max-w-lg' : 'w-full max-w-3xl'}`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Tarefa Concluída</DialogTitle>
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
                      onCommentAdded={scrollToBottomOfComments} 
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex justify-end">
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

export default CompletedTaskModal;
