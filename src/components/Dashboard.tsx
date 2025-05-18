
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/auth';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import SortDropdown from './SortDropdown';
import { sortTasks, isTaskOverdue, safeParseDate } from '@/utils';
import { Plus, Bell, ChevronDown, ChevronUp, Loader2, RefreshCw } from 'lucide-react';
import { useExpandedTask } from '@/context/hooks';
import { Badge } from './ui/badge';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const { viewMode, showHiddenTasks, sortOptions, syncStatus } = state;
  
  const { 
    tasks, 
    isLoading: tasksLoading, 
    forceSynchronize,
    operationsLoading
  } = useTaskDataContext();
  
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const { isTaskExpanded, toggleTaskExpanded } = useExpandedTask();
  const [isLoading, setIsLoading] = useState(true);
  
  // State for showing/hiding overdue tasks, initialized from localStorage
  const [showOverdueTasks, setShowOverdueTasks] = useState(() => {
    const stored = localStorage.getItem('showOverdueTasks');
    return stored !== null ? JSON.parse(stored) : true;
  });

  // Force re-render every minute to update overdue status in real-time
  const [, setTime] = useState(new Date());
  
  // Set loading state based on tasks and auth loading
  useEffect(() => {
    if (authLoading || tasksLoading) {
      setIsLoading(true);
    } else {
      // Small delay to avoid flicker for quick loads
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [authLoading, tasksLoading, tasks]);
  
  useEffect(() => {
    // Update current time every minute to check for newly overdue tasks
    const interval = setInterval(() => {
      setTime(new Date());
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  // Save showOverdueTasks state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('showOverdueTasks', JSON.stringify(showOverdueTasks));
  }, [showOverdueTasks]);
  
  // In chronological mode, always show hidden tasks
  const shouldShowHiddenTasks = viewMode === 'chronological' || showHiddenTasks;
  
  // Filter tasks to only show non-completed and (if shouldShowHiddenTasks is false, only non-hidden tasks)
  const filteredTasks = tasks.filter(
    task => !task.completed && (shouldShowHiddenTasks || !task.hidden)
  );
  
  // First separate overdue tasks from non-overdue tasks
  const overdueTasksChronological = viewMode === 'chronological'
    ? filteredTasks.filter(task => task.idealDate && isTaskOverdue(task.idealDate ? safeParseDate(task.idealDate) : null))
    : [];
    
  const nonOverdueTasksChronological = viewMode === 'chronological'
    ? filteredTasks.filter(task => !task.idealDate || !isTaskOverdue(task.idealDate ? safeParseDate(task.idealDate) : null))
    : filteredTasks;
    
  // Apply sorting to each group separately
  const sortedOverdueTasks = viewMode === 'chronological'
    ? sortTasks(overdueTasksChronological, viewMode, sortOptions[viewMode])
    : [];
    
  const sortedNonOverdueTasks = viewMode === 'chronological'
    ? sortTasks(nonOverdueTasksChronological, viewMode, sortOptions[viewMode])
    : sortTasks(nonOverdueTasksChronological, viewMode, sortOptions[viewMode]);

  // Generate dynamic description text based on viewMode and sort direction
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

  // Toggle function for showing/hiding overdue tasks
  const toggleOverdueTasks = () => {
    setShowOverdueTasks(prev => !prev);
  };
  
  const handleSyncTasks = async () => {
    if (operationsLoading.update) return; // Don't sync if already updating
    
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
  
  if (isLoading || authLoading) {
    return (
      <div className="container p-4 mx-auto flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando suas tarefas...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="container p-4 mx-auto">
        <Alert>
          <AlertTitle>Você não está autenticado</AlertTitle>
          <AlertDescription>
            Faça login para ver e gerenciar suas tarefas.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Enhanced animation variants for task cards
  const taskVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.15, ease: "easeInOut" }
    }
  };
  
  return (
    <>
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
                <div className="absolute -top-3 left-4 bg-background bg-[transparent] dark:bg-[transparent] px-2">
                  <Badge 
                    className="bg-[#ffe7e7]/100 dark:bg-[#3e0515] text-[#ea384c] border-[#ea384c]/30 flex items-center gap-1 cursor-pointer hover:bg-[#ffd2d2] dark:hover:bg-[#59071e] transition-colors"
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
                            key={`${task.id}-${task.hidden ? 1 : 0}`}
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

            {/* Non-overdue tasks with improved animations */}
            <AnimatePresence initial={false} mode="popLayout">
              {sortedNonOverdueTasks.map(task => (
                <motion.div
                  key={`${task.id}-${task.hidden ? 1 : 0}-${task._optimisticUpdateTime || 0}`}
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
              <div className="text-center py-12 border border-dashed rounded-lg bg-muted/30 border-border">
                <p className="text-muted-foreground">
                  {shouldShowHiddenTasks 
                    ? 'Nenhuma tarefa encontrada. Adicione sua primeira tarefa!' 
                    : 'Nenhuma tarefa visível. Você pode habilitar tarefas ocultas nas configurações.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
