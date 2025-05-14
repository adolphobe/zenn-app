
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { TaskFormData } from '../types';
import ScoreSlider from './ScoreSlider';
import { 
  CONSEQUENCE_PHRASES, 
  PRIDE_PHRASES, 
  CONSTRUCTION_PHRASES 
} from '../constants';
import { X } from 'lucide-react';

interface TaskFormProps {
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    consequenceScore: 3,
    prideScore: 3,
    constructionScore: 3,
    idealDate: null
  });
  
  const { addTask } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      // Show error
      return;
    }
    
    addTask(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setFormData(prev => ({ ...prev, idealDate: null }));
      return;
    }

    // Convert local datetime string to Date object
    const date = new Date(e.target.value);
    setFormData(prev => ({ ...prev, idealDate: date }));
  };

  const totalScore = formData.consequenceScore + formData.prideScore + formData.constructionScore;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Nova Tarefa</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Título da Tarefa
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="O que precisa ser feito?"
              required
            />
          </div>

          <div>
            <label htmlFor="idealDate" className="block text-sm font-medium mb-1">
              Data/Hora Ideal (opcional)
            </label>
            <input
              type="datetime-local"
              id="idealDate"
              name="idealDate"
              onChange={handleDateChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <h3 className="font-medium mb-2 flex justify-between">
              <span>Consequência de Ignorar</span>
              <span>{formData.consequenceScore}/5</span>
            </h3>
            <ScoreSlider
              value={formData.consequenceScore}
              type="consequence"
              onChange={(value) => setFormData(prev => ({ ...prev, consequenceScore: value }))}
              phrases={CONSEQUENCE_PHRASES}
            />
          </div>

          <div>
            <h3 className="font-medium mb-2 flex justify-between">
              <span>Orgulho Pós-Execução</span>
              <span>{formData.prideScore}/5</span>
            </h3>
            <ScoreSlider
              value={formData.prideScore}
              type="pride"
              onChange={(value) => setFormData(prev => ({ ...prev, prideScore: value }))}
              phrases={PRIDE_PHRASES}
            />
          </div>

          <div>
            <h3 className="font-medium mb-2 flex justify-between">
              <span>Força de Construção Pessoal</span>
              <span>{formData.constructionScore}/5</span>
            </h3>
            <ScoreSlider
              value={formData.constructionScore}
              type="construction"
              onChange={(value) => setFormData(prev => ({ ...prev, constructionScore: value }))}
              phrases={CONSTRUCTION_PHRASES}
            />
          </div>

          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
            <div className="font-medium flex justify-between">
              <span>Score Total:</span>
              <span className="font-semibold">{totalScore}/15</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {totalScore >= 14 ? "Tarefa Crítica" : 
               totalScore >= 11 ? "Tarefa Importante" : 
               totalScore >= 8 ? "Tarefa Moderada" : 
               "Tarefa Leve (ficará oculta por padrão)"}
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 text-sm border rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
