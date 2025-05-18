
import React, { useEffect } from 'react';
import { InsightMessage } from '../types';

interface PillarInsightProps {
  insight: InsightMessage;
}

const PillarInsight: React.FC<PillarInsightProps> = ({ insight }) => {
  // Adicionar log para rastrear as props recebidas
  useEffect(() => {
    console.log("PillarInsight: Recebeu insight:", insight);
  }, [insight]);

  // Safety check for invalid insight
  if (!insight || !insight.id) {
    console.warn("PillarInsight: Insight inválido ou sem ID");
    return null;
  }
  
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

  // Log para verificar se temos mensagens a mostrar
  console.log(`PillarInsight: Mensagens para '${insight.id}':`, insight.messages?.length || 0);

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
        {insight.customTitle || insight.title || 'Análise'}
      </h4>
      {insight.messages && insight.messages.length > 0 ? (
        insight.messages.map((message, msgIndex) => (
          <p key={msgIndex} className="text-sm text-muted-foreground">{message}</p>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">Não há detalhes disponíveis para esta análise.</p>
      )}
    </div>
  );
};

export default PillarInsight;
