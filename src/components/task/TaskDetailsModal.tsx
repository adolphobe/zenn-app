
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Task, Comment } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { AlwaysVisibleScrollArea } from '@/components/ui/always-visible-scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQueryClient } from '@tanstack/react-query';
import { useComments } from '@/hooks/useComments';

// Importando componentes auxiliares
import TaskDetailsHeader from './details/TaskDetailsHeader';
import TaskLevelsContent from './details/TaskLevelsContent';
import TaskCommentsContent from './details/TaskCommentsContent';

export interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onRestore?: (taskId: string) => void;
  onCommentAdded?: () => void;
  title?: string;
  showRestoreButton?: boolean;
  forceComments?: Comment[]; // New prop to force comments from parent
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  isOpen,
  onClose,
  onRestore,
  onCommentAdded,
  title = "Detalhes da Tarefa",
  showRestoreButton = false,
  forceComments
}) => {
  // Estados e refs - IMPORTANTE: hooks ANTES de qualquer condicional
  const [activeTab, setActiveTab] = useState('levels');
  const isMobile = useIsMobile();
  const commentsContainerRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  
  // Add a direct connection to the comments hook for real-time updates
  const { 
    comments: hookComments, 
    refreshComments 
  } = task?.id ? useComments(task.id) : { 
    comments: [], 
    refreshComments: () => Promise.resolve() 
  };
  
  // Use forced comments if provided, otherwise use hook comments
  const comments = forceComments || hookComments;
  
  // Função para rolagem até o final dos comentários - definida fora de qualquer condicional
  const scrollToBottom = useCallback(() => {
    if (commentsContainerRef.current) {
      const scrollElement = commentsContainerRef.current.querySelector('.native-scrollbar');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, []);

  // Efeito para rolar para o final quando a tab de comentários é selecionada
  useEffect(() => {
    if (activeTab === 'comments' && comments?.length) {
      // Pequeno delay para garantir que o DOM foi atualizado
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab, comments?.length, scrollToBottom]);

  // When the modal is opened or comments change, scroll to bottom if on comments tab
  useEffect(() => {
    if (isOpen && activeTab === 'comments' && comments?.length) {
      console.log('[TaskDetailsModal] Comments changed, scrolling to bottom');
      // Allow DOM to update before scrolling
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, comments, activeTab, scrollToBottom]);

  // When the modal is opened, refresh the comments data
  useEffect(() => {
    if (isOpen && task?.id) {
      // Invalidate queries to refresh data
      console.log('[TaskDetailsModal] Modal opened, refreshing data for task:', task.id);
      queryClient.invalidateQueries({ queryKey: ['comments', task.id] });
      queryClient.invalidateQueries({ queryKey: ['task', task.id] });
      refreshComments();
    }
  }, [isOpen, task?.id, queryClient, refreshComments]);

  // Handler for when a comment is added
  const handleCommentAdded = useCallback(async () => {
    console.log('[TaskDetailsModal] Comment added, refreshing data');
    
    // Force data refresh
    if (task?.id) {
      await queryClient.invalidateQueries({ queryKey: ['comments', task.id] });
      await queryClient.invalidateQueries({ queryKey: ['task', task.id] });
      await refreshComments();
      
      // Call the parent's onCommentAdded if provided
      if (onCommentAdded) {
        onCommentAdded();
      }
      
      // Scroll to bottom after a small delay
      setTimeout(scrollToBottom, 300);
    }
  }, [task?.id, queryClient, refreshComments, scrollToBottom, onCommentAdded]);
  
  // Handler para restaurar tarefa
  const handleRestore = () => {
    if (onRestore && task?.id) {
      onRestore(task.id);
      onClose();
    }
  };
  
  // Se não tiver uma tarefa, renderiza um modal simplificado
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl sm:max-w-lg md:max-w-2xl lg:max-w-3xl p-0"
        style={{ width: "95vw", maxHeight: isMobile ? "90vh" : "85vh" }}
      >
        <DialogHeader className="p-4 sm:p-6">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow overflow-hidden">
          <AlwaysVisibleScrollArea className="h-[calc(90vh-12rem)] sm:h-[calc(85vh-14rem)]">
            <div className="px-4 sm:px-6 py-2 sm:py-4 space-y-6">
              {/* Cabeçalho com informações da tarefa */}
              <TaskDetailsHeader task={task} />
              
              {/* Tabs para níveis e comentários */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="levels">
                    Níveis
                  </TabsTrigger>
                  <TabsTrigger value="comments">
                    Comentários {comments && comments.length > 0 ? `(${comments.length})` : ''}
                  </TabsTrigger>
                </TabsList>
                
                {/* Conteúdo das tabs */}
                <TabsContent value="levels" className="space-y-6">
                  <TaskLevelsContent task={task} isMobile={isMobile} />
                </TabsContent>
                
                <TabsContent value="comments">
                  <div ref={commentsContainerRef}>
                    <TaskCommentsContent 
                      task={task} 
                      onCommentAdded={handleCommentAdded}
                      forceComments={comments}
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
