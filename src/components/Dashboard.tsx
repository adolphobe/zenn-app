
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import SortDropdown from './SortDropdown';
import StrategicReview from '../pages/StrategicReview';
import { useLocation } from 'react-router-dom';
import { sortTasks } from '@/utils';

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const { tasks, viewMode, showHiddenTasks, sidebarOpen, sortOptions } = state;
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  // Check if we're on strategic review route
  const isStrategicReview = location.pathname === '/strategic-review';
  
  // If on strategic review route, render that component
  if (isStrategicReview) {
    return (
      <main className={`transition-all duration-300 min-h-screen bg-background
        ${sidebarOpen ? (isMobile ? 'ml-0' : 'ml-64') : 'ml-0 md:ml-20'}`}>
        <StrategicReview />
      </main>
    );
  }

  // Sort and filter tasks
  const filteredTasks = sortTasks(
    tasks.filter(task => !task.completed && (showHiddenTasks || !task.hidden)),
    viewMode,
    sortOptions[viewMode]
  );

  return (
    <main className={`transition-all duration-300 min-h-screen bg-background
      ${sidebarOpen ? (isMobile ? 'ml-0' : 'ml-64') : 'ml-0 md:ml-20'}`}>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            {viewMode === 'power' ? 'Modo Potência' : 'Modo Cronológico'}
          </h1>
          {isTaskFormOpen ? (
            <TaskForm onClose={() => setIsTaskFormOpen(false)} />
          ) : (
            <button
              onClick={() => setIsTaskFormOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nova Tarefa
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-12 border border-dashed rounded-lg bg-muted/30 border-border">
              <p className="text-muted-foreground">
                {showHiddenTasks 
                  ? 'Nenhuma tarefa encontrada. Adicione sua primeira tarefa!' 
                  : 'Nenhuma tarefa visível. Você pode habilitar tarefas ocultas nas configurações.'}
              </p>
            </div>
          )}
        </div>
        
        {filteredTasks.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2 justify-end">
            <SortDropdown />
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
