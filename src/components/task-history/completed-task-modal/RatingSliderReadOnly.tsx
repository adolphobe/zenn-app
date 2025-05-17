
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface RatingSliderReadOnlyProps {
  value: number;
  color: string;
  label: string;
  description: string[];
}

const RatingSliderReadOnly: React.FC<RatingSliderReadOnlyProps> = ({ 
  value, 
  color, 
  label, 
  description 
}) => {
  const colorClasses = {
    blue: {
      range: "bg-blue-500",
      thumb: "border-blue-500",
    },
    orange: {
      range: "bg-orange-500",
      thumb: "border-orange-500",
    },
    green: {
      range: "bg-green-500",
      thumb: "border-green-500",
    }
  };

  const descriptionText = description[value - 1] || '';

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-sm">{label}</span>
        <span className="text-sm">{value}/5</span>
      </div>
      <Slider
        value={[value]}
        min={1}
        max={5}
        step={1}
        disabled={true}
        classNames={{
          track: "bg-gray-200",
          range: colorClasses[color as keyof typeof colorClasses]?.range,
          thumb: `cursor-default ${colorClasses[color as keyof typeof colorClasses]?.thumb}`,
        }}
      />
      <p className="text-sm text-gray-500 mt-1">{descriptionText}</p>
    </div>
  );
};

export default RatingSliderReadOnly;
