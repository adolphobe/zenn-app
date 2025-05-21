
import React from 'react';
import { TaskFormData } from '../types';
import TaskScoreDisplay from './TaskScoreDisplay';
import { useIsMobile } from '../hooks/use-mobile';
import { dateService } from '@/services/dateService';
import ColoredSlider from './ColoredSlider';

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
          <ColoredSlider
            color="blue"
            gradientFrom="blue-400"
            gradientTo="blue-600"
            value={formData.consequenceScore || 3}
            onChange={(value) => setFormData(prev => ({ ...prev, consequenceScore: value }))}
            label="Risco"
            explanations={riskExplanations}
          />

          <ColoredSlider
            color="orange"
            gradientFrom="orange-300"
            gradientTo="orange-500"
            value={formData.prideScore || 3}
            onChange={(value) => setFormData(prev => ({ ...prev, prideScore: value }))}
            label="Orgulho"
            explanations={prideExplanations}
          />

          <ColoredSlider
            color="green"
            gradientFrom="green-400"
            gradientTo="green-600"
            value={formData.constructionScore || 3}
            onChange={(value) => setFormData(prev => ({ ...prev, constructionScore: value }))}
            label="Crescimento pessoal"
            explanations={growthExplanations}
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
