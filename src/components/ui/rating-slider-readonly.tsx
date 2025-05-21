
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

  // Generate CSS classes for the container
  const containerClass = `flex flex-col w-full px-4 py-3 bg-${colorObj.base}-50 dark:bg-${colorObj.base}-900/20 rounded-xl`;
  
  // Generate CSS classes for the header elements
  const headerTextClass = `text-${colorObj.base}-600 dark:text-${colorObj.base}-400`;
  
  // Generate CSS classes for the markers
  const markerActiveClass = `bg-${colorObj.base}-500`;
  
  // Generate CSS class for the explanation text
  const explanationClass = `text-sm text-${colorObj.base}-600 dark:text-${colorObj.base}-400 mt-4 min-h-6`;

  return (
    <div className={containerClass}>
      <div className="flex justify-between items-center mb-3">
        <h2 className={`text-base font-medium ${headerTextClass}`}>{label}</h2>
        <span className={`text-sm font-medium ${headerTextClass}`}>{value}/5</span>
      </div>
      
      {/* Custom Track - Empty */}
      <div className="relative h-4 mb-2">
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
        
        {/* Custom Track - Gradient - Always show at least 5% width */}
        <div 
          className={`absolute top-1/2 transform -translate-y-1/2 h-4 rounded-full`}
          style={{ 
            width: `${Math.max(5, (value - 1) * 25)}%`,
            background: `linear-gradient(to right, #${color === 'green' ? '68d391' : color === 'orange' ? 'fdb874' : color === 'blue' ? '60a5fa' : 'fc8181'}, #${color === 'green' ? '38a169' : color === 'orange' ? 'ed8936' : color === 'blue' ? '3182ce' : 'e53e3e'})`
          }}
        ></div>
        
        {/* Markers */}
        <div className="absolute mt-5 w-full flex justify-between px-1">
          {[1, 2, 3, 4, 5].map((mark) => (
            <div 
              key={mark} 
              className={`h-1.5 w-1.5 rounded-full ${mark <= value ? markerActiveClass : 'bg-gray-200 dark:bg-gray-600'}`}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Explanatory text */}
      <p className={explanationClass}>
        {getExplanation()}
      </p>
    </div>
  );
};

export default RatingSliderReadOnly;
