
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import SortDropdown from './SortDropdown';
import StrategicReview from '../pages/StrategicReview';
import { useLocation } from 'react-router-dom';
import { sortTasks, isTaskOverdue } from '@/utils';
import { Plus, Bell } from 'lucide-react';
import { useExpandedTask } from '@/context/hooks';
import { Badge } from './ui/badge';

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const { tasks, viewMode, showHiddenTasks, sortOptions } = state;
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const { isTaskExpanded, toggleTaskExpanded } = useExpandedTask();
  
  // Check if we're on strategic review route
  const isStrategicReview = location.pathname === '/strategic-review';

  // If on strategic review route, render that component
  if (isStrategicReview) {
    return <StrategicReview />;
  }
  
  // In chronological mode, always show hidden tasks
  const shouldShowHiddenTasks = viewMode === 'chronological' || showHiddenTasks;
  
  // Sort and filter tasks
  const filteredTasks = sortTasks(
    tasks.filter(task => !task.completed && (shouldShowHiddenTasks || !task.hidden)),
    viewMode,
    sortOptions[viewMode]
  );

  // Separate overdue tasks for chronological view
  const overdueTasksChronological = viewMode === 'chronological'
    ? filteredTasks.filter(task => task.idealDate && isTaskOverdue(task.idealDate))
    : [];
    
  const nonOverdueTasksChronological = viewMode === 'chronological'
    ? filteredTasks.filter(task => !task.idealDate || !isTaskOverdue(task.idealDate))
    : filteredTasks;

  // Generate dynamic description text based on viewMode and sort direction
  const getDescriptionText = () => {
    if (viewMode === 'power') {
      const sortDirection = sortOptions.power.sortDirection;
      return sortDirection === 'desc' 
        ? 'Tarefas com maior potência aparecem primeiro.' 
        : 'Tarefas com menor potência aparecem primeiro.';
    } else {
      const sortDirection = sortOptions.chronological.sortDirection;
      return sortDirection === 'asc' 
        ? 'Tarefas ordenadas da data mais próxima para a mais distante.' 
        : 'Tarefas ordenadas da data mais distante para a mais próxima.';
    }
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
          {/* Non-overdue tasks - display first */}
          {nonOverdueTasksChronological.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              isExpanded={isTaskExpanded(task.id)} 
              onToggleExpand={toggleTaskExpanded} 
            />
          ))}

          {/* Overdue tasks box - only show in chronological mode and moved to the bottom */}
          {viewMode === 'chronological' && overdueTasksChronological.length > 0 && (
            <div className="border-2 border-[#ea384c]/30 rounded-lg p-4 relative mt-2">
              <div className="absolute -top-3 left-4 bg-background px-2">
                <Badge className="bg-[#ea384c]/10 text-[#ea384c] border-[#ea384c]/30 flex items-center gap-1">
                  <Bell size={14} />
                  <span>Vencidas</span>
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {overdueTasksChronological.map(task => (
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
