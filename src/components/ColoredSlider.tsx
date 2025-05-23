
import React, { useState, useRef, useEffect } from 'react';

interface ColoredSliderProps {
  color: string;
  gradientFrom: string;
  gradientTo: string;
  initialValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  label: string;
  explanations: string[];
}

const ColoredSlider: React.FC<ColoredSliderProps> = ({ 
  color, 
  gradientFrom, 
  gradientTo, 
  initialValue = 3, 
  value: controlledValue, 
  onChange,
  label, 
  explanations 
}) => {
  const [internalValue, setInternalValue] = useState(initialValue);
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  
  const getExplanation = () => {
    return explanations[value - 1];
  };
  
  const calculateValueFromPosition = (clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const position = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, position / rect.width));
      
      // Map to 1-5 range and round to nearest integer
      return Math.max(1, Math.min(5, Math.round(percentage * 4) + 1));
    }
    return value;
  };
  
  const updateValue = (newValue: number) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    const newValue = calculateValueFromPosition(e.clientX);
    updateValue(newValue);
    
    // Prevent text selection during drag
    e.preventDefault();
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (isDraggingRef.current) {
      const newValue = calculateValueFromPosition(e.clientX);
      updateValue(newValue);
    }
  };
  
  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    const newValue = calculateValueFromPosition(e.touches[0].clientX);
    updateValue(newValue);
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (isDraggingRef.current) {
      const newValue = calculateValueFromPosition(e.touches[0].clientX);
      updateValue(newValue);
    }
  };
  
  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };
  
  // Add and remove event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [value]); // Re-attach listeners when value changes
  
  // Generate container class based on color
  const containerClass = `flex flex-col w-full px-4 py-3 cursor-pointer bg-${color}-50 rounded-xl`;
  
  // Generate text classes based on color
  const textClass = `text-${color}-600`;
  
  return (
    <div 
      ref={containerRef}
      className={containerClass}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className={`text-base font-medium ${textClass}`}>{label}</h2>
        <span className={`text-sm font-medium ${textClass}`}>{value}/5</span>
      </div>
      
      {/* Custom Track - Empty */}
      <div className="relative h-4 mb-2">
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full"></div>
        
        {/* Custom Track - Gradient - Always show at least 5% width */}
        <div 
          style={{ 
            width: `${Math.max(5, (value - 1) * 25)}%`,
            background: `linear-gradient(to right, #${color === 'green' ? '68d391' : color === 'orange' ? 'fdb874' : color === 'blue' ? '60a5fa' : 'fc8181'}, #${color === 'green' ? '38a169' : color === 'orange' ? 'ed8936' : color === 'blue' ? '3182ce' : 'e53e3e'})`
          }}
          className="absolute top-1/2 transform -translate-y-1/2 h-4 rounded-full"
        ></div>
        
        {/* Markers */}
        <div className="absolute mt-5 w-full flex justify-between px-1">
          {[1, 2, 3, 4, 5].map((mark) => (
            <div 
              key={mark} 
              className={`h-1.5 w-1.5 rounded-full ${mark <= value ? `bg-${color}-500` : 'bg-gray-200'}`}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Explanatory text */}
      <p className={`text-sm ${textClass} mt-4 min-h-6`}>
        {getExplanation()}
      </p>
    </div>
  );
};

export default ColoredSlider;
