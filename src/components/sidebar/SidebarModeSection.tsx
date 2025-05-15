import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Lightbulb, Flame } from 'lucide-react';
import SidebarSection from './SidebarSection';

interface SidebarModeSectionProps {
  sidebarOpen: boolean;
  title?: string;
}

const SidebarModeSection: React.FC<SidebarModeSectionProps> = ({ sidebarOpen, title = "Modos" }) => {
  const { 
    state: { autoMode }, 
    toggleAutoMode 
  } = useAppContext();

  return (
    <SidebarSection title={title} sidebarOpen={sidebarOpen}>
      <button 
        className="sidebar-item w-full"
        onClick={toggleAutoMode}
      >
        <Lightbulb size={20} />
        {sidebarOpen && <span>{autoMode ? 'Manual' : 'Automático'}</span>}
      </button>
      
      <button className="sidebar-item w-full">
        <Flame size={20} />
        {sidebarOpen && <span>Foco</span>}
      </button>
    </SidebarSection>
  );
};

export default SidebarModeSection;
