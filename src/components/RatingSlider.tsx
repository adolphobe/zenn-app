
import React, { useState } from 'react';

interface RatingSliderProps {
  value: number;
  onChange: (value: number) => void;
  maxValue?: number;
  color: 'azul' | 'laranja' | 'verde';
  label: string;
  description: string[];
  className?: string;
}

const RatingSlider: React.FC<RatingSliderProps> = ({
  value,
  onChange,
  maxValue = 5,
  color,
  label,
  description,
  className
}) => {
  // Estado para controle de arrastar
  const [isDragging, setIsDragging] = useState(false);
  
  // Função para determinar qual classe de cor usar
  const getColorClasses = () => {
    switch(color) {
      case 'azul':
        return {
          container: 'container-slider container-slider-azul',
          titulo: 'titulo-slider titulo-slider-azul',
          ponto: 'ponto-slider ponto-slider-azul',
          pontoAtivo: 'ponto-slider ponto-slider-azul ponto-ativo',
          progresso: 'progresso-azul',
          descricao: 'descricao-slider descricao-slider-azul'
        };
      case 'laranja':
        return {
          container: 'container-slider container-slider-laranja',
          titulo: 'titulo-slider titulo-slider-laranja',
          ponto: 'ponto-slider ponto-slider-laranja',
          pontoAtivo: 'ponto-slider ponto-slider-laranja ponto-ativo',
          progresso: 'progresso-laranja',
          descricao: 'descricao-slider descricao-slider-laranja'
        };
      case 'verde':
        return {
          container: 'container-slider container-slider-verde',
          titulo: 'titulo-slider titulo-slider-verde',
          ponto: 'ponto-slider ponto-slider-verde',
          pontoAtivo: 'ponto-slider ponto-slider-verde ponto-ativo',
          progresso: 'progresso-verde',
          descricao: 'descricao-slider descricao-slider-verde'
        };
      default:
        return {
          container: 'container-slider container-slider-azul',
          titulo: 'titulo-slider titulo-slider-azul',
          ponto: 'ponto-slider ponto-slider-azul',
          pontoAtivo: 'ponto-slider ponto-slider-azul ponto-ativo',
          progresso: 'progresso-azul',
          descricao: 'descricao-slider descricao-slider-azul'
        };
    }
  };

  const colorClasses = getColorClasses();
  
  // Calcular largura da barra de progresso (0% quando value=1, 100% quando value=maxValue)
  const progressWidth = value === 1 ? '0%' : `${((value - 1) / (maxValue - 1)) * 100}%`;
  
  // Manipulador de clique nos pontos
  const handlePointClick = (newValue: number) => {
    onChange(newValue);
  };

  // Manipuladores para arrastar
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // Calcular posição relativa e converter para valor (1-5)
    let newPosition = Math.max(0, Math.min(1, x / width));
    let newValue = Math.ceil(newPosition * maxValue);
    if (newValue === 0) newValue = 1;
    
    onChange(newValue);
  };

  // Garantir que os eventos de mouse são removidos quando o componente é desmontado
  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div className={`${colorClasses.container} ${className || ''}`}>
      <div className="cabecalho-slider">
        <h3 className={colorClasses.titulo}>{label}</h3>
        <span className={`valor-slider ${colorClasses.titulo}`}>{value}/{maxValue}</span>
      </div>
      
      {/* Container para os pontos e barra de progresso */}
      <div 
        className="container-slider-pontos cursor-arrastar"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {/* Barra de progresso de fundo */}
        <div className="barra-progresso">
          {/* Barra de progresso colorida - visível apenas quando o valor > 1 */}
          {value > 1 && (
            <div 
              className={`barra-progresso ${colorClasses.progresso}`}
              style={{ width: progressWidth }}
            ></div>
          )}
        </div>
        
        {/* Pontos */}
        {Array.from({ length: maxValue }, (_, i) => i + 1).map((point) => (
          <div
            key={point}
            className={point <= value ? colorClasses.pontoAtivo : colorClasses.ponto}
            onClick={() => handlePointClick(point)}
          />
        ))}
      </div>
      
      {/* Descrição que muda com o valor */}
      <p className={colorClasses.descricao}>
        {description[value - 1]}
      </p>
    </div>
  );
};

export default RatingSlider;
