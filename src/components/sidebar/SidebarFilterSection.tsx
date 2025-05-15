
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Eye } from 'lucide-react';
import SidebarSection from './SidebarSection';
import SidebarNavItem from './SidebarNavItem';

const SidebarFilterSection: React.FC<{ sidebarOpen: boolean }> = ({ sidebarOpen }) => {
  const { 
    state: { showHiddenTasks, showPillars, showDates }, 
    toggleShowHiddenTasks,
    toggleShowPillars,
    toggleShowDates
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
      <SidebarNavItem
        icon={Eye}
        label="Pilares no card"
        path="#"
        isActive={showPillars}
        onClick={toggleShowPillars}
      />
      <SidebarNavItem
        icon={Eye}
        label="Data visível"
        path="#"
        isActive={showDates}
        onClick={toggleShowDates}
      />
    </SidebarSection>
  );
};

export default SidebarFilterSection;
