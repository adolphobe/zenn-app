
import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../types';
import { useAppContext } from '../context/AppContext';
import { formatDate, getTaskPriorityClass } from '../utils';
import { Check, Pencil, EyeOff, CheckCircle, Eye } from 'lucide-react';
import { Button } from './ui/button';
import PostCompletionFeedback from './PostCompletionFeedback';

interface TaskCardProps {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isExpanded, onToggleExpand }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(task.title);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const { toggleTaskCompleted, toggleTaskHidden, deleteTask, updateTaskTitle, state } = useAppContext();
  const { dateDisplayOptions, showHiddenTasks } = state;
  const priorityClass = getTaskPriorityClass(task.totalScore);
  const titleInputRef = useRef<HTMLInputElement>(null);

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

  const handleCompleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFeedbackModalOpen(true);
  };

  const handleFeedbackConfirm = (feedbackType: string) => {
    // In a future implementation, we would store the feedback
    // For now, just complete the task
    toggleTaskCompleted(task.id);
    setFeedbackModalOpen(false);
  };

  const handleFeedbackCancel = () => {
    setFeedbackModalOpen(false);
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
    <>
      <div
        className={`task-card ${priorityClass} ${task.completed ? 'opacity-50' : ''} relative`}
        onClick={() => !isEditingTitle && onToggleExpand(task.id)}
      >
        {/* Eye icon for hidden tasks that are only visible because of the filter - now with reduced opacity */}
        {task.hidden && showHiddenTasks && (
          <div className="absolute bottom-2 right-2 bg-gray-800/30 dark:bg-gray-200/30 text-white dark:text-gray-800 rounded-full p-1 z-10 opacity-40">
            <Eye size={16} />
          </div>
        )}
        
        <div className="flex justify-between items-start">
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
                className="w-full bg-transparent border-b border-gray-400 focus:outline-none py-1"
                autoFocus
              />
            ) : (
              <h3 
                className="text-base font-medium cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTitleClick();
                }}
              >
                {task.title}
              </h3>
            )}
          </div>
          
          <div className="flex items-center">
            {task.idealDate && (
              <div className="text-xs text-right ml-3">
                {formatDate(task.idealDate, dateDisplayOptions)}
              </div>
            )}
            <div className="flex items-center justify-center bg-white bg-opacity-40 rounded-full px-2 py-1 text-xs font-semibold ml-2">
              {task.totalScore}/15
            </div>
          </div>
        </div>
        
        <div className="mt-2 text-xs flex flex-wrap gap-2">
          <span>Consequência: {task.consequenceScore}</span>
          <span>|</span>
          <span>Orgulho: {task.prideScore}</span>
          <span>|</span>
          <span>Construção: {task.constructionScore}</span>
        </div>

        {isExpanded && (
          <div className="mt-4 animate-fade-in">
            <div className="space-y-3 text-sm">
              <div className="rounded-md bg-white px-3 py-2 text-blue-600 border border-blue-200">
                <span className="font-medium">Consequência de Ignorar:</span> {task.consequenceScore} – {task.consequenceScore === 5 ? "Vou me sentir bem mal comigo mesmo por não ter feito." : 
                          task.consequenceScore === 4 ? "Se eu ignorar, vou ficar incomodado." :
                          task.consequenceScore === 3 ? "Vai dar aquela sensação de \"tô enrolando\", mas ainda dá pra tolerar." :
                          task.consequenceScore === 2 ? "Sei que devia fazer, mas não vou me cobrar." :
                          "Ignorar isso não muda nada na minha vida."}
              </div>
              
              <div className="rounded-md bg-white px-3 py-2 text-orange-600 border border-orange-200">
                <span className="font-medium">Orgulho pós-execução:</span> {task.prideScore} – {task.prideScore === 5 ? "Total senso de potência. Vou me sentir acima da média." : 
                    task.prideScore === 4 ? "Vou me olhar com respeito." :
                    task.prideScore === 3 ? "Boa sensação de ter mantido o ritmo." :
                    task.prideScore === 2 ? "Leve alívio por ter feito." :
                    "Nenhum orgulho. Só rotina ou tarefa obrigatória."}
              </div>
              
              <div className="rounded-md bg-white px-3 py-2 text-green-600 border border-green-200">
                <span className="font-medium">Força de construção pessoal:</span> {task.constructionScore} – {task.constructionScore === 5 ? "Essa tarefa solidifica quem eu quero me tornar." : 
                        task.constructionScore === 4 ? "Vai me posicionar num degrau acima da versão atual." :
                        task.constructionScore === 3 ? "Me move um pouco, mas não me desafia." :
                        task.constructionScore === 2 ? "Útil, mas não muda nada em mim." :
                        "Só me ocupa."}
              </div>
            </div>

            <div className="flex gap-2 mt-4 justify-start">
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTaskHidden(task.id);
                }}
              >
                <EyeOff size={14} />
                {task.hidden ? 'Mostrar' : 'Ocultar'}
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                onClick={handleCompleteTask}
              >
                <CheckCircle size={14} />
                Concluir
              </Button>
            </div>
          </div>
        )}
      </div>

      <PostCompletionFeedback
        task={task}
        isOpen={feedbackModalOpen}
        onClose={handleFeedbackCancel}
        onConfirm={handleFeedbackConfirm}
      />
    </>
  );
};

export default TaskCard;
