
import React from 'react';

interface RatingSliderReadOnlyProps {
  value: number;
  color: string;
  label: string;
  description: string[];
}

const RatingSliderReadOnly: React.FC<RatingSliderReadOnlyProps> = ({ 
  value = 3, 
  color, 
  label, 
  description 
}) => {
  // Map colors to Tailwind color classes
  const colorMap: Record<string, { base: string, gradientFrom: string, gradientTo: string }> = {
    blue: { base: 'blue', gradientFrom: 'blue-400', gradientTo: 'blue-600' },
    orange: { base: 'orange', gradientFrom: 'orange-300', gradientTo: 'orange-500' },
    green: { base: 'green', gradientFrom: 'green-400', gradientTo: 'green-600' },
    red: { base: 'red', gradientFrom: 'red-400', gradientTo: 'red-600' },
  };

  const colorObj = colorMap[color] || colorMap.blue;
  
  const getExplanation = () => {
    if (!description || description.length === 0) return '';
    return description[Math.min(Math.max(0, value - 1), description.length - 1)];
  };

  return (
    <div className={`flex flex-col w-full px-4 py-3 bg-${colorObj.base}-50 dark:bg-${colorObj.base}-900/20 rounded-xl`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className={`text-base font-medium text-${colorObj.base}-600 dark:text-${colorObj.base}-400`}>{label}</h2>
        <span className={`text-sm font-medium text-${colorObj.base}-600 dark:text-${colorObj.base}-400`}>{value}/5</span>
      </div>
      
      {/* Custom Track - Empty */}
      <div className="relative h-4 mb-2">
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
        
        {/* Custom Track - Gradient */}
        <div 
          className={`absolute top-1/2 transform -translate-y-1/2 h-4 rounded-full bg-gradient-to-r from-${colorObj.gradientFrom} to-${colorObj.gradientTo}`}
          style={{ width: value === 1 ? '5%' : `${(value - 1) * 25}%` }}
        ></div>
        
        {/* Markers */}
        <div className="absolute mt-5 w-full flex justify-between px-1">
          {[1, 2, 3, 4, 5].map((mark) => (
            <div 
              key={mark} 
              className={`h-1.5 w-1.5 rounded-full ${mark <= value ? `bg-${colorObj.base}-500` : 'bg-gray-200 dark:bg-gray-600'}`}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Explanatory text */}
      <p className={`text-sm text-${colorObj.base}-600 dark:text-${colorObj.base}-400 mt-4 min-h-6`}>
        {getExplanation()}
      </p>
    </div>
  );
};

export default RatingSliderReadOnly;
