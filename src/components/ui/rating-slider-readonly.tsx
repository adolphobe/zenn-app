
import React from 'react';
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface RatingSliderReadOnlyProps {
  value?: number | null;
  maxValue?: number;
  color?: 'blue' | 'orange' | 'green';
  label: string;
  description?: string[] | null;
  className?: string;
}

const RatingSliderReadOnly = ({
  value,
  maxValue = 5,
  color = 'blue',
  label,
  description = [],
  className
}: RatingSliderReadOnlyProps) => {
  // Ensure value is within valid range (1 to maxValue)
  const safeValue = React.useMemo(() => {
    const parsedValue = Number(value);
    if (isNaN(parsedValue) || parsedValue < 1) return 1;
    return Math.min(parsedValue, maxValue);
  }, [value, maxValue]);
  
  // Define color themes for different rating types
  const colorStyles = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      track: 'bg-blue-200 dark:bg-blue-800',
      fill: 'bg-blue-500',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      activeBorder: 'border-blue-500',
      hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/40',
      gradient: 'from-blue-300 to-blue-500 dark:from-blue-700 dark:to-blue-500'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-950/30',
      track: 'bg-orange-200 dark:bg-orange-800',
      fill: 'bg-orange-500',
      text: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-200 dark:border-orange-800',
      activeBorder: 'border-orange-500',
      hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/40',
      gradient: 'from-orange-300 to-orange-500 dark:from-orange-700 dark:to-orange-500'
    },
    green: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      track: 'bg-emerald-200 dark:bg-emerald-800',
      fill: 'bg-emerald-500',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      activeBorder: 'border-emerald-500',
      hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/40',
      gradient: 'from-emerald-300 to-emerald-500 dark:from-emerald-700 dark:to-emerald-500'
    }
  };

  const styles = colorStyles[color];
  
  // Get description text safely
  const safeDescriptions = Array.isArray(description) ? description : [];
  const descriptionText = safeDescriptions[safeValue - 1] || '';
  
  return (
    <div className={cn("rounded-lg p-5 mb-6 transition-all", styles.bg, className)}>
      <div className="flex justify-between items-center mb-3">
        <h3 className={cn("font-medium text-sm", styles.text)}>{label}</h3>
        <span className={cn("font-semibold text-sm", styles.text)}>
          {safeValue}/{maxValue}
        </span>
      </div>
      
      <div className="relative mb-4 px-3 py-1">
        {/* Read-only slider */}
        <Slider
          value={[safeValue]}
          min={1}
          max={maxValue}
          step={1}
          disabled={true}
          classNames={{
            track: cn(styles.track),
            range: cn(
              "bg-gradient-to-r", 
              styles.gradient,
              safeValue === 1 ? "opacity-0" : "opacity-100"
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
                step <= safeValue
                  ? cn("bg-white dark:bg-gray-900", styles.activeBorder)
                  : cn("bg-white dark:bg-gray-900", styles.border)
              )}
            />
          ))}
        </div>
      </div>
      
      {/* Description text */}
      {descriptionText && (
        <p className={cn("text-sm mt-3 text-[14px]", styles.text)}>
          {descriptionText}
        </p>
      )}
    </div>
  );
};

export default RatingSliderReadOnly;
