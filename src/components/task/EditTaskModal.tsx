
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Task, TaskFormData } from '@/types';
import { AlwaysVisibleScrollArea } from '@/components/ui/always-visible-scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TaskFormFields from '../TaskFormFields';
import TaskComments from '../TaskComments';
import CommentForm from '../CommentForm';
import { useComments } from '@/hooks/useComments';
import { useTabNavigation } from '@/context/hooks/useTabNavigation';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, isOpen, onClose }) => {
  // Inicializar form data com a tarefa atual
  const [formData, setFormData] = useState<TaskFormData>({
    title: task.title,
    description: task.description || '',
    consequenceScore: task.consequenceScore,
    prideScore: task.prideScore,
    constructionScore: task.constructionScore,
    idealDate: task.idealDate
  });

  const { updateTask } = useTaskDataContext();
  const { activeTab, setActiveTab } = useTabNavigation('levels');
  const isMobile = useIsMobile();
  const commentsContainerRef = useRef<HTMLDivElement | null>(null);
  
  // Use our comments hook para gerenciar comentários
  const { 
    comments, 
    isLoading: loadingComments, 
    refreshComments,
    isRefetching
  } = useComments(task.id);
  
  console.log('[EditTaskModal] Renderizando para task:', task.id, 'comments:', comments?.length);
  
  // Atualizar form data quando a tarefa mudar
  useEffect(() => {
    setFormData({
      title: task.title,
      description: task.description || '',
      consequenceScore: task.consequenceScore,
      prideScore: task.prideScore,
      constructionScore: task.constructionScore,
      idealDate: task.idealDate
    });
  }, [task]);
  
  // Função para salvar as alterações da tarefa
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
    
    console.log('[EditTaskModal] Salvando tarefa:', task.id, 'formData:', formData);
    
    updateTask(task.id, formData);
    toast({
      id: uuidv4(),
      title: "Tarefa atualizada",
      description: "As alterações foram salvas com sucesso.",
    });
    onClose();
  };

  // Handlers para inputs
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
      console.warn('[EditTaskModal] Data inválida:', e.target.value);
    }
  };
  
  // Função para rolar para o final da lista de comentários
  const scrollToBottom = useCallback(() => {
    if (commentsContainerRef.current) {
      const scrollElement = commentsContainerRef.current.querySelector('.native-scrollbar');
      if (scrollElement) {
        console.log('[EditTaskModal] Rolando para o final dos comentários');
        scrollElement.scrollTop = scrollElement.scrollHeight;
      } else {
        console.log('[EditTaskModal] Elemento de rolagem não encontrado');
      }
    } else {
      console.log('[EditTaskModal] Ref do container de comentários não encontrada');
    }
  }, []);
  
  // Rolar para o final quando a aba de comentários é selecionada ou quando os comentários mudam
  useEffect(() => {
    if (activeTab === 'comments' && comments?.length > 0) {
      // Pequeno atraso para garantir que o DOM foi atualizado
      setTimeout(scrollToBottom, 300);
    }
  }, [activeTab, comments?.length, scrollToBottom]);
  
  // Handler para quando um comentário é adicionado
  const handleCommentAdded = useCallback((): void => {
    console.log('[EditTaskModal] Comentário adicionado, atualizando...');
    
    // Forçar atualização dos comentários
    refreshComments();
    
    // Tentar rolar para o final imediatamente e novamente após um atraso
    setTimeout(scrollToBottom, 500);
  }, [refreshComments, scrollToBottom]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-3xl sm:max-w-lg md:max-w-2xl lg:max-w-3xl p-0"
        style={{ 
          width: "95vw", 
          maxHeight: isMobile ? "90vh" : "85vh"
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
              {/* Input do título da tarefa */}
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
              
              {/* Tabs para níveis e comentários */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="levels" data-testid="levels-tab">
                    Níveis
                  </TabsTrigger>
                  <TabsTrigger value="comments" data-testid="comments-tab">
                    Comentários {comments && comments.length > 0 ? `(${comments.length})` : ''}
                  </TabsTrigger>
                </TabsList>
                
                {/* Conteúdo da aba de níveis */}
                <TabsContent value="levels" className="space-y-6">
                  <TaskFormFields 
                    formData={formData} 
                    handleChange={handleChange} 
                    handleDateChange={handleDateChange} 
                    setFormData={setFormData} 
                  />
                </TabsContent>
                
                {/* Conteúdo da aba de comentários */}
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
                    
                    {/* Formulário de comentários separado da lógica de salvar a tarefa */}
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
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskModal;
