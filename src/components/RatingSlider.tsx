
import React from 'react';
import { cn } from "@/lib/utils";

interface RatingSliderProps {
  value: number;
  onChange: (value: number) => void;
  maxValue?: number;
  color: 'blue' | 'orange' | 'green';
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
  // Define styling based on color theme
  const colorStyles = {
    blue: {
      bg: 'bg-blue-50',
      track: 'bg-blue-200',
      fill: 'bg-blue-500',
      text: 'text-blue-700',
      border: 'border-blue-200',
      activeBorder: 'border-blue-500',
      hover: 'hover:bg-blue-100',
      gradient: 'from-blue-300 to-blue-500'
    },
    orange: {
      bg: 'bg-orange-50',
      track: 'bg-orange-200',
      fill: 'bg-orange-500',
      text: 'text-orange-700',
      border: 'border-orange-200',
      activeBorder: 'border-orange-500',
      hover: 'hover:bg-orange-100',
      gradient: 'from-orange-300 to-orange-500'
    },
    green: {
      bg: 'bg-emerald-50',
      track: 'bg-emerald-200',
      fill: 'bg-emerald-500',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      activeBorder: 'border-emerald-500',
      hover: 'hover:bg-emerald-100',
      gradient: 'from-emerald-300 to-emerald-500'
    }
  };

  const styles = colorStyles[color];
  
  // Create array of possible values
  const values = Array.from({ length: maxValue }, (_, i) => i + 1);

  return (
    <div className={cn("rounded-lg p-5 mb-6 transition-all", styles.bg, className)}>
      <div className="flex justify-between items-center mb-3">
        <h3 className={cn("font-medium text-sm", styles.text)}>{label}</h3>
        <span className={cn("font-semibold text-sm", styles.text)}>
          {value}/{maxValue}
        </span>
      </div>
      
      <div className="relative mb-4">
        {/* Track background */}
        <div className={cn("h-2 w-full rounded-full", styles.track)} />
        
        {/* Filled portion with gradient */}
        <div 
          className={cn(
            "absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r",
            styles.gradient
          )}
          style={{ width: `${(value / maxValue) * 100}%` }}
        />
        
        {/* Step indicators */}
        <div className="absolute top-0 left-0 w-full flex justify-between px-0">
          {values.map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => onChange(step)}
              className={cn(
                "w-5 h-5 rounded-full -mt-1.5 transition-all duration-200 border-2",
                step <= value 
                  ? cn("shadow-sm", styles.fill, styles.activeBorder) 
                  : cn("bg-white", styles.border, styles.hover)
              )}
              aria-label={`Set rating to ${step}`}
            />
          ))}
        </div>
      </div>
      
      {/* Description text that changes based on selected value */}
      <p className={cn("text-sm mt-3", styles.text)}>
        {description[value - 1]}
      </p>
    </div>
  );
};

export default RatingSlider;
