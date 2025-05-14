
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Eye } from 'lucide-react';
import SidebarSection from './SidebarSection';

const SidebarFilterSection: React.FC<{ sidebarOpen: boolean }> = ({ sidebarOpen }) => {
  const { 
    state: { showHiddenTasks }, 
    toggleShowHiddenTasks
  } = useAppContext();
  
  return (
    <SidebarSection title="Filtros" sidebarOpen={sidebarOpen}>
      <button 
        className={`sidebar-item text-start justify-start ${showHiddenTasks ? 'active justify-start' : ''} w-full`}
        onClick={toggleShowHiddenTasks}
      >
        <Eye size={20} />
        {sidebarOpen && <span className="text-left">Tarefas ocultas</span>}
      </button>
    </SidebarSection>
  );
};

export default SidebarFilterSection;
