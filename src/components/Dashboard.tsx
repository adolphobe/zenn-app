
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import SortDropdown from './SortDropdown';
import StrategicReview from '../pages/StrategicReview';
import { useLocation } from 'react-router-dom';
import { sortTasks, isTaskOverdue } from '@/utils';
import { Plus, Bell, ChevronDown, ChevronUp } from 'lucide-react';
import { useExpandedTask } from '@/context/hooks';
import { Badge } from './ui/badge';

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const { tasks, viewMode, showHiddenTasks, sortOptions } = state;
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const { isTaskExpanded, toggleTaskExpanded } = useExpandedTask();
  
  // State for showing/hiding overdue tasks, initialized from localStorage
  const [showOverdueTasks, setShowOverdueTasks] = useState(() => {
    const stored = localStorage.getItem('showOverdueTasks');
    return stored !== null ? JSON.parse(stored) : true;
  });

  // Force re-render every minute to update overdue status in real-time
  const [, setTime] = useState(new Date());
  
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
  
  // Check if we're on strategic review route
  const isStrategicReview = location.pathname === '/strategic-review';

  // If on strategic review route, render that component
  if (isStrategicReview) {
    return <StrategicReview />;
  }
  
  // In chronological mode, always show hidden tasks
  const shouldShowHiddenTasks = viewMode === 'chronological' || showHiddenTasks;
  
  // Filter tasks to only show non-completed and visible ones based on settings
  const filteredTasks = tasks.filter(
    task => !task.completed && (shouldShowHiddenTasks || !task.hidden)
  );
  
  // Primeiro separamos as tarefas em vencidas e não vencidas
  const overdueTasksChronological = viewMode === 'chronological'
    ? filteredTasks.filter(task => task.idealDate && isTaskOverdue(task.idealDate))
    : [];
    
  const nonOverdueTasksChronological = viewMode === 'chronological'
    ? filteredTasks.filter(task => !task.idealDate || !isTaskOverdue(task.idealDate))
    : filteredTasks;
    
  // Depois aplicamos a ordenação a cada grupo separadamente
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
        ? 'Tarefas com maior potência aparecem primeiro.' 
        : 'Tarefas com menor potência aparecem primeiro.';
    } else {
      const sortDirection = sortOptions.chronological.sortDirection;
      return sortDirection === 'desc' 
        ? 'Tarefas ordenadas da data mais próxima para a mais distante.' 
        : 'Tarefas ordenadas da data mais distante para a mais próxima.';
    }
  };

  // Toggle function for showing/hiding overdue tasks
  const toggleOverdueTasks = () => {
    setShowOverdueTasks(prev => !prev);
  };
  
  return (
    <div className="container p-4 mx-auto max-w-5xl">
      <div className="flex flex-col space-y-4">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">
              {viewMode === 'power' ? 'Modo Potência' : 'Modo Cronológico'}
            </h1>
            <div className="flex items-center gap-2">
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
            <div className="border-2 border-[#ea384c]/30 rounded-lg p-4 relative mb-2">
              <div className="absolute -top-3 left-4 bg-background px-2">
                <Badge 
                  className="bg-[#ea384c]/10 text-[#ea384c] border-[#ea384c]/30 flex items-center gap-1 cursor-pointer hover:bg-[#ea384c]/20 transition-colors"
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
              <div 
                className={`grid grid-cols-1 gap-4 overflow-hidden transition-all duration-300 ease-in-out ${
                  showOverdueTasks ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {sortedOverdueTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    isExpanded={isTaskExpanded(task.id)} 
                    onToggleExpand={toggleTaskExpanded} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Non-overdue tasks */}
          {sortedNonOverdueTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              isExpanded={isTaskExpanded(task.id)} 
              onToggleExpand={toggleTaskExpanded} 
            />
          ))}

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
  );
};

export default Dashboard;
