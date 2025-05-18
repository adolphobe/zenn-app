
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarClock, BarChart, History } from 'lucide-react';
import SidebarNavItem from './SidebarNavItem';
import SidebarSection from './SidebarSection';

const SidebarModeSection: React.FC<{ sidebarOpen: boolean }> = ({ sidebarOpen }) => {
  const { 
    state: { viewMode }, 
    setViewMode
  } = useAppContext();
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user is on specific routes by checking if the path contains these segments
  const isStrategicReview = location.pathname === '/strategic-review';
  const isHistory = location.pathname === '/task-history';
  const isSettings = location.pathname === '/settings';
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('acto_is_logged_in') === 'true';
  
  // Determine the target path based on login status
  const targetPath = isLoggedIn ? '/dashboard' : '/';
  
  // An item should only be active if we're on its page and not on a different special page
  const isPowerModeActive = viewMode === 'power' && !isStrategicReview && !isHistory && !isSettings;
  const isChronologicalModeActive = viewMode === 'chronological' && !isStrategicReview && !isHistory && !isSettings;
  
  // Navigate to main page with power view mode
  const handlePowerModeClick = () => {
    setViewMode('power');
    navigate(targetPath);
  };

  // Navigate to main page with chronological view mode
  const handleChronologicalModeClick = () => {
    setViewMode('chronological');
    navigate(targetPath);
  };
  
  return (
    <SidebarSection title="Menu" sidebarOpen={sidebarOpen}>
      <SidebarNavItem 
        icon={LayoutDashboard} 
        label="Modo Potência"
        path={targetPath}
        isActive={isPowerModeActive}
        onClick={handlePowerModeClick}
      />
      
      <SidebarNavItem 
        icon={CalendarClock} 
        label="Modo Cronológico"
        path={targetPath}
        isActive={isChronologicalModeActive}
        onClick={handleChronologicalModeClick}
      />
      
      <SidebarNavItem 
        icon={BarChart} 
        label="Insights"
        path="/strategic-review"
        isActive={isStrategicReview}
      />

      <SidebarNavItem 
        icon={History}
        label="Histórico"
        path="/task-history"
        isActive={isHistory}
      />
    </SidebarSection>
  );
};

export default SidebarModeSection;
