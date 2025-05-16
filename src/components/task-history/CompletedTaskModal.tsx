
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task } from '@/types';
import { AlwaysVisibleScrollArea } from '@/components/ui/always-visible-scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskPillarDetails from '@/components/TaskPillarDetails';
import TaskComments from '@/components/TaskComments';
import CommentForm from '@/components/CommentForm';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTabNavigation } from '@/context/hooks/useTabNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Slider } from '@/components/ui/slider';
import { CONSEQUENCE_PHRASES, PRIDE_PHRASES, CONSTRUCTION_PHRASES } from '@/constants';

interface CompletedTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const CompletedTaskModal: React.FC<CompletedTaskModalProps> = ({ task, isOpen, onClose }) => {
  const { activeTab, setActiveTab } = useTabNavigation('levels');
  const isMobile = useIsMobile();
  const commentsContainerRef = React.useRef<HTMLDivElement | null>(null);
  
  const formatDateTime = (date: Date | null | undefined) => {
    if (!date) return '';
    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };
  
  // Format the completion date and time in Brazilian format
  const completedDateTime = task.completedAt 
    ? formatDateTime(new Date(task.completedAt))
    : '-';
  
  // Format the ideal date in Brazilian format
  const idealDate = task.idealDate 
    ? formatDateTime(new Date(task.idealDate))
    : '-';
  
  // Scroll to bottom of comments when tab is changed
  useEffect(() => {
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

  // Render the disabled slider
  const RatingSliderReadOnly = ({ 
    value, 
    color, 
    label, 
    description 
  }: { 
    value: number; 
    color: string; 
    label: string; 
    description: string[];
  }) => {
    const colorClasses = {
      blue: {
        range: "bg-blue-500",
        thumb: "border-blue-500",
      },
      orange: {
        range: "bg-orange-500",
        thumb: "border-orange-500",
      },
      green: {
        range: "bg-green-500",
        thumb: "border-green-500",
      }
    };

    const descriptionText = description[value - 1] || '';

    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-sm">{label}</span>
          <span className="text-sm">{value}/5</span>
        </div>
        <Slider
          value={[value]}
          min={1}
          max={5}
          step={1}
          disabled={true}
          classNames={{
            track: "bg-gray-200",
            range: colorClasses[color as keyof typeof colorClasses]?.range,
            thumb: `cursor-default ${colorClasses[color as keyof typeof colorClasses]?.thumb}`,
          }}
        />
        <p className="text-sm text-gray-500 mt-1">{descriptionText}</p>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`bg-white dark:bg-gray-800 rounded-xl ${isMobile ? 'w-full max-w-lg' : 'w-full max-w-3xl'}`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Tarefa Concluída</DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow overflow-hidden" style={{ maxHeight: isMobile ? '60vh' : '70vh' }}>
          <AlwaysVisibleScrollArea className="h-full">
            <div className="p-5 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Título da Tarefa
                </label>
                <div className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  {task.title}
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 mt-4">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Concluída em:</span>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{completedDateTime}</span>
                  </div>
                  {task.idealDate && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Data da tarefa:</span>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{idealDate}</span>
                    </div>
                  )}
                </div>
                {task.feedback && (
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Feedback:</span>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {task.feedback === 'transformed' && 'Foi transformador terminar'}
                      {task.feedback === 'relief' && 'Tive alívio ao finalizar'}
                      {task.feedback === 'obligation' && 'Terminei por obrigação'}
                    </span>
                  </div>
                )}
              </div>
              
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
                  {isMobile ? (
                    <>
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
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
                          <div className="text-center">
                            <span className="text-3xl font-bold">{task.totalScore}/15</span>
                            <p className="text-sm text-gray-500 mt-1">Pontuação total</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div className="mb-2">
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Avaliação da tarefa:
                          </label>
                        </div>
                        
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
                      
                      <div className="space-y-6 mt-[33px]">
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm p-[34px] rounded-[18px]">
                          <div className="text-center">
                            <span className="text-3xl font-bold">{task.totalScore}/15</span>
                            <p className="text-sm text-gray-500 mt-1">Pontuação total</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="comments">
                  <div ref={commentsContainerRef} className="space-y-4">
                    {task.comments && task.comments.length > 0 && (
                      <TaskComments taskId={task.id} comments={task.comments} />
                    )}
                    <CommentForm 
                      taskId={task.id}
                      onCommentAdded={() => {
                        if (commentsContainerRef.current) {
                          const scrollElement = commentsContainerRef.current.querySelector('.native-scrollbar');
                          if (scrollElement) {
                            scrollElement.scrollTop = scrollElement.scrollHeight;
                          }
                        }
                      }} 
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
