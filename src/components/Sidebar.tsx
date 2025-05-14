
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  LayoutDashboard, 
  CalendarClock, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Eye,
  Moon,
  Sun
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { 
    state: { viewMode, showHiddenTasks, darkMode, sidebarOpen }, 
    setViewMode, 
    toggleShowHiddenTasks, 
    toggleDarkMode,
    toggleSidebar
  } = useAppContext();

  return (
    <>
      <div 
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 
                  transition-all duration-300 z-30 ${sidebarOpen ? 'w-60' : 'w-16'}`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h1 className={`font-semibold text-xl ${!sidebarOpen && 'sr-only'}`}>ACTO</h1>
          <button 
            onClick={toggleSidebar} 
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <div className="p-2">
          <div className="mb-4">
            <p className={`text-xs text-gray-500 px-3 py-1 ${!sidebarOpen && 'sr-only'}`}>
              Modos
            </p>
            
            <button 
              className={`sidebar-item ${viewMode === 'power' ? 'active' : ''} w-full`}
              onClick={() => setViewMode('power')}
            >
              <LayoutDashboard size={18} />
              {sidebarOpen && <span>Modo Potência</span>}
            </button>
            
            <button 
              className={`sidebar-item ${viewMode === 'chronological' ? 'active' : ''} w-full`}
              onClick={() => setViewMode('chronological')}
            >
              <CalendarClock size={18} />
              {sidebarOpen && <span>Modo Cronologia</span>}
            </button>
          </div>
          
          <div className="mb-4">
            <p className={`text-xs text-gray-500 px-3 py-1 ${!sidebarOpen && 'sr-only'}`}>
              Filtros
            </p>
            
            <button 
              className={`sidebar-item ${showHiddenTasks ? 'active' : ''} w-full`}
              onClick={toggleShowHiddenTasks}
            >
              <Eye size={18} />
              {sidebarOpen && <span>Mostrar Tarefas Ocultas</span>}
            </button>
          </div>
          
          <div className="mb-4">
            <p className={`text-xs text-gray-500 px-3 py-1 ${!sidebarOpen && 'sr-only'}`}>
              Configurações
            </p>
            
            <button 
              className={`sidebar-item w-full`}
              onClick={toggleDarkMode}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              {sidebarOpen && <span>{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>}
            </button>
            
            <button 
              className={`sidebar-item w-full`}
            >
              <Settings size={18} />
              {sidebarOpen && <span>Configurações</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
