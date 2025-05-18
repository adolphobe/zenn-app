
import React from 'react';
import { InsightMessage } from '../types';

interface PillarInsightProps {
  insight: InsightMessage;
}

const PillarInsight: React.FC<PillarInsightProps> = ({ insight }) => {
  // Function to determine background gradient based on insight id
  const getBackgroundGradient = (id: string) => {
    switch (id) {
      case 'consequence':
        return 'linear-gradient(to right, rgba(210, 230, 255, 0.5), rgba(180, 210, 250, 0.3))'; // Subtle blue
      case 'pride':
        return 'linear-gradient(to right, rgba(255, 230, 210, 0.5), rgba(255, 210, 180, 0.3))'; // Subtle orange
      case 'construction':
        return 'linear-gradient(to right, rgba(210, 255, 220, 0.5), rgba(180, 250, 210, 0.3))'; // Subtle green
      default:
        return 'linear-gradient(to right, rgba(240, 240, 240, 0.5), rgba(230, 230, 230, 0.3))';
    }
  };

  return (
    <div 
      className="border rounded-lg p-4 animate-fade-in"
      style={{ 
        background: getBackgroundGradient(insight.id),
        animationDuration: '0.3s',
        transition: 'background 0.3s ease'
      }}
    >
      <h4 className="font-medium mb-3 text-base">
        {insight.customTitle || insight.title}
      </h4>
      {insight.messages && insight.messages.map((message, msgIndex) => (
        <p key={msgIndex} className="text-sm text-muted-foreground">{message}</p>
      ))}
    </div>
  );
};

export default PillarInsight;
