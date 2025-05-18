
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types';
import { useInsightsAnalysis } from './hooks/useInsightsAnalysis';
import { usePillarHover } from '@/context/hooks';
import PillarChart from './components/PillarChart';
import PillarInsight from './components/PillarInsight';

interface PillarsAnalysisCardProps {
  tasks: Task[];
}

const PillarsAnalysisCard: React.FC<PillarsAnalysisCardProps> = ({ tasks }) => {
  // Use the insights analysis hook to get pillar data
  const pillarData = useInsightsAnalysis(tasks);
  
  // Use the pillar hover hook to handle dynamic insights
  const { activeInsight, handlePillarHover } = usePillarHover(pillarData.insights, 'consequence');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Foco das tarefas que você criou:</CardTitle>
        <CardDescription className="!mt-[25px]">
          As <span className="font-medium">notas que você dá ao criar cada tarefa</span> mostram o que importa pra você! <br/>
          Este gráfico mostra <span className="font-medium">onde você tem colocado sua atenção:</span><br/><br/>
          Nas tarefas que você considerou <b className="text-blue-600 font-medium">urgentes</b>, <br/>
          Nas tarefas que te trariam <b className="text-orange-600 font-medium">satisfação pessoal</b> ou<br/>
          Nas tarefas que te <b className="text-green-600 font-medium">levariam pro próximo nível</b>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-6">
          <PillarChart 
            data={pillarData.averages}
            onPillarHover={handlePillarHover}
          />
        </div>
        
        {/* Dynamic Insight Box */}
        {activeInsight && (
          <div className="space-y-4 mt-6">
            <PillarInsight insight={activeInsight} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PillarsAnalysisCard;
