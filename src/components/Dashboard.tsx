
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { sortTasks } from '../utils';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { PlusCircle, Menu } from 'lucide-react';
import { Button } from './ui/button';

const Dashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const { state, toggleSidebar, updateDateDisplayOptions } = useAppContext();
  const { tasks, viewMode, showHiddenTasks, sidebarOpen, dateDisplayOptions } = state;

  const visibleTasks = tasks.filter(task => 
    !task.completed && (showHiddenTasks || !task.hidden)
  );
  const sortedTasks = sortTasks(visibleTasks, viewMode);

  const toggleDateOption = (option: keyof typeof dateDisplayOptions) => {
    updateDateDisplayOptions({
      ...dateDisplayOptions,
      [option]: !dateDisplayOptions[option]
    });
  };

  return (
    <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>
      <header className="bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <button 
            className="mr-3 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold">
            {viewMode === 'power' ? 'Modo Potência' : 'Modo Cronologia'}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex gap-2 mr-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => toggleDateOption('hideDate')}
              className={dateDisplayOptions.hideDate ? 'bg-gray-200' : ''}
            >
              Ocultar Data
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => toggleDateOption('hideYear')}
              className={dateDisplayOptions.hideYear ? 'bg-gray-200' : ''}
            >
              Ocultar Ano
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => toggleDateOption('hideTime')}
              className={dateDisplayOptions.hideTime ? 'bg-gray-200' : ''}
            >
              Ocultar Hora
            </Button>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center shadow-sm"
            aria-label="Nova tarefa"
          >
            <PlusCircle size={20} />
          </button>
        </div>
      </header>

      <main className="p-4 max-w-3xl mx-auto">
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-2">Suas Tarefas</h2>
          <p className="text-sm text-gray-500">
            {viewMode === 'power' 
              ? 'Ordenadas por potência (score total)' 
              : 'Ordenadas por data ideal'
            }
          </p>
        </div>

        <div className="space-y-3">
          {sortedTasks.length > 0 ? (
            sortedTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <div className="p-8 text-center">
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

        {tasks.filter(task => task.completed).length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-2">Tarefas Concluídas</h2>
            <div className="space-y-3">
              {tasks.filter(task => task.completed)
                .map(task => (
                  <TaskCard key={task.id} task={task} />
                ))
              }
            </div>
          </div>
        )}
      </main>

      {showForm && <TaskForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default Dashboard;
