
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Moon, Sun, Settings } from 'lucide-react';
import SidebarSection from './SidebarSection';

const SidebarSettingsSection: React.FC<{ sidebarOpen: boolean }> = ({ sidebarOpen }) => {
  const { 
    state: { darkMode }, 
    toggleDarkMode
  } = useAppContext();
  
  return (
    <SidebarSection title="Configurações" sidebarOpen={sidebarOpen}>
      <button 
        className="sidebar-item w-full"
        onClick={toggleDarkMode}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        {sidebarOpen && <span>{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>}
      </button>
      
      <button className="sidebar-item w-full">
        <Settings size={20} />
        {sidebarOpen && <span>Configurações</span>}
      </button>
    </SidebarSection>
  );
};

export default SidebarSettingsSection;
