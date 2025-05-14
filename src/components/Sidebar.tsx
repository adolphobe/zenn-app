
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
  Sun,
  LogOut,
  User
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from '@/components/ui/separator';

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
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 
                  transition-all duration-300 z-30 card-shadow flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <div className="p-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <h1 className={`font-semibold text-xl text-blue-600 dark:text-blue-400 ${!sidebarOpen && 'sr-only'}`}>ACTO</h1>
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <div className="p-3 flex-1">
          <div className="mb-6">
            <p className={`text-xs text-gray-500 px-4 py-2 ${!sidebarOpen && 'sr-only'}`}>
              Modos
            </p>
            
            <button 
              className={`sidebar-item ${viewMode === 'power' ? 'active' : ''} w-full`}
              onClick={() => setViewMode('power')}
            >
              <LayoutDashboard size={20} />
              {sidebarOpen && <span>Modo Potência</span>}
            </button>
            
            <button 
              className={`sidebar-item ${viewMode === 'chronological' ? 'active' : ''} w-full`}
              onClick={() => setViewMode('chronological')}
            >
              <CalendarClock size={20} />
              {sidebarOpen && <span>Modo Cronologia</span>}
            </button>
          </div>
          
          <div className="mb-6">
            <p className={`text-xs text-gray-500 px-4 py-2 ${!sidebarOpen && 'sr-only'}`}>
              Filtros
            </p>
            
            <button 
              className={`sidebar-item text-start justify-start ${showHiddenTasks ? 'active justify-start' : ''} w-full`}
              onClick={toggleShowHiddenTasks}
            >
              <Eye size={20} />
              {sidebarOpen && <span className="text-left">Tarefas ocultas</span>}
            </button>
          </div>
          
          <div className="mb-6">
            <p className={`text-xs text-gray-500 px-4 py-2 ${!sidebarOpen && 'sr-only'}`}>
              Configurações
            </p>
            
            <button 
              className={`sidebar-item w-full`}
              onClick={toggleDarkMode}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              {sidebarOpen && <span>{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>}
            </button>
            
            <button 
              className={`sidebar-item w-full`}
            >
              <Settings size={20} />
              {sidebarOpen && <span>Configurações</span>}
            </button>
          </div>
        </div>
        
        {/* User profile section at the bottom */}
        <div className="mt-auto">
          <Separator className="mb-3" />
          <div className={`px-3 pb-4 ${sidebarOpen ? 'space-y-3' : 'flex flex-col items-center space-y-2'}`}>
            <div className={`flex items-center ${sidebarOpen ? 'px-2 gap-2' : 'justify-center'}`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-100 text-blue-800">
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
              {sidebarOpen && <span className="font-medium text-sm">Adolpho</span>}
            </div>
            <button 
              className="flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 px-2 py-2 rounded-lg w-full text-sm transition-colors"
            >
              <LogOut size={sidebarOpen ? 18 : 20} />
              {sidebarOpen && <span>Sair</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
