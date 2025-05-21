
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useTaskDataContext } from '@/context/TaskDataProvider';
import { useExpandedTask } from '@/context/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/TaskCard';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskForm from '@/components/TaskForm';
import { sortTasks } from '@/utils';
import { NavigationStore } from '@/utils/navigationStore';
import MobileSortDropdown from '@/components/mobile/MobileSortDropdown';

// Preload the chronological page component - this is static and won't change
const preloadChronological = () => import('./MobileChronologicalPage');

const MobilePowerPage: React.FC = () => {
  const { state } = useAppContext();
  const { viewMode, showHiddenTasks, sortOptions } = state;
  const { tasks, isLoading: tasksLoading } = useTaskDataContext();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const { isTaskExpanded, toggleTaskExpanded } = useExpandedTask();
  
  // Preload chronological page as soon as this component mounts
  useEffect(() => {
    // Start preloading instantly
    preloadChronological();
    
    // Track navigation for optimization
    NavigationStore.recordDashboardVisit();
  }, []);
  
  // Filtragem e ordenação de tarefas - similar ao Desktop
  const shouldShowHiddenTasks = showHiddenTasks;
  
  // Filtrar as tarefas não-completadas e visíveis conforme as configurações
  const filteredTasks = tasks.filter(task => {
    const isNotCompleted = !task.completed;
    const isVisible = shouldShowHiddenTasks || !task.hidden;
    return isNotCompleted && isVisible;
  });
  
  // Ordenar as tarefas conforme o modo de visualização
  const sortedTasks = sortTasks(filteredTasks, 'power', sortOptions['power']);
  
  // Animações para os cards de tarefas - enhanced with smoother transitions
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
  
  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };
  
  if (tasksLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Ensure we always use 'power' as the viewMode for this page
  const pageViewMode = 'power';

  return (
    <motion.div 
      className="py-2 relative"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Cabeçalho com ordenação e botão de adicionar */}
      <div className="flex justify-between items-center mb-4">
        <MobileSortDropdown />
        
        <Button
          onClick={() => setIsTaskFormOpen(true)}
          className="bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-full h-10 w-10 shadow-md flex items-center justify-center"
          size="icon"
        >
          <Plus size={20} />
        </Button>
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
                viewMode={pageViewMode} // Explicitly set viewMode to 'power'
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
      
      {/* Task Form Modal */}
      {isTaskFormOpen && (
        <TaskForm onClose={() => setIsTaskFormOpen(false)} />
      )}
    </motion.div>
  );
};

export default MobilePowerPage;
