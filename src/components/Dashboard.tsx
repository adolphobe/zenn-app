
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { sortTasks } from '../utils';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { PlusCircle, Menu, Filter } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { state, toggleSidebar, updateDateDisplayOptions } = useAppContext();
  const { tasks, viewMode, showHiddenTasks, sidebarOpen, dateDisplayOptions } = state;

  const visibleTasks = tasks.filter(task => 
    !task.completed && (showHiddenTasks || !task.hidden)
  );
  const sortedTasks = sortTasks(visibleTasks, viewMode);
  const completedTasks = tasks.filter(task => task.completed);

  const toggleDateOption = (option: keyof typeof dateDisplayOptions) => {
    updateDateDisplayOptions({
      ...dateDisplayOptions,
      [option]: !dateDisplayOptions[option]
    });
  };

  return (
    <div className={sidebarOpen ? "margem-esquerda-16rem" : "margem-esquerda-5rem"} style={{ 
      marginLeft: sidebarOpen ? '16rem' : '5rem',
      transition: 'all 0.3s ease'
    }}>
      <header className="cabecalho-dashboard">
        <div className="flex-centro espaco-entre-itens-m">
          <button 
            className="botao botao-circular botao-secundario"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </button>
          <h1 className="titulo-principal">
            {viewMode === 'power' ? 'Modo Potência' : 'Modo Cronologia'}
          </h1>
        </div>
        
        <div className="flex-centro espaco-entre-itens-m">
          <div className="posicao-relativa">
            <button 
              className="botao botao-secundario"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              <span className="texto-normal">Filtros</span>
            </button>
            
            {showFilters && (
              <div className="card posicao-absoluta direita-0 topo-100 largura-minima-200px z-index-20 aparecer-suave" style={{
                position: 'absolute', 
                right: 0, 
                top: 'calc(100% + 0.5rem)', 
                minWidth: '200px', 
                zIndex: 20
              }}>
                <p className="texto-pequeno subtitulo margem-base-p">Opções de data</p>
                <div className="espaco-entre-itens-p flex-coluna">
                  <label className="flex-centro espaco-entre-itens-p cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={dateDisplayOptions.hideDate} 
                      onChange={() => toggleDateOption('hideDate')}
                      className="altura-4 largura-4"
                      style={{ height: '1rem', width: '1rem' }}
                    />
                    <span className="texto-pequeno">Ocultar Data</span>
                  </label>
                  <label className="flex-centro espaco-entre-itens-p cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={dateDisplayOptions.hideYear} 
                      onChange={() => toggleDateOption('hideYear')}
                      className="altura-4 largura-4"
                      style={{ height: '1rem', width: '1rem' }}
                    />
                    <span className="texto-pequeno">Ocultar Ano</span>
                  </label>
                  <label className="flex-centro espaco-entre-itens-p cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={dateDisplayOptions.hideTime} 
                      onChange={() => toggleDateOption('hideTime')}
                      className="altura-4 largura-4"
                      style={{ height: '1rem', width: '1rem' }}
                    />
                    <span className="texto-pequeno">Ocultar Hora</span>
                  </label>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="botao botao-circular botao-primario"
            aria-label="Nova tarefa"
          >
            <PlusCircle size={20} />
          </button>
        </div>
      </header>

      <main className="container-principal">
        <div className="margem-base-g">
          <h2 className="titulo-secao">Suas Tarefas</h2>
          <p className="texto-pequeno texto-secundario">
            {viewMode === 'power' 
              ? 'Ordenadas por potência (score total)' 
              : 'Ordenadas por data ideal'
            }
          </p>
        </div>

        <div className="espaco-entre-itens-m flex-coluna">
          {sortedTasks.length > 0 ? (
            sortedTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <div className="flex-centro-completo padding-g" style={{ padding: '2.5rem', backgroundColor: 'var(--cor-fundo-secundario)', borderRadius: 'var(--borda-raio)' }}>
              <p className="texto-secundario">
                Nenhuma tarefa encontrada.
                {!showHiddenTasks && (
                  <button 
                    className="texto-link margem-esquerda-xs"
                    onClick={() => {
                      useAppContext().toggleShowHiddenTasks();
                    }}
                    style={{ color: 'var(--cor-primaria)', marginLeft: '0.25rem', cursor: 'pointer', textDecoration: 'none' }}
                  >
                    Mostrar tarefas ocultas?
                  </button>
                )}
              </p>
            </div>
          )}
        </div>

        {completedTasks.length > 0 && (
          <div className="margem-topo-g">
            <h2 className="titulo-secao margem-base-m">Tarefas Concluídas</h2>
            <div className="espaco-entre-itens-m flex-coluna">
              {completedTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}
      </main>

      {showForm && <TaskForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default Dashboard;
