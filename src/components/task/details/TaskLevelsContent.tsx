
import React from 'react';
import { Task } from '@/types';
import { CONSEQUENCE_PHRASES, PRIDE_PHRASES, CONSTRUCTION_PHRASES } from '@/constants';
import RatingSliderReadOnly from '@/components/ui/rating-slider-readonly';

interface TaskLevelsContentProps {
  task: Task;
  isMobile?: boolean;
}

const TaskLevelsContent: React.FC<TaskLevelsContentProps> = ({ task, isMobile = false }) => {
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

  const scoreColorClass = getScoreColorClass(task.totalScore || 0);
  const scoreLabel = getScoreLabel(task.totalScore || 0);
  
  return isMobile ? (
    <div className="space-y-6">
      <RatingSliderReadOnly
        value={task.consequenceScore}
        color="blue"
        label="Risco"
        description={CONSEQUENCE_PHRASES}
      />
      
      <RatingSliderReadOnly
        value={task.prideScore}
        color="orange"
        label="Orgulho"
        description={PRIDE_PHRASES}
      />
      
      <RatingSliderReadOnly
        value={task.constructionScore}
        color="green"
        label="Crescimento pessoal"
        description={CONSTRUCTION_PHRASES}
      />
      
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm mt-6">
        <div className="text-center">
          <span className={`text-3xl font-bold ${scoreColorClass}`}>{task.totalScore || 0}/15</span>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{scoreLabel}</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-6">
        <RatingSliderReadOnly
          value={task.consequenceScore}
          color="blue"
          label="Risco"
          description={CONSEQUENCE_PHRASES}
        />
        
        <RatingSliderReadOnly
          value={task.prideScore}
          color="orange"
          label="Orgulho"
          description={PRIDE_PHRASES}
        />
        
        <RatingSliderReadOnly
          value={task.constructionScore}
          color="green"
          label="Crescimento pessoal"
          description={CONSTRUCTION_PHRASES}
        />
      </div>
      
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm mt-[3px] mb-[30px]">
          <div className="text-center">
            <span className={`text-3xl font-bold ${scoreColorClass}`}>{task.totalScore || 0}/15</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{scoreLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskLevelsContent;
