
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Eye } from 'lucide-react';
import SidebarSection from './SidebarSection';
import SidebarNavItem from './SidebarNavItem';

const SidebarFilterSection: React.FC<{ sidebarOpen: boolean }> = ({ sidebarOpen }) => {
  const { 
    state: { showHiddenTasks }, 
    toggleShowHiddenTasks
  } = useAppContext();
  
  return (
    <SidebarSection title="Filtros" sidebarOpen={sidebarOpen}>
      <SidebarNavItem
        icon={Eye}
        label="Tarefas ocultas"
        path="#"
        isActive={showHiddenTasks}
        onClick={toggleShowHiddenTasks}
      />
    </SidebarSection>
  );
};

export default SidebarFilterSection;
