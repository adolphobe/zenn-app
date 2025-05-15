
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarClock, BarChart } from 'lucide-react';
import SidebarNavItem from './SidebarNavItem';
import SidebarSection from './SidebarSection';

const SidebarModeSection: React.FC<{ sidebarOpen: boolean }> = ({ sidebarOpen }) => {
  const { 
    state: { viewMode }, 
    setViewMode
  } = useAppContext();
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user is on specific routes
  const isStrategicReview = location.pathname === '/strategic-review';
  const isHistory = location.pathname === '/history';
  
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
  
  return (
    <SidebarSection title="Modos" sidebarOpen={sidebarOpen}>
      <SidebarNavItem 
        icon={LayoutDashboard} 
        label="Modo Potência"
        path="/"
        isActive={viewMode === 'power' && !isStrategicReview && !isHistory}
        onClick={handlePowerModeClick}
      />
      
      <SidebarNavItem 
        icon={CalendarClock} 
        label="Modo Cronologia"
        path="/"
        isActive={viewMode === 'chronological' && !isStrategicReview && !isHistory}
        onClick={handleChronologicalModeClick}
      />
      
      <SidebarNavItem 
        icon={BarChart} 
        label="Revisão Estratégica"
        path="/strategic-review"
        isActive={isStrategicReview}
      />
    </SidebarSection>
  );
};

export default SidebarModeSection;
