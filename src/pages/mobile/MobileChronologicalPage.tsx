
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { useExpandedTask } from '@/context/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/TaskCard';
import { Plus, Loader2, RefreshCw, Bell, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import TaskForm from '@/components/TaskForm';
import { sortTasks, isTaskOverdue } from '@/utils';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const MobileChronologicalPage: React.FC = () => {
  const { state } = useAppContext();
  const { viewMode, showHiddenTasks, sortOptions, syncStatus } = state;
  const { tasks, isLoading: tasksLoading, forceSynchronize, operationsLoading } = useTaskDataContext();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const { isTaskExpanded, toggleTaskExpanded } = useExpandedTask();
  
  // Estado para mostrar/esconder tarefas vencidas, inicializado do localStorage
  const [showOverdueTasks, setShowOverdueTasks] = useState(() => {
    const stored = localStorage.getItem('showOverdueTasks');
    return stored !== null ? JSON.parse(stored) : true;
  });
  
  // Forçar re-renderização a cada minuto para atualizar status de vencido em tempo real
  const [, setTime] = useState(new Date());
  
  // Atualizar tempo atual a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 60000); // Verificar a cada minuto
    
    return () => clearInterval(interval);
  }, []);

  // Salvar estado de showOverdueTasks no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('showOverdueTasks', JSON.stringify(showOverdueTasks));
  }, [showOverdueTasks]);
  
  // Filtragem e ordenação de tarefas - similar ao Desktop
  const shouldShowHiddenTasks = showHiddenTasks;
  
  // Filtrar as tarefas não-completadas e visíveis conforme as configurações
  const filteredTasks = tasks.filter(task => {
    const isNotCompleted = !task.completed;
    const isVisible = shouldShowHiddenTasks || !task.hidden;
    return isNotCompleted && isVisible;
  });
  
  // Primeiro separar tarefas vencidas de não-vencidas
  const overdueTasksChronological = filteredTasks.filter(task => 
    task.idealDate && isTaskOverdue(task.idealDate)
  );
    
  const nonOverdueTasksChronological = filteredTasks.filter(task => 
    !task.idealDate || !isTaskOverdue(task.idealDate)
  );
    
  // Aplicar ordenação a cada grupo separadamente
  const sortedOverdueTasks = sortTasks(overdueTasksChronological, 'chronological', sortOptions['chronological']);
  const sortedNonOverdueTasks = sortTasks(nonOverdueTasksChronological, 'chronological', sortOptions['chronological']);
  
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
    const sortDirection = sortOptions.chronological.sortDirection;
    return sortDirection === 'desc' 
      ? 'Tarefas mais recentes até as mais antigas.' 
      : 'Exibindo tarefas mais distantes primeiro.';
  };
  
  // Alternar mostrar/ocultar tarefas vencidas
  const toggleOverdueTasks = () => {
    setShowOverdueTasks(prev => !prev);
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
        <h1 className="text-xl font-bold">Modo Cronológico</h1>
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
      
      {/* Tarefas vencidas */}
      {sortedOverdueTasks.length > 0 && (
        <div className="border-2 border-[#ea384c]/30 rounded-lg p-3 relative mb-4 bg-[#ffafaf24] dark:bg-[#ff000024]">
          <div className="absolute -top-2.5 left-3">
            <Badge 
              className="bg-[#ffe7e7] dark:bg-[#3e0515] text-[#ea384c] border-[#ea384c]/30 flex items-center gap-1 cursor-pointer hover:bg-[#ffd2d2] dark:hover:bg-[#59071e] transition-colors text-xs"
              onClick={toggleOverdueTasks}
            >
              <Bell size={12} />
              <span>Vencidas</span>
              {showOverdueTasks ? 
                <ChevronUp size={12} className="ml-1" /> : 
                <ChevronDown size={12} className="ml-1" />
              }
            </Badge>
          </div>
          <AnimatePresence initial={false}>
            {showOverdueTasks && (
              <motion.div 
                className="grid grid-cols-1 gap-3 mt-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {sortedOverdueTasks.map(task => (
                    <motion.div
                      key={`overdue-task-${task.id}-${task.hidden ? 1 : 0}-${task._optimisticUpdateTime || 0}`}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={taskVariants}
                      layout
                      layoutId={`task-container-${task.id}`}
                    >
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        isExpanded={isTaskExpanded(task.id)} 
                        onToggleExpand={toggleTaskExpanded} 
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* Tarefas não vencidas */}
      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence initial={false} mode="popLayout">
          {sortedNonOverdueTasks.map(task => (
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

export default MobileChronologicalPage;
