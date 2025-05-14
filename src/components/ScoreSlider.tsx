
import React from 'react';
import { Slider } from './ui/slider';
import { cn } from "@/lib/utils";

interface ScoreSliderProps {
  value: number;
  type: 'consequence' | 'pride' | 'construction';
  onChange: (value: number) => void;
  phrases: string[];
}

const ScoreSlider: React.FC<ScoreSliderProps> = ({ value, type, onChange, phrases }) => {
  // Define colors based on type
  const getColors = () => {
    switch(type) {
      case 'consequence':
        return {
          bgColor: 'bg-blue-100',
          trackColor: 'bg-gradient-to-r from-blue-200 to-blue-500',
          dotActiveColor: 'bg-blue-500',
          dotInactiveColor: 'bg-blue-100 border border-blue-200',
          thumbRingColor: 'ring-blue-200'
        };
      case 'pride':
        return {
          bgColor: 'bg-orange-100',
          trackColor: 'bg-gradient-to-r from-orange-200 to-orange-500',
          dotActiveColor: 'bg-orange-500',
          dotInactiveColor: 'bg-orange-100 border border-orange-200',
          thumbRingColor: 'ring-orange-200'
        };
      case 'construction':
        return {
          bgColor: 'bg-emerald-100',
          trackColor: 'bg-gradient-to-r from-emerald-200 to-emerald-500',
          dotActiveColor: 'bg-emerald-500',
          dotInactiveColor: 'bg-emerald-100 border border-emerald-200',
          thumbRingColor: 'ring-emerald-200'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          trackColor: 'bg-gradient-to-r from-gray-200 to-gray-500',
          dotActiveColor: 'bg-gray-500',
          dotInactiveColor: 'bg-gray-100 border border-gray-200',
          thumbRingColor: 'ring-gray-200'
        };
    }
  };

  const { bgColor, trackColor, dotActiveColor, dotInactiveColor, thumbRingColor } = getColors();

  // Handle slider value change
  const handleValueChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };

  return (
    <div className="mb-4">
      <div className="relative">
        {/* Step indicators - positioned absolutely on top of the slider track */}
        <div className="absolute top-[8px] z-10 w-full flex justify-between px-[2px] pointer-events-none">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`w-[19px] h-[19px] rounded-full ${
                step <= value ? dotActiveColor : dotInactiveColor
              }`}
              aria-label={`Step ${step}`}
            />
          ))}
        </div>
        
        {/* Custom Slider component using shadcn/ui slider */}
        <Slider
          value={[value]}
          min={1}
          max={5}
          step={1}
          onValueChange={handleValueChange}
          className={cn("py-4", bgColor)}
          // Use the custom styling directly in the component
          classNames={{
            track: "h-1.5 rounded-full",
            range: cn("h-1.5 rounded-full", trackColor),
            thumb: cn("block h-4 w-4 rounded-full border-2 border-white bg-white ring-2", thumbRingColor, 
              "transition-all hover:scale-110 focus:outline-none focus:ring focus-visible:outline-none",
              "cursor-grab active:cursor-grabbing shadow-md")
          }}
        />
      </div>
      
      <div className="text-sm text-gray-600 mt-2">
        {phrases[value - 1]}
      </div>
    </div>
  );
};

export default ScoreSlider;
