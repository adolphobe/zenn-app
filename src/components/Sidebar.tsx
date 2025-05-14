
import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  LayoutDashboard, 
  CalendarClock, 
  Settings, 
  Eye,
  Moon,
  Sun,
  BarChart
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarNavItem from './sidebar/SidebarNavItem';
import SidebarSection from './sidebar/SidebarSection';
import SidebarUserProfile from './sidebar/SidebarUserProfile';

const Sidebar: React.FC = () => {
  const { 
    state: { viewMode, showHiddenTasks, darkMode, sidebarOpen }, 
    setViewMode, 
    toggleShowHiddenTasks, 
    toggleDarkMode,
    toggleSidebar
  } = useAppContext();
  
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user is on the strategic review page
  const isStrategicReview = location.pathname === '/strategic-review';
  
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

  // Navigate to main page with power view mode
  const handlePowerModeClick = () => {
    setViewMode('power');
    navigate('/');
  };

  // Navigate to main page with chronological view mode
  const handleChronologicalModeClick = () => {
    setViewMode('chronological');
    navigate('/');
  };

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
      <SidebarHeader sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="p-3 flex-1">
        <SidebarSection title="Modos" sidebarOpen={sidebarOpen}>
          <SidebarNavItem 
            icon={LayoutDashboard} 
            label="Modo Potência"
            path="/"
            isActive={viewMode === 'power' && !isStrategicReview}
            onClick={handlePowerModeClick}
          />
          
          <SidebarNavItem 
            icon={CalendarClock} 
            label="Modo Cronologia"
            path="/"
            isActive={viewMode === 'chronological' && !isStrategicReview}
            onClick={handleChronologicalModeClick}
          />
          
          <SidebarNavItem 
            icon={BarChart} 
            label="Revisão Estratégica"
            path="/strategic-review"
            isActive={isStrategicReview}
          />
        </SidebarSection>
        
        <SidebarSection title="Filtros" sidebarOpen={sidebarOpen}>
          <button 
            className={`sidebar-item text-start justify-start ${showHiddenTasks ? 'active justify-start' : ''} w-full`}
            onClick={toggleShowHiddenTasks}
          >
            <Eye size={20} />
            {sidebarOpen && <span className="text-left">Tarefas ocultas</span>}
          </button>
        </SidebarSection>
        
        <SidebarSection title="Configurações" sidebarOpen={sidebarOpen}>
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
        </SidebarSection>
      </div>
      
      <SidebarUserProfile sidebarOpen={sidebarOpen} />
    </div>
  );
};

export default Sidebar;
