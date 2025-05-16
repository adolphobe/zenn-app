
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import SortDropdown from './SortDropdown';
import StrategicReview from '../pages/StrategicReview';
import { useLocation } from 'react-router-dom';
import { sortTasks } from '@/utils';
import { Plus } from 'lucide-react';
import { useExpandedTask } from '@/context/hooks';

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
  
  return (
    <div className="container p-4 mx-auto max-w-5xl">
      <div className="flex flex-col space-y-4">
        <div className="mb-6 flex justify-between items-center">
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
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {filteredTasks.map(task => (
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
