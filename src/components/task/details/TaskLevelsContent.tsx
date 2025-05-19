
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
          <span className="text-3xl font-bold">{task.totalScore || 0}/15</span>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pontuação total</p>
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
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm mt-[33px]">
          <div className="text-center">
            <span className="text-3xl font-bold">{task.totalScore || 0}/15</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pontuação total</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskLevelsContent;
