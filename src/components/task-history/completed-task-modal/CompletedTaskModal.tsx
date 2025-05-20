
import React, { useState, useEffect, useRef } from 'react';
import { Task } from '@/types';
import { AlwaysVisibleScrollArea } from '@/components/ui/always-visible-scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';

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
      <DialogContent className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
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

  // For mobile devices, use Sheet instead of Dialog
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[100dvh] p-0 max-w-full">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <h2 className="text-xl font-semibold">Tarefa Concluída</h2>
            </div>
            
            <div className="overflow-auto flex-1">
              <div className="p-4 space-y-6">
                <TaskDetails task={task} />
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="levels" data-testid="levels-tab" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      Níveis
                    </TabsTrigger>
                    <TabsTrigger value="comments" data-testid="comments-tab" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
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
              </div>
            </div>
            
            <div className="p-4 border-t mt-auto">
              <Button 
                onClick={onClose} 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                Fechar
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
        className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl sm:max-w-lg md:max-w-2xl lg:max-w-3xl p-0"
        style={{ width: "95vw", maxHeight: isMobile ? "90vh" : "85vh" }}
      >
        <DialogHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <DialogTitle className="text-xl font-semibold">Tarefa Concluída</DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow overflow-hidden">
          <AlwaysVisibleScrollArea className="h-[calc(90vh-12rem)] sm:h-[calc(85vh-14rem)]">
            <div className="px-4 sm:px-6 py-2 sm:py-4 space-y-6">
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
            </div>
          </AlwaysVisibleScrollArea>
        </div>
        
        <DialogFooter className="p-4 sm:p-6 border-t">
          <Button onClick={onClose} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompletedTaskModal;
