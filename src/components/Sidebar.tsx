
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  LayoutDashboard, 
  CalendarClock, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Eye,
  Moon,
  Sun
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { 
    state: { viewMode, showHiddenTasks, darkMode, sidebarOpen }, 
    setViewMode, 
    toggleShowHiddenTasks, 
    toggleDarkMode,
    toggleSidebar
  } = useAppContext();

  return (
    <div className={`barra-lateral ${sidebarOpen ? 'barra-lateral-expandida' : 'barra-lateral-recolhida'}`}>
      <div className="cabecalho-barra-lateral">
        <h1 className={`subtitulo ${!sidebarOpen && 'escondido'}`} style={{color: 'var(--cor-primaria)'}}>ACTO</h1>
        <button 
          onClick={toggleSidebar} 
          className="botao botao-circular botao-circular-pequeno botao-secundario"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <div className="conteudo-barra-lateral">
        <div className="secao-barra-lateral">
          <p className={`titulo-secao-barra-lateral ${!sidebarOpen && 'escondido'}`}>
            Modos
          </p>
          
          <button 
            className={`item-barra-lateral ${viewMode === 'power' ? 'item-barra-lateral-ativo' : ''}`}
            onClick={() => setViewMode('power')}
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Modo Potência</span>}
          </button>
          
          <button 
            className={`item-barra-lateral ${viewMode === 'chronological' ? 'item-barra-lateral-ativo' : ''}`}
            onClick={() => setViewMode('chronological')}
          >
            <CalendarClock size={20} />
            {sidebarOpen && <span>Modo Cronologia</span>}
          </button>
        </div>
        
        <div className="secao-barra-lateral">
          <p className={`titulo-secao-barra-lateral ${!sidebarOpen && 'escondido'}`}>
            Filtros
          </p>
          
          <button 
            className={`item-barra-lateral ${showHiddenTasks ? 'item-barra-lateral-ativo' : ''}`}
            onClick={toggleShowHiddenTasks}
          >
            <Eye size={20} />
            {sidebarOpen && <span>Mostrar Tarefas Ocultas</span>}
          </button>
        </div>
        
        <div className="secao-barra-lateral">
          <p className={`titulo-secao-barra-lateral ${!sidebarOpen && 'escondido'}`}>
            Configurações
          </p>
          
          <button 
            className="item-barra-lateral"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            {sidebarOpen && <span>{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>}
          </button>
          
          <button className="item-barra-lateral">
            <Settings size={20} />
            {sidebarOpen && <span>Configurações</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
