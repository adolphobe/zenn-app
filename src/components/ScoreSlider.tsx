
import React from 'react';

interface ScoreSliderProps {
  value: number;
  type: 'consequence' | 'pride' | 'construction';
  onChange: (value: number) => void;
  phrases: string[];
}

const ScoreSlider: React.FC<ScoreSliderProps> = ({ value, type, onChange, phrases }) => {
  return (
    <div className="mb-4">
      <div className="score-slider">
        {[1, 2, 3, 4, 5].map((score) => (
          <div
            key={score}
            className={`score-dot score-dot-${type} ${score <= value ? 'active' : ''}`}
            onClick={() => onChange(score)}
            aria-label={`Score ${score}`}
          />
        ))}
      </div>
      <div className="text-sm text-gray-600 mt-1">
        {phrases[value - 1]}
      </div>
    </div>
  );
};

export default ScoreSlider;
