
import React, { useEffect } from 'react';
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
  // Log de diagnóstico
  useEffect(() => {
    console.log("PillarsAnalysisCard: Recebeu tasks:", tasks?.length || 0);
  }, [tasks]);
  
  // Use the insights analysis hook to get pillar data with proper fallbacks
  const pillarData = useInsightsAnalysis(tasks || []);
  
  // Log para diagnóstico dos dados processados
  useEffect(() => {
    console.log("PillarsAnalysisCard: Dados de pilares:", 
      pillarData ? `Averages: ${pillarData.averages?.length || 0}, Insights: ${pillarData.insights?.length || 0}` : "Dados não disponíveis");
  }, [pillarData]);
  
  // Use the pillar hover hook to handle dynamic insights with fallbacks
  const { activeInsight, handlePillarHover } = usePillarHover(
    pillarData?.insights || [], 
    'consequence'
  );
  
  // Log para diagnóstico de insights ativos
  useEffect(() => {
    console.log("PillarsAnalysisCard: Insight ativo:", activeInsight?.id || "nenhum");
  }, [activeInsight]);
  
  // Safety check for missing data
  if (!pillarData || !pillarData.averages) {
    console.warn("PillarsAnalysisCard: Dados de pilares ausentes ou incompletos");
    return (
      <Card>
        <CardHeader>
          <CardTitle>Foco das tarefas que você criou:</CardTitle>
          <CardDescription>
            Carregando dados de análise...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Aguarde enquanto processamos seus dados...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
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
          {pillarData.averages.length > 0 ? (
            <PillarChart 
              data={pillarData.averages}
              onPillarHover={handlePillarHover}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Não há dados de pilares disponíveis para análise</p>
            </div>
          )}
        </div>
        
        {/* Dynamic Insight Box - with safety check */}
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
