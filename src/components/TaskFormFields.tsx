
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
  const totalScore = formData.consequenceScore + formData.prideScore + formData.constructionScore;
  const isMobile = useIsMobile();
  
  // Safe function to format date for datetime-local input
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    
    try {
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date for input:', date);
        return '';
      }
      
      // Adjust for timezone offset
      const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      return localDate.toISOString().slice(0, 16);
    } catch (error) {
      console.error('Error formatting date for input:', error);
      return '';
    }
  };
  
  // Mobile layout (vertical)
  if (isMobile) {
    return (
      <>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Avalie o peso da tarefa:
          </label>
        </div>
        
        <RatingSlider
          value={formData.consequenceScore}
          onChange={(value) => setFormData(prev => ({ ...prev, consequenceScore: value }))}
          color="blue"
          label="Risco"
          description={CONSEQUENCE_PHRASES}
          className="!mt-[12px]" // O "!" força a prioridade em Tailwind
        />

        <RatingSlider
          value={formData.prideScore}
          onChange={(value) => setFormData(prev => ({ ...prev, prideScore: value }))}
          color="orange"
          label="Orgulho"
          description={PRIDE_PHRASES}
        />

        <RatingSlider
          value={formData.constructionScore}
          onChange={(value) => setFormData(prev => ({ ...prev, constructionScore: value }))}
          color="green"
          label="Crescimento pessoal"
          description={CONSTRUCTION_PHRASES}
        />

        <div>
          <label htmlFor="idealDate" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            A partir de quando você quer se ver envolvido com isso?
          </label>
          <input
            type="datetime-local"
            id="idealDate"
            name="idealDate"
            value={formData.idealDate ? formatDateForInput(formData.idealDate) : ''}
            onChange={handleDateChange}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
          <TaskScoreDisplay score={totalScore} />
        </div>
      </>
    );
  }
  
  // Desktop layout (horizontal)
  return (
    <div className="space-y-6">
      {/* Left column with ratings */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Avalie o peso da tarefa:
            </label>
          </div>
          
          <RatingSlider
            value={formData.consequenceScore}
            onChange={(value) => setFormData(prev => ({ ...prev, consequenceScore: value }))}
            color="blue"
            label="Risco"
            description={CONSEQUENCE_PHRASES}
            className="!mt-[12px]" // O "!" força a prioridade em Tailwind
          />

          <RatingSlider
            value={formData.prideScore}
            onChange={(value) => setFormData(prev => ({ ...prev, prideScore: value }))}
            color="orange"
            label="Orgulho"
            description={PRIDE_PHRASES}
          />

          <RatingSlider
            value={formData.constructionScore}
            onChange={(value) => setFormData(prev => ({ ...prev, constructionScore: value }))}
            color="green"
            label="Crescimento pessoal"
            description={CONSTRUCTION_PHRASES}
          />
        </div>
        
        {/* Right column with score and date */}
        <div className="space-y-6 mt-[33px]">
          {/* Score display now comes first */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm p-[34px] rounded-[18px]">
            <TaskScoreDisplay score={totalScore} />
          </div>
          
          {/* Date input comes second */}
          <div>
            <label htmlFor="idealDate" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              A partir de quando você quer se ver envolvido com isso?
            </label>
            <input
              type="datetime-local"
              id="idealDate"
              name="idealDate"
              value={formData.idealDate ? formatDateForInput(formData.idealDate) : ''}
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
