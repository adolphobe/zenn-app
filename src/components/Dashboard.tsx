
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { sortTasks } from '../utils';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { PlusCircle, Menu, Filter } from 'lucide-react';
import { Button } from './ui/button';

const Dashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const { state, toggleSidebar, updateDateDisplayOptions } = useAppContext();
  const { tasks, viewMode, showHiddenTasks, sidebarOpen, dateDisplayOptions } = state;

  const visibleTasks = tasks.filter(task => 
    !task.completed && (showHiddenTasks || !task.hidden)
  );
  const sortedTasks = sortTasks(visibleTasks, viewMode);
  const completedTasks = tasks.filter(task => task.completed);

  const toggleDateOption = (option: keyof typeof dateDisplayOptions) => {
    updateDateDisplayOptions({
      ...dateDisplayOptions,
      [option]: !dateDisplayOptions[option]
    });
  };

  return (
    <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
      <header className="bg-white dark:bg-gray-900 p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 z-10 card-shadow">
        <div className="flex items-center">
          <button 
            className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {viewMode === 'power' ? 'Modo Potência' : 'Modo Cronologia'}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              <span className="hidden sm:inline">Filtros</span>
            </Button>
            
            <div className="absolute right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg shadow-lg p-3 min-w-[200px] hidden group-hover:block">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Opções de data</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={dateDisplayOptions.hideDate} 
                    onChange={() => toggleDateOption('hideDate')}
                    className="h-4 w-4 rounded text-blue-600"
                  />
                  <span className="text-sm">Ocultar Data</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={dateDisplayOptions.hideYear} 
                    onChange={() => toggleDateOption('hideYear')}
                    className="h-4 w-4 rounded text-blue-600"
                  />
                  <span className="text-sm">Ocultar Ano</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={dateDisplayOptions.hideTime} 
                    onChange={() => toggleDateOption('hideTime')}
                    className="h-4 w-4 rounded text-blue-600"
                  />
                  <span className="text-sm">Ocultar Hora</span>
                </label>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center shadow-sm transition-colors"
            aria-label="Nova tarefa"
          >
            <PlusCircle size={20} />
          </button>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Suas Tarefas</h2>
          <p className="text-sm text-gray-500">
            {viewMode === 'power' 
              ? 'Ordenadas por potência (score total)' 
              : 'Ordenadas por data ideal'
            }
          </p>
        </div>

        <div className="space-y-4">
          {sortedTasks.length > 0 ? (
            sortedTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <div className="p-10 text-center bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-gray-500">
                Nenhuma tarefa encontrada.
                {!showHiddenTasks && (
                  <button 
                    className="text-blue-600 hover:underline ml-1"
                    onClick={() => {
                      useAppContext().toggleShowHiddenTasks();
                    }}
                  >
                    Mostrar tarefas ocultas?
                  </button>
                )}
              </p>
            </div>
          )}
        </div>

        {completedTasks.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Tarefas Concluídas</h2>
            <div className="space-y-4">
              {completedTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}
      </main>

      {showForm && <TaskForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default Dashboard;
