
import React from 'react';
import { Progress } from './ui/progress';

interface ScoreSliderProps {
  value: number;
  type: 'consequence' | 'pride' | 'construction';
  onChange: (value: number) => void;
  phrases: string[];
}

const ScoreSlider: React.FC<ScoreSliderProps> = ({ value, type, onChange, phrases }) => {
  // Definir cores baseadas no tipo
  const getColors = () => {
    switch(type) {
      case 'consequence':
        return {
          bgColor: 'bg-blue-100',
          activeColor: 'bg-gradient-to-r from-blue-300 to-blue-500',
          hoverColor: 'hover:bg-blue-300'
        };
      case 'pride':
        return {
          bgColor: 'bg-orange-100',
          activeColor: 'bg-gradient-to-r from-orange-300 to-orange-500',
          hoverColor: 'hover:bg-orange-300'
        };
      case 'construction':
        return {
          bgColor: 'bg-emerald-100',
          activeColor: 'bg-gradient-to-r from-emerald-300 to-emerald-500',
          hoverColor: 'hover:bg-emerald-300'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          activeColor: 'bg-gradient-to-r from-gray-300 to-gray-500',
          hoverColor: 'hover:bg-gray-300'
        };
    }
  };

  const { bgColor, activeColor, hoverColor } = getColors();

  return (
    <div className="mb-4">
      <div className="relative flex items-center h-8 mb-2">
        <div className={`absolute h-1 w-full rounded-full ${bgColor}`}></div>
        
        {/* Barra de progresso */}
        <div 
          className={`absolute h-1 rounded-full ${activeColor}`}
          style={{ width: `${(value / 5) * 100}%` }}
        ></div>
        
        {/* Pontos do slider */}
        <div className="relative flex justify-between w-full">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              className={`w-6 h-6 rounded-full transition-all duration-200 focus:outline-none transform ${
                score <= value
                  ? activeColor + ' shadow-md'
                  : bgColor + ' ' + hoverColor
              } ${
                score === value ? 'scale-110' : ''
              }`}
              aria-label={`Score ${score}`}
            />
          ))}
        </div>
      </div>
      
      <div className="text-sm text-gray-600 mt-1">
        {phrases[value - 1]}
      </div>
    </div>
  );
};

export default ScoreSlider;
