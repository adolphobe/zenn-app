
import { useMemo } from 'react';
import { Task } from '@/types';
import { PillarDataType } from '../types';

// Colors for the charts
const COLORS = {
  consequence: '#ea384c',
  pride: '#F97316',
  construction: '#0EA5E9'
};

export const useInsightsAnalysis = (tasks: Task[]): PillarDataType => {
  return useMemo(() => {
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
};

// Export COLORS for other components
export const PILLAR_COLORS = COLORS;
