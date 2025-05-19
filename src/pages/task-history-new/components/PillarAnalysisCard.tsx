
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types';
import PillarChart from '@/components/strategic-review/components/PillarChart';
import { useInsightsAnalysis } from '@/components/strategic-review/hooks/useInsightsAnalysis';
import { usePillarHover } from '@/context/hooks';
import PillarInsight from '@/components/strategic-review/components/PillarInsight';

interface PillarAnalysisCardProps {
  tasks: Task[];
}

const PillarAnalysisCard: React.FC<PillarAnalysisCardProps> = ({ tasks }) => {
  // Use the insights analysis hook to get pillar data
  const pillarData = useInsightsAnalysis(tasks || []);
  
  // Use the pillar hover hook to handle dynamic insights
  const { activeInsight, handlePillarHover } = usePillarHover(
    pillarData?.insights || [], 
    'consequence'
  );
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Análise de Pilares</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-6">
          {pillarData?.averages && pillarData.averages.length > 0 ? (
            <PillarChart 
              data={pillarData.averages}
              onPillarHover={handlePillarHover}
              height={250}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Sem dados suficientes para análise</p>
            </div>
          )}
        </div>
        
        {/* Dynamic Insight Box */}
        {activeInsight && (
          <div className="mt-4">
            <PillarInsight insight={activeInsight} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PillarAnalysisCard;
