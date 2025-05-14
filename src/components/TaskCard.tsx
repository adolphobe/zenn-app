
import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../types';
import { useAppContext } from '../context/AppContext';
import { formatDate, getTaskPriorityClass } from '../utils';
import { Check, Pencil, EyeOff, CheckCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(task.title);
  const { toggleTaskCompleted, toggleTaskHidden, deleteTask, updateTaskTitle, state } = useAppContext();
  const { dateDisplayOptions } = state;
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Determinar classe CSS baseada na prioridade da tarefa
  const getPriorityClass = () => {
    const total = task.totalScore;
    if (total >= 14) return 'card-tarefa-critica';
    if (total >= 11) return 'card-tarefa-importante';
    if (total >= 8) return 'card-tarefa-moderada';
    return 'card-tarefa-leve';
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };

  const handleTitleBlur = () => {
    if (titleValue.trim() !== task.title) {
      updateTaskTitle(task.id, titleValue.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (titleValue.trim() !== task.title) {
        updateTaskTitle(task.id, titleValue.trim());
      }
      setIsEditingTitle(false);
    } else if (e.key === 'Escape') {
      setTitleValue(task.title);
      setIsEditingTitle(false);
    }
  };

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    setTitleValue(task.title);
  }, [task.title]);

  return (
    <div
      className={`card-tarefa ${getPriorityClass()} ${task.completed ? 'opacidade-50' : ''}`}
      onClick={() => !isEditingTitle && setExpanded(!expanded)}
      style={{ opacity: task.completed ? 0.5 : 1, cursor: 'pointer' }}
    >
      <div className="flex-entre">
        <div className="flex-1">
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={titleValue}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              onClick={(e) => e.stopPropagation()}
              className="entrada-texto fundo-transparente borda-base"
              style={{
                backgroundColor: 'transparent',
                borderWidth: '0 0 1px 0',
                borderStyle: 'solid',
                borderColor: 'var(--cor-borda-escura)',
                width: '100%',
                padding: '0.25rem 0'
              }}
              autoFocus
            />
          ) : (
            <h3 
              className="subtitulo cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleTitleClick();
              }}
            >
              {task.title}
            </h3>
          )}
        </div>
        
        <div className="flex-centro">
          {task.idealDate && (
            <div className="texto-pequeno texto-direita margem-esquerda-m" style={{ textAlign: 'right', marginLeft: '0.75rem' }}>
              {formatDate(task.idealDate, dateDisplayOptions)}
            </div>
          )}
          <div className="badge-score" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '9999px',
            padding: '0.25rem 0.5rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            marginLeft: '0.5rem'
          }}>
            {task.totalScore}/15
          </div>
        </div>
      </div>
      
      <div className="flex espaco-entre-itens-p flex-wrap margem-topo-p" style={{ flexWrap: 'wrap', marginTop: '0.5rem', fontSize: '0.75rem' }}>
        <span>Consequência: {task.consequenceScore}</span>
        <span>|</span>
        <span>Orgulho: {task.prideScore}</span>
        <span>|</span>
        <span>Construção: {task.constructionScore}</span>
      </div>

      {expanded && (
        <div className="margem-topo-m aparecer-suave">
          <div className="espaco-entre-itens-p texto-pequeno">
            <p>
              <span className="margem-direita-xs" style={{ marginRight: '0.25rem' }}>🔥</span>
              Consequência de Ignorar: {task.consequenceScore} – {task.consequenceScore === 5 ? "Vou me sentir bem mal comigo mesmo por não ter feito." : 
                            task.consequenceScore === 4 ? "Se eu ignorar, vou ficar incomodado." :
                            task.consequenceScore === 3 ? "Vai dar aquela sensação de \"tô enrolando\", mas ainda dá pra tolerar." :
                            task.consequenceScore === 2 ? "Sei que devia fazer, mas não vou me cobrar." :
                            "Ignorar isso não muda nada na minha vida."}
            </p>
            <p>
              <span className="margem-direita-xs" style={{ marginRight: '0.25rem' }}>🏁</span>
              Orgulho pós-execução: {task.prideScore} – {task.prideScore === 5 ? "Total senso de potência. Vou me sentir acima da média." : 
                      task.prideScore === 4 ? "Vou me olhar com respeito." :
                      task.prideScore === 3 ? "Boa sensação de ter mantido o ritmo." :
                      task.prideScore === 2 ? "Leve alívio por ter feito." :
                      "Nenhum orgulho. Só rotina ou tarefa obrigatória."}
            </p>
            <p>
              <span className="margem-direita-xs" style={{ marginRight: '0.25rem' }}>🧱</span>
              Força de construção pessoal: {task.constructionScore} – {task.constructionScore === 5 ? "Essa tarefa solidifica quem eu quero me tornar." : 
                          task.constructionScore === 4 ? "Vai me posicionar num degrau acima da versão atual." :
                          task.constructionScore === 3 ? "Me move um pouco, mas não me desafia." :
                          task.constructionScore === 2 ? "Útil, mas não muda nada em mim." :
                          "Só me ocupa."}
            </p>
          </div>

          <div className="flex espaco-entre-itens-p margem-topo-m">
            <button 
              className="botao botao-secundario"
              onClick={(e) => {
                e.stopPropagation();
                toggleTaskHidden(task.id);
              }}
            >
              <EyeOff size={14} />
              {task.hidden ? 'Mostrar' : 'Ocultar'}
            </button>
            <button 
              className="botao botao-secundario"
              onClick={(e) => {
                e.stopPropagation();
                toggleTaskCompleted(task.id);
              }}
            >
              <CheckCircle size={14} />
              Concluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
