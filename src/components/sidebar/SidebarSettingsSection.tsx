
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Moon, Sun, Settings } from 'lucide-react';
import SidebarSection from './SidebarSection';
import SidebarNavItem from './SidebarNavItem';
import { useLocation, useNavigate } from 'react-router-dom';

const SidebarSettingsSection: React.FC<{ sidebarOpen: boolean }> = ({ sidebarOpen }) => {
  const { 
    state: { darkMode }, 
    toggleDarkMode
  } = useAppContext();
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if current route is settings
  const isSettings = location.pathname === '/settings';
  
  const goToSettings = () => {
    navigate('/settings');
  };
  
  return (
    <SidebarSection title="Configurações" sidebarOpen={sidebarOpen}>
      <SidebarNavItem
        icon={darkMode ? Sun : Moon}
        label={darkMode ? 'Modo Claro' : 'Modo Escuro'}
        path="#"
        onClick={toggleDarkMode}
      />
      
      <SidebarNavItem
        icon={Settings}
        label="Configurações"
        path="/settings"
        isActive={isSettings}
        onClick={goToSettings}
      />
    </SidebarSection>
  );
};

export default SidebarSettingsSection;
