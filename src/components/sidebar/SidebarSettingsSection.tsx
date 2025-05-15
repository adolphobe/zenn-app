
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Moon, Sun, Settings } from 'lucide-react';
import SidebarSection from './SidebarSection';
import SidebarNavItem from './SidebarNavItem';

const SidebarSettingsSection: React.FC<{ sidebarOpen: boolean }> = ({ sidebarOpen }) => {
  const { 
    state: { darkMode }, 
    toggleDarkMode
  } = useAppContext();
  
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
        path="#"
      />
    </SidebarSection>
  );
};

export default SidebarSettingsSection;
