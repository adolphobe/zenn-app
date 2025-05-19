
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Task } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { AlwaysVisibleScrollArea } from '@/components/ui/always-visible-scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

// Importando componentes auxiliares
import TaskDetailsHeader from './details/TaskDetailsHeader';
import TaskLevelsContent from './details/TaskLevelsContent';
import TaskCommentsContent from './details/TaskCommentsContent';

export interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onRestore?: (taskId: string) => void;
  title?: string;
  showRestoreButton?: boolean;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  isOpen,
  onClose,
  onRestore,
  title = "Detalhes da Tarefa",
  showRestoreButton = false
}) => {
  // Estados e refs - IMPORTANTE: hooks ANTES de qualquer condicional
  const [activeTab, setActiveTab] = useState('levels');
  const isMobile = useIsMobile();
  const commentsContainerRef = useRef<HTMLDivElement | null>(null);
  
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
    if (activeTab === 'comments' && task?.comments?.length) {
      // Pequeno delay para garantir que o DOM foi atualizado
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab, task?.comments?.length, scrollToBottom]);

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
                    Comentários
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
                      onCommentAdded={scrollToBottom} 
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
