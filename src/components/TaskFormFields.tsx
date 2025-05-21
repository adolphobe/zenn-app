
import React from 'react';
import { TaskFormData } from '../types';
import RatingSlider from './RatingSlider';
import TaskScoreDisplay from './TaskScoreDisplay';
import { 
  CONSEQUENCE_PHRASES, 
  PRIDE_PHRASES, 
  CONSTRUCTION_PHRASES 
} from '../constants';
import { useIsMobile } from '../hooks/use-mobile';
import { dateService } from '@/services/dateService';

interface TaskFormFieldsProps {
  formData: TaskFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
}

const TaskFormFields: React.FC<TaskFormFieldsProps> = ({ 
  formData, 
  handleChange, 
  handleDateChange, 
  setFormData 
}) => {
  const totalScore = 
    (formData.consequenceScore || 0) + 
    (formData.prideScore || 0) + 
    (formData.constructionScore || 0);
  
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <div className="mb-2">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Avalie o peso da tarefa:
        </label>
      </div>
      
      {/* Layout responsivo que se ajusta entre vertical (mobile) e horizontal (desktop) */}
      <div className={`${isMobile ? 'space-y-5' : 'grid grid-cols-1 lg:grid-cols-2 gap-5'}`}>
        <div className="space-y-5">
          <RatingSlider
            value={formData.consequenceScore || 3}
            onChange={(value) => setFormData(prev => ({ ...prev, consequenceScore: value }))}
            color="blue"
            label="Risco"
            description={CONSEQUENCE_PHRASES}
          />

          <RatingSlider
            value={formData.prideScore || 3}
            onChange={(value) => setFormData(prev => ({ ...prev, prideScore: value }))}
            color="orange"
            label="Orgulho"
            description={PRIDE_PHRASES}
          />

          <RatingSlider
            value={formData.constructionScore || 3}
            onChange={(value) => setFormData(prev => ({ ...prev, constructionScore: value }))}
            color="green"
            label="Crescimento pessoal"
            description={CONSTRUCTION_PHRASES}
          />
        </div>
        
        <div className={`space-y-5 ${isMobile ? 'mt-5' : 'lg:mt-0'}`}>
          <div className={`p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm ${isMobile ? '' : 'lg:mb-8'}`}>
            <TaskScoreDisplay score={totalScore} />
          </div>
          
          <div>
            <label htmlFor="idealDate" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Data: (opcional)
            </label>
            <input
              type="datetime-local"
              id="idealDate"
              name="idealDate"
              value={dateService.formatForDateTimeInput(formData.idealDate)}
              onChange={handleDateChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFormFields;
