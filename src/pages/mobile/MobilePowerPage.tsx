
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { useExpandedTask } from '@/context/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/TaskCard';
import { Plus, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import TaskForm from '@/components/TaskForm';
import { sortTasks } from '@/utils';
import { toast } from '@/hooks/use-toast';

const MobilePowerPage: React.FC = () => {
  const { state } = useAppContext();
  const { viewMode, showHiddenTasks, sortOptions, syncStatus } = state;
  const { tasks, isLoading: tasksLoading, forceSynchronize, operationsLoading } = useTaskDataContext();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const { isTaskExpanded, toggleTaskExpanded } = useExpandedTask();
  
  // Filtragem e ordenação de tarefas - similar ao Desktop
  const shouldShowHiddenTasks = showHiddenTasks;
  
  // Filtrar as tarefas não-completadas e visíveis conforme as configurações
  const filteredTasks = tasks.filter(task => {
    const isNotCompleted = !task.completed;
    const isVisible = shouldShowHiddenTasks || !task.hidden;
    return isNotCompleted && isVisible;
  });
  
  // Ordenar as tarefas conforme o modo de visualização (neste caso, modo Potência)
  const sortedTasks = sortTasks(filteredTasks, 'power', sortOptions['power']);
  
  // Animações para os cards de tarefas
  const taskVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    exit: { 
      opacity: 0,
      scale: 0.9,
      y: -20,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };
  
  // Descrição dinâmica baseada na direção da ordenação
  const getDescriptionText = () => {
    const sortDirection = sortOptions.power.sortDirection;
    return sortDirection === 'desc' 
      ? 'As tarefas mais relevantes estão aparecendo primeiro.' 
      : 'Exibindo as tarefas menos relevantes primeiro.';
  };
  
  // Sincronizar tarefas com o backend
  const handleSyncTasks = async () => {
    if (operationsLoading.update) return;
    
    try {
      await forceSynchronize();
      toast({
        title: "Sincronização concluída",
        description: "Suas tarefas foram sincronizadas com sucesso.",
      });
    } catch (error) {
      console.error('Error synchronizing tasks:', error);
      toast({
        title: "Erro ao sincronizar",
        description: "Não foi possível sincronizar suas tarefas. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };
  
  if (tasksLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="px-3 py-2">
      {/* Cabeçalho */}
      <div className="mb-5">
        <h1 className="text-xl font-bold">Modo Potência</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {getDescriptionText()}
        </p>
        
        {/* Botão de adicionar tarefa logo após o título e legenda */}
        <div className="mt-3 flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncTasks}
            disabled={operationsLoading.update}
            className={`flex items-center gap-1 ${
              syncStatus === 'error' ? 'border-red-500 text-red-500 hover:bg-red-50' : ''
            }`}
          >
            {operationsLoading.update ? (
              <Loader2 size={14} className="animate-spin" />
            ) : syncStatus === 'error' ? (
              <RefreshCw size={14} className="text-red-500" />
            ) : (
              <RefreshCw size={14} className={syncStatus === 'synced' ? "text-green-500" : ""} />
            )}
          </Button>
          
          {isTaskFormOpen ? (
            <TaskForm onClose={() => setIsTaskFormOpen(false)} />
          ) : (
            <Button
              onClick={() => setIsTaskFormOpen(true)}
              className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              size="sm"
            >
              <Plus size={16} className="mr-1" />
              Adicionar Tarefa
            </Button>
          )}
        </div>
      </div>
      
      {/* Lista de tarefas */}
      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence initial={false} mode="popLayout">
          {sortedTasks.map(task => (
            <motion.div
              key={`task-${task.id}-${task.hidden ? 1 : 0}-${task._optimisticUpdateTime || 0}`}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={taskVariants}
              layout
              layoutId={`task-container-${task.id}`}
            >
              <TaskCard 
                task={task} 
                isExpanded={isTaskExpanded(task.id)} 
                onToggleExpand={toggleTaskExpanded} 
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <div className="text-center py-8 border border-dashed rounded-lg bg-muted/30 border-border">
            <p className="text-muted-foreground text-sm">
              {shouldShowHiddenTasks 
                ? 'Nenhuma tarefa encontrada. Adicione sua primeira tarefa!' 
                : 'Nenhuma tarefa visível. Você pode habilitar tarefas ocultas nas configurações.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobilePowerPage;
