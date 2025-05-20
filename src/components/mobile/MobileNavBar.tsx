
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Power, Clock, Filter, MoreHorizontal, History, Calendar, Moon, Settings, LogOut } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/auth';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileFilterMenu from './MobileFilterMenu';

interface MobileNavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ icon: Icon, label, isActive = false, onClick }) => {
  return (
    <button
      className={cn(
        "flex flex-col items-center justify-center px-3 py-1",
        isActive ? "text-blue-600" : "text-gray-500"
      )}
      onClick={onClick}
    >
      <Icon size={20} className={isActive ? "text-blue-600" : "text-gray-500"} />
      <span className="text-[10px] mt-1">{label}</span>
    </button>
  );
};

const MobileNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: { viewMode }, setViewMode, toggleDarkMode } = useAppContext();
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const [filterOpen, setFilterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  
  // Only render on mobile devices
  if (!isMobile) {
    return null;
  }

  const handleModeChange = (mode: 'power' | 'chronological') => {
    setViewMode(mode);
    // Ensure we're on the dashboard to see the change
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMoreOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Check if a mode is currently active
  const isModeActive = (mode: string) => viewMode === mode && location.pathname === '/dashboard';

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-between px-2 z-30">
      {/* Power Mode */}
      <MobileNavItem 
        icon={Power} 
        label="Potência" 
        isActive={isModeActive('power')}
        onClick={() => handleModeChange('power')}
      />
      
      {/* Chronological Mode */}
      <MobileNavItem 
        icon={Clock} 
        label="Cronologia" 
        isActive={isModeActive('chronological')}
        onClick={() => handleModeChange('chronological')}
      />
      
      {/* Filters */}
      <Popover open={filterOpen} onOpenChange={setFilterOpen}>
        <PopoverTrigger asChild>
          <div className="flex flex-col items-center justify-center px-3 py-1 text-gray-500 dark:text-gray-400">
            <Filter size={20} />
            <span className="text-[10px] mt-1">Filtros</span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" side="top" align="center">
          <MobileFilterMenu onClose={() => setFilterOpen(false)} />
        </PopoverContent>
      </Popover>
      
      {/* More */}
      <Popover open={moreOpen} onOpenChange={setMoreOpen}>
        <PopoverTrigger asChild>
          <div className="flex flex-col items-center justify-center px-3 py-1 text-gray-500 dark:text-gray-400">
            <MoreHorizontal size={20} />
            <span className="text-[10px] mt-1">Mais</span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" side="top" align="center">
          <div className="space-y-0.5">
            <button 
              className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm flex items-center"
              onClick={() => handleNavigate('/task-history-new')}
            >
              <History size={16} className="mr-2" />
              Histórico
            </button>
            <button 
              className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm flex items-center"
              onClick={() => handleNavigate('/strategic-review')}
            >
              <Calendar size={16} className="mr-2" />
              Análise Estratégica
            </button>
            <button 
              className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm flex items-center"
              onClick={toggleDarkMode}
            >
              <Moon size={16} className="mr-2" />
              Modo Escuro
            </button>
            <button 
              className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm flex items-center"
              onClick={() => handleNavigate('/settings')}
            >
              <Settings size={16} className="mr-2" />
              Configurações
            </button>
            <hr className="my-1 border-gray-200 dark:border-gray-700" />
            <button 
              className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm flex items-center text-red-500"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Sair
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MobileNavBar;
