
import { useMemo } from 'react';
import { Task } from '@/types';
import { PillarDataType } from '../types';

// Colors for the pillars
const COLORS = {
  consequence: '#3B82F6', // Azul
  pride: '#F97316',       // Laranja
  construction: '#10B981' // Verde
};

export const useInsightsAnalysis = (tasks: Task[]): PillarDataType => {
  return useMemo(() => {
    // Return default empty values if no tasks
    if (!tasks || tasks.length === 0) {
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
    
    // Calculate averages of each pillar from the completed tasks
    const avgConsequence = tasks.reduce((sum, task) => sum + task.consequenceScore, 0) / tasks.length;
    const avgPride = tasks.reduce((sum, task) => sum + task.prideScore, 0) / tasks.length;
    const avgConstruction = tasks.reduce((sum, task) => sum + task.constructionScore, 0) / tasks.length;
    
    const pillars = [
      { name: 'Consequência', value: avgConsequence, color: COLORS.consequence },
      { name: 'Orgulho', value: avgPride, color: COLORS.pride },
      { name: 'Construção', value: avgConstruction, color: COLORS.construction }
    ];
    
    // Define classification thresholds
    const HIGH_THRESHOLD = 4.0; // >= 4.0 is high priority (priorizado)
    const LOW_THRESHOLD = 2.5;  // <= 2.5 is low priority (negligenciado)
    
    // Find highest and lowest pillars
    const sortedPillars = [...pillars].sort((a, b) => b.value - a.value);
    
    // Select highest and lowest based on defined thresholds
    const prioritized = sortedPillars.filter(p => p.value >= HIGH_THRESHOLD);
    const neglected = [...sortedPillars].reverse().filter(p => p.value <= LOW_THRESHOLD);
    
    const highest = prioritized.length > 0 ? prioritized[0] : null;
    const lowest = neglected.length > 0 ? neglected[0] : null;
    
    // Generate insights based on classifications
    const insights = [];
    
    // Always add insights for each pillar based on their scores
    pillars.forEach(pillar => {
      if (pillar.value >= HIGH_THRESHOLD) {
        // High priority pillar
        if (pillar.name === 'Consequência') {
          insights.push({
            title: '🟢 Consequência - Priorizado',
            messages: [
              'Você está se guiando por impacto real. Evitando arrependimentos antes que eles aconteçam.',
              'Suas ações mostram clareza sobre o que não pode ser ignorado.',
              'Você está agindo com base no que ameaça seu progresso, não no que só parece urgente.'
            ]
          });
        } else if (pillar.name === 'Orgulho') {
          insights.push({
            title: '🟢 Orgulho - Priorizado',
            messages: [
              'Você está executando com identidade. O que faz, representa quem você é.',
              'Suas ações fortalecem sua autoimagem e te validam internamente.',
              'Você não está apenas riscando tarefas. Está se orgulhando de cada entrega.'
            ]
          });
        } else if (pillar.name === 'Construção') {
          insights.push({
            title: '🟢 Construção - Priorizado',
            messages: [
              'Você está entregando o que te fortalece. Cada tarefa te deixa mais preparado, mais sólido.',
              'Está saindo do automático e moldando a versão que quer se tornar.',
              'Suas ações estão em alinhamento com evolução real, não só manutenção.'
            ]
          });
        }
      } else if (pillar.value <= LOW_THRESHOLD) {
        // Low priority pillar
        if (pillar.name === 'Consequência') {
          insights.push({
            title: '🔴 Consequência - Negligenciado',
            messages: [
              'Suas tarefas podem estar organizadas, mas não estão resolvendo o que realmente importa.',
              'Está se mantendo produtivo, mas evitando o que tem mais risco se for adiado.',
              'Pode estar ignorando os alertas estratégicos que te exigem responsabilidade.'
            ]
          });
        } else if (pillar.name === 'Orgulho') {
          insights.push({
            title: '🔴 Orgulho - Negligenciado',
            messages: [
              'Está cumprindo tarefas, mas sem se sentir satisfeito com o que entrega.',
              'Falta conexão entre o que você faz e quem você quer ser.',
              'Está fazendo por obrigação, não por construção de respeito próprio.'
            ]
          });
        } else if (pillar.name === 'Construção') {
          insights.push({
            title: '🔴 Construção - Negligenciado',
            messages: [
              'Você está operando no presente, mas não está construindo seu futuro.',
              'As tarefas podem parecer úteis, mas não estão te transformando.',
              'Está sendo eficiente, mas não está se expandindo.'
            ]
          });
        }
      } else {
        // Medium priority pillar - add a neutral message
        if (pillar.name === 'Consequência') {
          insights.push({
            title: '🔵 Consequência - Equilibrado',
            messages: [
              'Você está mantendo um bom equilíbrio com suas responsabilidades e consequências.',
              'Está atento ao que é importante sem se deixar paralisar pelas preocupações.',
              'Continue desenvolvendo essa consciência sobre o que realmente importa.'
            ]
          });
        } else if (pillar.name === 'Orgulho') {
          insights.push({
            title: '🔵 Orgulho - Equilibrado',
            messages: [
              'Você mantém uma boa conexão entre suas tarefas e sua identidade.',
              'Existe um senso equilibrado de satisfação com o que você entrega.',
              'Continue fortalecendo a relação entre o que faz e quem você é.'
            ]
          });
        } else if (pillar.name === 'Construção') {
          insights.push({
            title: '🔵 Construção - Equilibrado',
            messages: [
              'Você está balanceando ações presentes com construção de futuro.',
              'Há um equilíbrio entre manutenção e evolução em suas tarefas.',
              'Continue investindo em tarefas que expandem suas capacidades.'
            ]
          });
        }
      }
    });
    
    // If no insights were generated (which shouldn't happen with our new logic), add a default
    if (insights.length === 0) {
      insights.push({
        title: 'Análise de Pilares',
        messages: [
          'Complete mais tarefas para obter insights específicos sobre seus pilares estratégicos.',
          'Seus padrões de execução revelarão qual é seu pilar dominante.'
        ]
      });
    }
    
    return { averages: pillars, highest, lowest, insights };
  }, [tasks]);
};

// Export COLORS for other components
export const PILLAR_COLORS = COLORS;
