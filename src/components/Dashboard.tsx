import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useTaskDataContext } from '@/context/TaskDataProvider'; 
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/auth';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import SortDropdown from './SortDropdown';
import { sortTasks, isTaskOverdue } from '@/utils';
import { Plus, Bell, ChevronDown, ChevronUp, Loader2, RefreshCw } from 'lucide-react';
import { useExpandedTask } from '@/context/hooks';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import MobileRedirect from './MobileRedirect';
import { ViewMode } from '@/types';

const Dashboard: React.FC = () => {
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
  
  // Save showOverdueTasks to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('showOverdueTasks', JSON.stringify(showOverdueTasks));
  }, [showOverdueTasks]);
  
  // Alternar mostrar/ocultar tarefas vencidas
  const toggleOverdueTasks = () => {
    setShowOverdueTasks(prev => !prev);
  };
  
  // Improved console log to debug filter settings
  console.log('Dashboard render with settings:', { 
    viewMode, 
    showHiddenTasks, 
    sortOptions: sortOptions[viewMode],
    taskCount: tasks?.length || 0,
  });
  
  // Log all tasks for debugging
  console.log('All tasks before filtering:', tasks.map(t => ({
    id: t.id, 
    title: t.title,
    score: t.totalScore,
    hidden: t.hidden,
    completed: t.completed
  })));
  
  // Filtrar as tarefas não-completadas e visíveis conforme as configurações
  const filteredTasks = tasks.filter(task => {
    // More detailed logging for filtering decisions
    const isNotCompleted = !task.completed;
    const isVisible = showHiddenTasks || !task.hidden;
    const keepTask = isNotCompleted && isVisible;
    
    console.log(`Filtering task ${task.id} (${task.title}):`, { 
      score: task.totalScore,
      completed: task.completed, 
      hidden: task.hidden,
      showHiddenTasks,
      keepTask,
      reason: !keepTask ? (task.completed ? 'completed' : 'hidden') : 'displayed'
    });
    
    return keepTask;
  });
  
  console.log('Filtered tasks count:', filteredTasks.length);
  
  // Primeiro separar tarefas vencidas de não-vencidas
  const overdueTasksChronological = filteredTasks.filter(task => 
    task.idealDate && isTaskOverdue(task.idealDate)
  );
    
  const nonOverdueTasksChronological = filteredTasks.filter(task => 
    !task.idealDate || !isTaskOverdue(task.idealDate)
  );
  
  console.log('Overdue tasks:', overdueTasksChronological.length);
  console.log('Non-overdue tasks:', nonOverdueTasksChronological.length);
    
  // Aplicar ordenação a cada grupo separadamente
  const sortedOverdueTasks = sortTasks(overdueTasksChronological, 'chronological', sortOptions['chronological']);
  const sortedNonOverdueTasks = sortTasks(nonOverdueTasksChronological, viewMode, sortOptions[viewMode]);
  
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
    if (viewMode === 'power') {
      const sortDirection = sortOptions.power.sortDirection;
      return sortDirection === 'desc' 
        ? 'As tarefas mais relevantes estão aparecendo primeiro.' 
        : 'Exibindo as tarefas menos relevantes primeiro.';
    } else {
      const sortDirection = sortOptions.chronological.sortDirection;
      return sortDirection === 'desc' 
        ? 'Tarefas mais recentes até as mais antigas.' 
        : 'Exibindo tarefas mais distantes primeiro.';
    }
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
  
  // Fix TypeScript typing for viewMode
  const typedViewMode: ViewMode = viewMode as ViewMode;
  
  // Explicitly log the view mode for debugging
  console.log('Current viewMode in Dashboard:', viewMode);
  
  // Adicionamos o componente MobileRedirect aqui
  return (
    <>
      <MobileRedirect />
      
      <div className="container p-4 mx-auto max-w-5xl">
        <div className="flex flex-col space-y-4">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold tracking-tight">
                {viewMode === 'power' ? 'Modo Potência' : 'Modo Cronológico'}
              </h1>
              <div className="flex items-center gap-2">
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
                    <Loader2 size={16} className="animate-spin" />
                  ) : syncStatus === 'error' ? (
                    <RefreshCw size={16} className="text-red-500" />
                  ) : (
                    <RefreshCw size={16} className={syncStatus === 'synced' ? "text-green-500" : ""} />
                  )}
                  <span className="ml-1">
                    {operationsLoading.update ? 'Sincronizando...' : 
                     syncStatus === 'error' ? 'Tentar novamente' : 
                     syncStatus === 'synced' ? 'Sincronizado' : 'Sincronizar'}
                  </span>
                </Button>
                
                <SortDropdown />

                {isTaskFormOpen ? (
                  <TaskForm onClose={() => setIsTaskFormOpen(false)} />
                ) : (
                  <button
                    onClick={() => setIsTaskFormOpen(true)}
                    className="flex rounded-[10px] items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={18} />
                    <span>Nova Tarefa</span>
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {getDescriptionText()}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            {/* Overdue tasks box - only show in chronological mode */}
            {viewMode === 'chronological' && sortedOverdueTasks.length > 0 && (
              <div className="border-2 border-[#ea384c]/30 rounded-lg p-4 relative mb-2 bg-[#ffafaf24] dark:bg-[#ff000024]">
                <div className="absolute -top-3 left-4 px-2">
                  <Badge 
                    className="bg-[#ffe7e7] dark:bg-[#3e0515] text-[#ea384c] border-[#ea384c]/30 flex items-center gap-1 cursor-pointer hover:bg-[#ffd2d2] dark:hover:bg-[#59071e] transition-colors"
                    onClick={toggleOverdueTasks}
                  >
                    <Bell size={14} />
                    <span>Vencidas</span>
                    {showOverdueTasks ? 
                      <ChevronUp size={14} className="ml-1" /> : 
                      <ChevronDown size={14} className="ml-1" />
                    }
                  </Badge>
                </div>
                <AnimatePresence initial={false}>
                  {showOverdueTasks && (
                    <motion.div 
                      className="grid grid-cols-1 gap-4"
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
                              viewMode={typedViewMode}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Non-overdue tasks with improved animations */}
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
                    viewMode={typedViewMode}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredTasks.length === 0 && !tasksLoading && (
              <div className="text-center py-12 border border-dashed rounded-lg bg-muted/30 border-border">
                <p className="text-muted-foreground">
                  {showHiddenTasks 
                    ? 'Nenhuma tarefa encontrada. Adicione sua primeira tarefa!' 
                    : 'Nenhuma tarefa visível. Você pode habilitar tarefas ocultas nas configurações.'}
                </p>
              </div>
            )}
            
            {tasksLoading && (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
                <p className="text-muted-foreground">Carregando tarefas...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
