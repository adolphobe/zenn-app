
import React from 'react';
import { Task } from '@/types';
import RatingSliderReadOnly from '@/components/ui/rating-slider-readonly';

interface TaskLevelsContentProps {
  task: Task;
  isMobile: boolean;
}

const TaskLevelsContent: React.FC<TaskLevelsContentProps> = ({ task, isMobile }) => {
  if (!task) return null;

  // Get the appropriate score color based on the total score value
  const getScoreColorClass = (score: number) => {
    if (score >= 14) {
      return "text-red-600 dark:text-red-400";
    } else if (score >= 11) {
      return "text-orange-500 dark:text-orange-400";
    } else if (score >= 8) {
      return "text-blue-600 dark:text-blue-400";
    } else {
      return "text-slate-500 dark:text-slate-400";
    }
  };

  // Get the score label based on the total score value
  const getScoreLabel = (score: number) => {
    if (score >= 14) {
      return "Tarefa Crítica";
    } else if (score >= 11) {
      return "Tarefa Importante";
    } else if (score >= 8) {
      return "Tarefa Moderada";
    } else {
      return "Tarefa Leve";
    }
  };

  // Frases explicativas para Risco (Consequência)
  const riskExplanations = [
    "Zero risco - posso ignorar",
    "Risco baixo - não urgente",
    "Risco médio - requer atenção",
    "Risco alto - precisa de ação",
    "Risco extremo - consequências graves"
  ];
  
  // Frases explicativas para Orgulho
  const prideExplanations = [
    "Sem valor para mim",
    "Apenas evita problemas",
    "Dá alguma satisfação",
    "Importante para mim",
    "Me deixará muito orgulhoso"
  ];
  
  // Frases explicativas para Crescimento pessoal
  const growthExplanations = [
    "Não me desenvolve",
    "Pouca aprendizagem",
    "Desenvolve algumas habilidades",
    "Expande meus limites",
    "Transforma meu potencial"
  ];

  const scoreColorClass = getScoreColorClass(task.totalScore || 0);
  const scoreLabel = getScoreLabel(task.totalScore || 0);

  return (
    <>
      {isMobile ? (
        <>
          <div className="space-y-6">
            <RatingSliderReadOnly
              value={task.consequenceScore}
              color="blue"
              label="Risco"
              description={riskExplanations}
            />
            
            <RatingSliderReadOnly
              value={task.prideScore}
              color="orange"
              label="Orgulho"
              description={prideExplanations}
            />
            
            <RatingSliderReadOnly
              value={task.constructionScore}
              color="green"
              label="Crescimento pessoal"
              description={growthExplanations}
            />
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
              <div className="text-center mb-5">
                <span className={`text-3xl font-bold ${scoreColorClass}`}>{task.totalScore || 0}/15</span>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{scoreLabel}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Avaliação da tarefa:
              </label>
            </div>
            
            <RatingSliderReadOnly
              value={task.consequenceScore}
              color="blue"
              label="Risco"
              description={riskExplanations}
            />
            
            <RatingSliderReadOnly
              value={task.prideScore}
              color="orange"
              label="Orgulho"
              description={prideExplanations}
            />
            
            <RatingSliderReadOnly
              value={task.constructionScore}
              color="green"
              label="Crescimento pessoal"
              description={growthExplanations}
            />
          </div>
          
          <div className="space-y-6 mt-[33px]">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm p-[34px] rounded-[18px]">
              <div className="text-center mb-5">
                <span className={`text-3xl font-bold ${scoreColorClass}`}>{task.totalScore || 0}/15</span>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{scoreLabel}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskLevelsContent;
