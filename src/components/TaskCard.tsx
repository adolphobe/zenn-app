
import React, { useState } from 'react';
import { Task } from '../types';
import { useAppContext } from '../context/AppContext';
import { formatDate, getTaskPriorityClass } from '../utils';
import { Check, Pencil, Eye, EyeOff } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [expanded, setExpanded] = useState(false);
  const { toggleTaskCompleted, toggleTaskHidden, deleteTask } = useAppContext();
  const priorityClass = getTaskPriorityClass(task.totalScore);

  return (
    <div
      className={`task-card ${priorityClass} ${task.completed ? 'opacity-50' : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-base font-medium flex-1">
          {task.title}
        </h3>
        <div className="flex items-center justify-center bg-white bg-opacity-40 rounded-full px-2 py-1 text-xs font-semibold ml-2">
          {task.totalScore}/15
        </div>
      </div>
      
      <div className="mt-2 text-xs flex flex-wrap gap-2">
        <span>Consequência: {task.consequenceScore}</span>
        <span>|</span>
        <span>Orgulho: {task.prideScore}</span>
        <span>|</span>
        <span>Construção: {task.constructionScore}</span>
      </div>
      
      {task.idealDate && (
        <div className="mt-2 text-xs">
          📆 Início ideal: {formatDate(task.idealDate)}
        </div>
      )}

      {expanded && (
        <div className="mt-4 animate-fade-in">
          <div className="space-y-2 text-sm">
            <p>
              <span className="inline-flex items-center mr-1">🔥</span>
              Consequência: {task.consequenceScore} – {task.consequenceScore === 5 ? "Vou me sentir bem mal comigo mesmo por não ter feito." : 
                            task.consequenceScore === 4 ? "Se eu ignorar, vou ficar incomodado." :
                            task.consequenceScore === 3 ? "Vai dar aquela sensação de \"tô enrolando\", mas ainda dá pra tolerar." :
                            task.consequenceScore === 2 ? "Sei que devia fazer, mas não vou me cobrar." :
                            "Ignorar isso não muda nada na minha vida."}
            </p>
            <p>
              <span className="inline-flex items-center mr-1">🏁</span>
              Orgulho: {task.prideScore} – {task.prideScore === 5 ? "Total senso de potência. Vou me sentir acima da média." : 
                      task.prideScore === 4 ? "Vou me olhar com respeito." :
                      task.prideScore === 3 ? "Boa sensação de ter mantido o ritmo." :
                      task.prideScore === 2 ? "Leve alívio por ter feito." :
                      "Nenhum orgulho. Só rotina ou tarefa obrigatória."}
            </p>
            <p>
              <span className="inline-flex items-center mr-1">🧱</span>
              Construção: {task.constructionScore} – {task.constructionScore === 5 ? "Essa tarefa solidifica quem eu quero me tornar." : 
                          task.constructionScore === 4 ? "Vai me posicionar num degrau acima da versão atual." :
                          task.constructionScore === 3 ? "Me move um pouco, mas não me desafia." :
                          task.constructionScore === 2 ? "Útil, mas não muda nada em mim." :
                          "Só me ocupa."}
            </p>
          </div>

          <div className="flex gap-2 mt-4 justify-end">
            <button 
              className="p-1 rounded bg-white bg-opacity-50 hover:bg-opacity-70 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                toggleTaskHidden(task.id);
              }}
            >
              {task.hidden ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button 
              className="p-1 rounded bg-white bg-opacity-50 hover:bg-opacity-70 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                toggleTaskCompleted(task.id);
              }}
            >
              <Check size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
