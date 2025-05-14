
import React, { useEffect } from 'react';
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
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar: React.FC = () => {
  const { 
    state: { viewMode, showHiddenTasks, darkMode, sidebarOpen }, 
    setViewMode, 
    toggleShowHiddenTasks, 
    toggleDarkMode,
    toggleSidebar
  } = useAppContext();
  
  const isMobile = useIsMobile();
  
  // Auto-close sidebar on mobile when it's initially loaded
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      toggleSidebar();
    }
  }, [isMobile]);

  // If sidebar is shown in mobile, add overlay and prevent scrolling
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
      
      // Create overlay
      const overlay = document.createElement('div');
      overlay.id = 'sidebar-overlay';
      overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-20';
      overlay.addEventListener('click', toggleSidebar);
      document.body.appendChild(overlay);
      
      return () => {
        document.body.style.overflow = '';
        const existingOverlay = document.getElementById('sidebar-overlay');
        if (existingOverlay) {
          existingOverlay.remove();
        }
      };
    }
  }, [isMobile, sidebarOpen, toggleSidebar]);

  if (!sidebarOpen && isMobile) {
    return null; // Don't render sidebar at all on mobile when closed
  }

  return (
    <div 
      className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 
                transition-all duration-300 z-30 card-shadow flex flex-col 
                ${sidebarOpen ? 'w-64' : 'w-20'} 
                ${isMobile ? (sidebarOpen ? 'translate-x-0' : 'translate-x-full') : ''}`}
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
      
      {/* Enhanced user profile section at the bottom */}
      <div className="mt-auto">
        <Separator className="mb-4" />
        <div className={`px-4 pb-4 ${sidebarOpen ? 'space-y-2' : 'flex flex-col items-center'}`}>
          {/* User profile with online indicator */}
          <div className={`flex ${sidebarOpen ? 'items-start gap-3' : 'justify-center'}`}>
            <div className="relative">
              <Avatar className={`${sidebarOpen ? 'h-12 w-12' : 'h-10 w-10'} border-2 border-white shadow-sm`}>
                <AvatarImage src="https://cdn.shopify.com/s/files/1/0629/1993/4061/files/WhatsApp_Image_2025-05-14_at_17.26.25.jpg?v=1747255394" />
                <AvatarFallback className="bg-blue-100 text-blue-800">
                  <User size={sidebarOpen ? 24 : 18} />
                </AvatarFallback>
              </Avatar>
              {/* Online status indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white" />
            </div>
            
            {sidebarOpen && (
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-gray-800 dark:text-gray-200 truncate">Adolpho</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">adolpho@acto.app</span>
              </div>
            )}
          </div>
          
          {/* Logout button */}
          <Button 
            variant="outline"
            size={sidebarOpen ? "default" : "icon"}
            className={`mt-2 w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/20 dark:hover:text-red-300`}
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="ml-2">Sair</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
