
import React from 'react';
import { TaskFormData } from '../types';
import RatingSlider from './RatingSlider';
import TaskScoreDisplay from './TaskScoreDisplay';
import { 
  CONSEQUENCE_PHRASES, 
  PRIDE_PHRASES, 
  CONSTRUCTION_PHRASES 
} from '../constants';

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

  return (
    <>
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Título da Tarefa
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="O que precisa ser feito?"
          required
        />
      </div>

      <RatingSlider
        value={formData.consequenceScore}
        onChange={(value) => setFormData(prev => ({ ...prev, consequenceScore: value }))}
        color="blue"
        label="Consequência de Ignorar"
        description={CONSEQUENCE_PHRASES}
      />

      <RatingSlider
        value={formData.prideScore}
        onChange={(value) => setFormData(prev => ({ ...prev, prideScore: value }))}
        color="orange"
        label="Orgulho pós-execução"
        description={PRIDE_PHRASES}
      />

      <RatingSlider
        value={formData.constructionScore}
        onChange={(value) => setFormData(prev => ({ ...prev, constructionScore: value }))}
        color="green"
        label="Força de construção pessoal"
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
          value={formData.idealDate ? new Date(formData.idealDate.getTime() - (formData.idealDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : ''}
          onChange={handleDateChange}
          className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
        <TaskScoreDisplay score={totalScore} />
      </div>
    </>
  );
};

export default TaskFormFields;
