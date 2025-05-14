
import React from 'react';
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

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
  
  // Custom slider display logic
  const displayValue = value === 0 ? 1 : value;
  const progressWidth = value === 1 ? 0 : `${((value - 1) / (maxValue - 1)) * 100}%`;
  
  // Handle slider change
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className={cn("rounded-lg p-5 mb-6 transition-all", styles.bg, className)}>
      <div className="flex justify-between items-center mb-3">
        <h3 className={cn("font-medium text-sm", styles.text)}>{label}</h3>
        <span className={cn("font-semibold text-sm", styles.text)}>
          {displayValue}/{maxValue}
        </span>
      </div>
      
      <div className="relative mb-4 px-3 py-1">
        {/* Interactive slider */}
        <Slider
          value={[value]}
          min={1}
          max={maxValue}
          step={1}
          onValueChange={handleSliderChange}
          classNames={{
            track: cn(styles.track),
            range: cn(
              "bg-gradient-to-r", 
              styles.gradient,
              value === 1 ? "opacity-0" : "opacity-100"
            ),
            thumb: cn(styles.fill, styles.activeBorder)
          }}
        />
        
        {/* Custom step indicators for visual clarity */}
        <div className="absolute top-0 left-0 w-full flex justify-between px-3 pointer-events-none">
  {Array.from({ length: maxValue }, (_, i) => i + 1).map((step) => (
    <div
      key={step}
      className={cn(
        "w-6 h-6 rounded-full border-2 transition-all duration-200", // Aumentei de w-5 h-5 para w-6 h-6
        // Ajuste o posicionamento vertical para cima
        "transform translate-y-0", // Ou você pode usar translate-y-[-4px] para mover 4px para cima
        step <= value
          ? cn("bg-white", styles.activeBorder)
          : cn("bg-white", styles.border)
      )}
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
