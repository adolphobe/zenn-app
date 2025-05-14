
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { TaskFormData } from '../types';
import RatingSlider from './RatingSlider';
import { 
  CONSEQUENCE_PHRASES, 
  PRIDE_PHRASES, 
  CONSTRUCTION_PHRASES 
} from '../constants';
import { X } from 'lucide-react';

interface TaskFormProps {
  onClose: () => void;
  initialData?: TaskFormData;
  taskId?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, initialData, taskId }) => {
  const [formData, setFormData] = useState<TaskFormData>(initialData || {
    title: '',
    consequenceScore: 3,
    prideScore: 3,
    constructionScore: 3,
    idealDate: null
  });
  
  const { addTask, updateTask } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      // Show error
      return;
    }
    
    if (taskId) {
      updateTask(taskId, formData);
    } else {
      addTask(formData);
    }
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
    <div className="fundo-modal aparecer-suave">
      <div className="conteudo-modal">
        <div className="cabecalho-modal">
          <h2 className="subtitulo">{taskId ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
          <button 
            onClick={onClose} 
            className="botao botao-circular botao-circular-pequeno botao-secundario"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="corpo-modal espaco-entre-itens-g flex-coluna">
          <div className="campo-formulario">
            <label htmlFor="title" className="rotulo-campo">
              Título da Tarefa
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="entrada-texto"
              placeholder="O que precisa ser feito?"
              required
            />
          </div>

          <div className="campo-formulario">
            <label htmlFor="idealDate" className="rotulo-campo">
              Data/Hora Ideal (opcional)
            </label>
            <input
              type="datetime-local"
              id="idealDate"
              name="idealDate"
              value={formData.idealDate ? new Date(formData.idealDate.getTime() - (formData.idealDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : ''}
              onChange={handleDateChange}
              className="entrada-texto"
            />
          </div>

          <RatingSlider
            value={formData.consequenceScore}
            onChange={(value) => setFormData(prev => ({ ...prev, consequenceScore: value }))}
            color="azul"
            label="Consequência de Ignorar"
            description={CONSEQUENCE_PHRASES}
          />

          <RatingSlider
            value={formData.prideScore}
            onChange={(value) => setFormData(prev => ({ ...prev, prideScore: value }))}
            color="laranja"
            label="Orgulho pós-execução"
            description={PRIDE_PHRASES}
          />

          <RatingSlider
            value={formData.constructionScore}
            onChange={(value) => setFormData(prev => ({ ...prev, constructionScore: value }))}
            color="verde"
            label="Força de construção pessoal"
            description={CONSTRUCTION_PHRASES}
          />

          <div className="card margem-topo-m">
            <div className="flex-entre">
              <span className="texto-normal">Score Total:</span>
              <span className="texto-normal subtitulo">{totalScore}/15</span>
            </div>
            <div className="texto-pequeno texto-secundario margem-topo-p">
              {totalScore >= 14 ? "Tarefa Crítica" : 
               totalScore >= 11 ? "Tarefa Importante" : 
               totalScore >= 8 ? "Tarefa Moderada" : 
               "Tarefa Leve (ficará oculta por padrão)"}
            </div>
          </div>

          <div className="flex espaco-entre-itens-m" style={{justifyContent: 'flex-end'}}>
            <button
              type="button"
              onClick={onClose}
              className="botao botao-secundario"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="botao botao-primario"
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
