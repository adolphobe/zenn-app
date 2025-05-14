
import React, { useMemo } from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

// Colors for the charts
const COLORS = {
  consequence: '#ea384c',
  pride: '#F97316',
  construction: '#0EA5E9'
};

interface PillarsAnalysisCardProps {
  tasks: Task[];
}

const PillarsAnalysisCard: React.FC<PillarsAnalysisCardProps> = ({ tasks }) => {
  // Calculate average for each pillar
  const pillarData = useMemo(() => {
    if (tasks.length === 0) {
      return {
        averages: [
          { name: 'Consequência', value: 0, color: COLORS.consequence },
          { name: 'Orgulho', value: 0, color: COLORS.pride },
          { name: 'Construção', value: 0, color: COLORS.construction }
        ],
        highest: null,
        lowest: null,
        insights: []
      };
    }
    
    const avgConsequence = tasks.reduce((sum, task) => sum + task.consequenceScore, 0) / tasks.length;
    const avgPride = tasks.reduce((sum, task) => sum + task.prideScore, 0) / tasks.length;
    const avgConstruction = tasks.reduce((sum, task) => sum + task.constructionScore, 0) / tasks.length;
    
    const pillars = [
      { name: 'Consequência', value: avgConsequence, color: COLORS.consequence },
      { name: 'Orgulho', value: avgPride, color: COLORS.pride },
      { name: 'Construção', value: avgConstruction, color: COLORS.construction }
    ];
    
    // Find highest and lowest pillars
    let highest = pillars[0];
    let lowest = pillars[0];
    
    pillars.forEach(pillar => {
      if (pillar.value > highest.value) highest = pillar;
      if (pillar.value < lowest.value) lowest = pillar;
    });
    
    // Don't highlight if difference is too small
    if (highest.value - lowest.value < 0.5) {
      highest = null;
      lowest = null;
    }
    
    // Always mark pillars below threshold as neglected
    const neglected = pillars.filter(p => p.value < 3.0);
    if (neglected.length > 0) {
      lowest = neglected[0];
      if (neglected.length > 1) highest = null; // Don't highlight highest if multiple are neglected
    }
    
    // Generate insights
    const insights = [];
    
    if (highest) {
      if (highest.name === 'Consequência') {
        insights.push({
          title: '🟢 Consequência - Priorizado',
          messages: [
            'Você está se guiando por impacto real. Evitando arrependimentos antes que eles aconteçam.',
            'Suas ações mostram clareza sobre o que não pode ser ignorado.',
            'Você está agindo com base no que ameaça seu progresso, não no que só parece urgente.'
          ]
        });
      } else if (highest.name === 'Orgulho') {
        insights.push({
          title: '🟢 Orgulho - Priorizado',
          messages: [
            'Você está executando com identidade. O que faz, representa quem você é.',
            'Suas ações fortalecem sua autoimagem e te validam internamente.',
            'Você não está apenas riscando tarefas. Está se orgulhando de cada entrega.'
          ]
        });
      } else if (highest.name === 'Construção') {
        insights.push({
          title: '🟢 Construção - Priorizado',
          messages: [
            'Você está entregando o que te fortalece. Cada tarefa te deixa mais preparado, mais sólido.',
            'Está saindo do automático e moldando a versão que quer se tornar.',
            'Suas ações estão em alinhamento com evolução real, não só manutenção.'
          ]
        });
      }
    }
    
    if (lowest) {
      if (lowest.name === 'Consequência') {
        insights.push({
          title: '🔴 Consequência - Negligenciado',
          messages: [
            'Suas tarefas podem estar organizadas, mas não estão resolvendo o que realmente importa.',
            'Está se mantendo produtivo, mas evitando o que tem mais risco se for adiado.',
            'Pode estar ignorando os alertas estratégicos que te exigem responsabilidade.'
          ]
        });
      } else if (lowest.name === 'Orgulho') {
        insights.push({
          title: '🔴 Orgulho - Negligenciado',
          messages: [
            'Está cumprindo tarefas, mas sem se sentir satisfeito com o que entrega.',
            'Falta conexão entre o que você faz e quem você quer ser.',
            'Está fazendo por obrigação, não por construção de respeito próprio.'
          ]
        });
      } else if (lowest.name === 'Construção') {
        insights.push({
          title: '🔴 Construção - Negligenciado',
          messages: [
            'Você está operando no presente, mas não está construindo seu futuro.',
            'As tarefas podem parecer úteis, mas não estão te transformando.',
            'Está sendo eficiente, mas não está se expandindo.'
          ]
        });
      }
    }
    
    return { averages: pillars, highest, lowest, insights };
  }, [tasks]);
  
  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-2">
        <CardTitle className="text-xl">Análise de Pilares</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 pt-4">
          {/* Pillar Chart */}
          <div className="h-64">
            <ChartContainer 
              config={{
                consequence: { color: COLORS.consequence },
                pride: { color: COLORS.pride },
                construction: { color: COLORS.construction }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <Bar
                  data={pillarData.averages}
                  dataKey="value"
                  barSize={60}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip content={<ChartTooltipContent />} />
                  {pillarData.averages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} radius={[4, 4, 0, 0]} />
                  ))}
                </Bar>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          
          {/* Insights */}
          {pillarData.insights.length > 0 ? (
            <div className="mt-6 space-y-4">
              {pillarData.insights.map((insight, i) => (
                <div key={i} className="rounded-md bg-primary/5 p-4">
                  <h4 className="mb-2 font-medium">{insight.title}</h4>
                  <ul className="space-y-2">
                    {insight.messages.map((message, j) => (
                      <li key={j} className="text-sm">{message}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            tasks.length > 0 && (
              <div className="rounded-md bg-primary/5 p-4">
                <p className="text-sm">Equilíbrio entre os pilares. Continue mantendo essa distribuição balanceada.</p>
              </div>
            )
          )}
          
          {tasks.length === 0 && (
            <div className="rounded-md bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Sem tarefas concluídas no período para análise.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PillarsAnalysisCard;
