
import React, { useState, useCallback, useEffect } from 'react';
import { Task } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { AlwaysVisibleScrollArea } from '@/components/ui/always-visible-scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import RatingSliderReadOnly from '@/components/RatingSliderReadOnly';
import { CONSEQUENCE_PHRASES, PRIDE_PHRASES, CONSTRUCTION_PHRASES } from '@/constants';
import TaskComments from '@/components/TaskComments';
import CommentForm from '@/components/CommentForm';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskViewModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (taskId: string) => void;
}

const TaskViewModal: React.FC<TaskViewModalProps> = ({ 
  task, 
  isOpen, 
  onClose,
  onRestore
}) => {
  // Local state for tabs
  const [activeTab, setActiveTab] = useState('levels');
  const isMobile = useIsMobile();
  const commentsContainerRef = React.useRef<HTMLDivElement | null>(null);

  // Early return if no task
  if (!task) return null;
  
  // Helper function to restore task
  const handleRestore = () => {
    if (task && task.id) {
      onRestore(task.id);
      onClose();
    }
  };
  
  // Helper for formatting dates
  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Data não disponível';
    try {
      return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Data inválida';
    }
  };

  // Helper for scrolling to bottom of comments
  const scrollToBottom = useCallback(() => {
    if (commentsContainerRef.current) {
      const scrollElement = commentsContainerRef.current.querySelector('.native-scrollbar');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, []);
  
  // Effect to scroll to bottom when tab changes to comments or when comments are added
  useEffect(() => {
    if (activeTab === 'comments' && task?.comments?.length) {
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab, task.comments?.length, scrollToBottom]);

  // Feedback display helper
  const renderFeedback = () => {
    if (!task.feedback) return null;
    
    const feedbackLabels = {
      transformed: 'Foi transformador terminar',
      relief: 'Tive alívio ao finalizar',
      obligation: 'Terminei por obrigação'
    };
    
    const feedbackStyles = {
      transformed: 'text-green-600 dark:text-green-400',
      relief: 'text-blue-600 dark:text-blue-400',
      obligation: 'text-amber-600 dark:text-amber-400'
    };
    
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mt-4">
        <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Feedback</h3>
        <div className="text-gray-600 dark:text-gray-300 px-2 py-1">
          <span className={`font-medium ${feedbackStyles[task.feedback as keyof typeof feedbackStyles] || ''}`}>
            {feedbackLabels[task.feedback as keyof typeof feedbackLabels] || 'Feedback não disponível'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`bg-white dark:bg-gray-800 rounded-xl ${isMobile ? 'w-full max-w-lg' : 'w-full max-w-3xl'}`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Detalhes da Tarefa</DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow overflow-hidden" style={{ maxHeight: isMobile ? '60vh' : '70vh' }}>
          <AlwaysVisibleScrollArea className="h-full">
            <div className="p-5 space-y-6">
              {/* Task Title */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Título da Tarefa
                </label>
                <div className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  {task.title}
                </div>
              </div>
              
              {/* Task Dates */}
              <div className="flex flex-col space-y-2 mt-4">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Concluída em:</span>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(task.completedAt)}
                    </span>
                  </div>
                  {task.idealDate && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Data da tarefa:</span>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(task.idealDate)}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Feedback Section */}
                {renderFeedback()}
              </div>
              
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
                
                {/* Levels Tab Content */}
                <TabsContent value="levels" className="space-y-6">
                  {isMobile ? (
                    <div className="space-y-6">
                      <RatingSliderReadOnly
                        value={task.consequenceScore}
                        color="blue"
                        label="Risco"
                        description={CONSEQUENCE_PHRASES}
                      />
                      
                      <RatingSliderReadOnly
                        value={task.prideScore}
                        color="orange"
                        label="Orgulho"
                        description={PRIDE_PHRASES}
                      />
                      
                      <RatingSliderReadOnly
                        value={task.constructionScore}
                        color="green"
                        label="Crescimento pessoal"
                        description={CONSTRUCTION_PHRASES}
                      />
                      
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm mt-6">
                        <div className="text-center">
                          <span className="text-3xl font-bold">{task.totalScore || 0}/15</span>
                          <p className="text-sm text-gray-500 mt-1">Pontuação total</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <RatingSliderReadOnly
                          value={task.consequenceScore}
                          color="blue"
                          label="Risco"
                          description={CONSEQUENCE_PHRASES}
                        />
                        
                        <RatingSliderReadOnly
                          value={task.prideScore}
                          color="orange"
                          label="Orgulho"
                          description={PRIDE_PHRASES}
                        />
                        
                        <RatingSliderReadOnly
                          value={task.constructionScore}
                          color="green"
                          label="Crescimento pessoal"
                          description={CONSTRUCTION_PHRASES}
                        />
                      </div>
                      
                      <div className="space-y-6">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm mt-[33px]">
                          <div className="text-center">
                            <span className="text-3xl font-bold">{task.totalScore || 0}/15</span>
                            <p className="text-sm text-gray-500 mt-1">Pontuação total</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                {/* Comments Tab Content */}
                <TabsContent value="comments">
                  <div ref={commentsContainerRef}>
                    {task.comments && task.comments.length > 0 ? (
                      <div className="space-y-4">
                        <TaskComments taskId={task.id} comments={task.comments} />
                        <CommentForm taskId={task.id} onCommentAdded={scrollToBottom} />
                      </div>
                    ) : (
                      <div className="text-center p-6 text-gray-500">
                        <p>Nenhum comentário para esta tarefa.</p>
                        <CommentForm taskId={task.id} onCommentAdded={scrollToBottom} />
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </AlwaysVisibleScrollArea>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleRestore}
            className="flex items-center gap-1.5"
          >
            <RefreshCw size={16} />
            Restaurar tarefa
          </Button>
          
          <Button onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskViewModal;
