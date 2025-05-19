
import React from 'react';
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface RatingSliderReadOnlyProps {
  value: number;
  maxValue?: number;
  color: 'blue' | 'orange' | 'green';
  label: string;
  description: string[];
  className?: string;
}

const RatingSliderReadOnly: React.FC<RatingSliderReadOnlyProps> = ({
  value,
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
  
  // Custom slider display logic for read only view
  const displayValue = value === 0 ? 1 : value;
  
  return (
    <div className={cn("rounded-lg p-5 mb-6 transition-all", styles.bg, className)}>
      <div className="flex justify-between items-center mb-3">
        <h3 className={cn("font-medium text-sm", styles.text)}>{label}</h3>
        <span className={cn("font-semibold text-sm", styles.text)}>
          {displayValue}/{maxValue}
        </span>
      </div>
      
      <div className="relative mb-4 px-3 py-1">
        {/* Read-only slider */}
        <Slider
          value={[value]}
          min={1}
          max={maxValue}
          step={1}
          disabled={true}
          classNames={{
            track: cn(styles.track),
            range: cn(
              "bg-gradient-to-r", 
              styles.gradient,
              value === 1 ? "opacity-0" : "opacity-100"
            ),
            thumb: cn(styles.fill, "cursor-default")
          }}
        />
        
        {/* Custom step indicators */}
        <div className="absolute top-0 left-0 w-full flex justify-between px-3 pointer-events-none">
          {Array.from({ length: maxValue }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={cn(
                "w-6 h-6 rounded-full border-2 transition-all duration-200",
                "transform translate-y-[-4px]", 
                step <= value
                  ? cn("bg-white", styles.activeBorder)
                  : cn("bg-white", styles.border)
              )}
            />
          ))}
        </div>
      </div>
      
      {/* Description text */}
      <p className={cn("text-sm mt-3 text-[14px]", styles.text)}>
        {description[value - 1] || ''}
      </p>
    </div>
  );
};

export default RatingSliderReadOnly;
