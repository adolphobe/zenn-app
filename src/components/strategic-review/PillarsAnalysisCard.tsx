
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types';
import { useInsightsAnalysis } from './hooks/useInsightsAnalysis';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LabelList, Cell } from 'recharts';
import { usePillarHover } from '@/context/hooks';

interface PillarsAnalysisCardProps {
  tasks: Task[];
}

const PillarsAnalysisCard: React.FC<PillarsAnalysisCardProps> = ({ tasks }) => {
  // Use the insights analysis hook to get pillar data
  const pillarData = useInsightsAnalysis(tasks);
  
  // Use the pillar hover hook to handle dynamic insights
  const { activeInsight, handlePillarHover } = usePillarHover(pillarData.insights || [], 'consequence');
  
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
  
  // Helper function to generate tooltip text based on pillar and score
  const getPillarTooltip = (pilarId: string, score: number) => {
    let nivel = "";
    let mensagem = "";

    if (score >= 4.2) nivel = "Muito forte";
    else if (score >= 3.6) nivel = "Acima da média";
    else if (score >= 3.0) nivel = "Moderado";
    else if (score >= 2.5) nivel = "Fraco";
    else nivel = "Muito fraco";

    switch (pilarId) {
      case "consequence":
        if (score >= 4.2) mensagem = "Você concluiu tarefas que, pra você, eram realmente importantes";
        else if (score >= 3.6) mensagem = "Você resolveu coisas relevantes, mas não urgentes.";
        else if (score >= 3.0) mensagem = "Você fez tarefas com alguma utilidade, mas sem grande peso.";
        else mensagem = "Você concluiu tarefas que tinham pouca importância pra você.";
        break;

      case "pride":
        if (score >= 4.2) mensagem = "Você buscou sentir orgulho do que entregou.";
        else if (score >= 3.6) mensagem = "Você fez tarefas que, em parte, te representam.";
        else if (score >= 3.0) mensagem = "Você entregou o que precisava, mas sem orgulho real.";
        else mensagem = "Você concluiu tarefas que não te deixaram satisfeito.";
        break;

      case "construction":
        if (score >= 4.2) mensagem = "Você escolheu crescer de verdade com o que fez.";
        else if (score >= 3.6) mensagem = "Você buscou evoluir, mas sem se desafiar tanto.";
        else if (score >= 3.0) mensagem = "Você se manteve ativo, mas não saiu do lugar.";
        else mensagem = "Você se ocupou, mas não cresceu.";
        break;
    }

    return { nivel, mensagem };
  };
  
  // Custom tooltip content component
  const CustomTooltipContent = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const { nivel, mensagem } = getPillarTooltip(data.id, data.value);
      
      return (
        <div className="bg-white p-2 border rounded-md shadow-md text-sm">
          <p className="font-bold">{data.name}</p>
          <p className="font-semibold text-blue-600">{nivel}</p>
          <p className="text-gray-700">{mensagem}</p>
          <p className="font-mono mt-1">Nota: {data.value.toFixed(1)}</p>
        </div>
      );
    }
    return null;
  };
  
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
          {pillarData.averages && pillarData.averages.length > 0 ? (
            <ChartContainer 
              className="h-full w-full"
              config={{
                consequence: { color: '#3B82F6' }, // Azul
                pride: { color: '#F97316' },       // Laranja
                construction: { color: '#10B981' }, // Verde
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={pillarData.averages} 
                  barGap={12} 
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis 
                    domain={[2.5, 5.0]} 
                    tickCount={6} 
                    hide={true} 
                  />
                  <Tooltip 
                    content={<CustomTooltipContent />}
                    cursor={{fill: 'rgba(0, 0, 0, 0.05)'}}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={80}
                    fillOpacity={0.9}
                    animationDuration={1000}
                    animationBegin={200}
                    animationEasing="ease-out"
                    onMouseEnter={(data) => {
                      handlePillarHover(data.id);
                    }}
                  >
                    <LabelList 
                      dataKey="value" 
                      position="top" 
                      fill="#888888"
                      formatter={(value: number) => value.toFixed(1)}
                      style={{ fontSize: '12px', fontWeight: 'bold' }}
                    />
                    {pillarData.averages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Nenhuma tarefa concluída no período selecionado</p>
            </div>
          )}
        </div>
        
        {/* Dynamic Insight Box */}
        {activeInsight && (
          <div className="space-y-4 mt-6">
            <div 
              className="border rounded-lg p-4 animate-fade-in"
              style={{ 
                background: getBackgroundGradient(activeInsight.id),
                animationDuration: '0.3s',
                transition: 'background 0.3s ease'
              }}
            >
              <h4 className="font-medium mb-3 text-base">
                {activeInsight.customTitle}
              </h4>
              {activeInsight.messages && activeInsight.messages.map((message, msgIndex) => (
                <p key={msgIndex} className="text-sm text-muted-foreground">{message}</p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PillarsAnalysisCard;
