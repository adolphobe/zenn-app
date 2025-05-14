
import React, { useState } from 'react';
import { Slider } from './ui/slider';

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
          hoverColor: 'hover:bg-blue-300',
          thumbColor: 'border-blue-500 bg-white',
          trackColor: 'bg-blue-300'
        };
      case 'pride':
        return {
          bgColor: 'bg-orange-100',
          activeColor: 'bg-gradient-to-r from-orange-300 to-orange-500',
          hoverColor: 'hover:bg-orange-300',
          thumbColor: 'border-orange-500 bg-white',
          trackColor: 'bg-orange-300'
        };
      case 'construction':
        return {
          bgColor: 'bg-emerald-100',
          activeColor: 'bg-gradient-to-r from-emerald-300 to-emerald-500',
          hoverColor: 'hover:bg-emerald-300',
          thumbColor: 'border-emerald-500 bg-white',
          trackColor: 'bg-emerald-300'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          activeColor: 'bg-gradient-to-r from-gray-300 to-gray-500',
          hoverColor: 'hover:bg-gray-300',
          thumbColor: 'border-gray-500 bg-white',
          trackColor: 'bg-gray-300'
        };
    }
  };

  const { bgColor, activeColor, hoverColor, thumbColor, trackColor } = getColors();

  // Handle slider value change
  const handleValueChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };

  // Create a custom rendering for the slider that shows our score dots
  return (
    <div className="mb-4">
      <div className="relative">
        {/* Slider using shadcn/ui slider with custom styling */}
        <Slider
          value={[value]}
          min={1}
          max={5}
          step={1}
          onValueChange={handleValueChange}
          className="py-4"
          // Override default Slider styles
          classNameInner={{
            track: `h-1 ${bgColor}`,
            range: `h-1 ${trackColor}`,
            thumb: `h-6 w-6 border-2 ${thumbColor} rounded-full shadow-md hover:scale-110 transition-transform cursor-grab active:cursor-grabbing`
          }}
        />
        
        {/* Custom score dots */}
        <div className="absolute top-4 -translate-y-1/2 w-full flex justify-between pointer-events-none">
          {[1, 2, 3, 4, 5].map((score) => (
            <div
              key={score}
              className={`w-6 h-6 rounded-full transition-all duration-200 transform ${
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
      
      <div className="text-sm text-gray-600 mt-3">
        {phrases[value - 1]}
      </div>
    </div>
  );
};

export default ScoreSlider;
