
import { useMemo } from 'react';
import { Task } from '@/types';
import { PillarDataType } from '../types';

// Colors for the pillars
const COLORS = {
  consequence: '#3B82F6', // Azul
  pride: '#F97316',       // Laranja
  construction: '#10B981' // Verde
};

// Messages for each pillar based on classification
const PILLAR_MESSAGES = {
  consequence: {
    prioridade_alta: "Você está priorizando tarefas com alta Consequência de Ignorar. Está agindo com foco no que realmente não pode ser deixado de lado.",
    equilibrado: "Sua relação com a Consequência de Ignorar está equilibrada. Você sabe o que é importante, sem entrar em modo alerta constante.",
    negligenciado: "Você está negligenciando tarefas com Consequência de Ignorar. Pode estar empurrando coisas que vão te cobrar lá na frente."
  },
  pride: {
    prioridade_alta: "Você está priorizando tarefas com alto Orgulho Pós-Execução. Está fazendo o que representa quem você quer ser.",
    equilibrado: "Seu nível de Orgulho Pós-Execução está saudável. O que você faz tem valor e está conectado com sua identidade.",
    negligenciado: "Você está deixando o Orgulho Pós-Execução de lado. Está executando sem se sentir realizado com o que entrega."
  },
  construction: {
    prioridade_alta: "Você está priorizando tarefas com alta Força de Construção Pessoal. Está focado em se fortalecer e evoluir.",
    equilibrado: "Sua Força de Construção Pessoal está estável. Você está equilibrando bem ação presente e evolução pessoal.",
    negligenciado: "Você está negligenciando sua Força de Construção Pessoal. Está fazendo, mas sem se fortalecer com o que faz."
  }
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
    
    // Generate insights based on classifications
    const insights = [];
    
    // Add insights for each pillar based on their scores
    const consequenceClassification = getClassification(avgConsequence, HIGH_THRESHOLD, LOW_THRESHOLD);
    insights.push({
      title: getClassificationTitle('Consequência', consequenceClassification),
      messages: [PILLAR_MESSAGES.consequence[consequenceClassification]]
    });
    
    const prideClassification = getClassification(avgPride, HIGH_THRESHOLD, LOW_THRESHOLD);
    insights.push({
      title: getClassificationTitle('Orgulho', prideClassification),
      messages: [PILLAR_MESSAGES.pride[prideClassification]]
    });
    
    const constructionClassification = getClassification(avgConstruction, HIGH_THRESHOLD, LOW_THRESHOLD);
    insights.push({
      title: getClassificationTitle('Construção', constructionClassification),
      messages: [PILLAR_MESSAGES.construction[constructionClassification]]
    });
    
    // Find highest and lowest pillars
    const sortedPillars = [...pillars].sort((a, b) => b.value - a.value);
    const highest = sortedPillars.length > 0 ? sortedPillars[0] : null;
    const lowest = sortedPillars.length > 0 ? sortedPillars[sortedPillars.length - 1] : null;
    
    return { averages: pillars, highest, lowest, insights };
  }, [tasks]);
};

// Helper function to determine classification based on score
function getClassification(value: number, highThreshold: number, lowThreshold: number): 'prioridade_alta' | 'equilibrado' | 'negligenciado' {
  if (value >= highThreshold) return 'prioridade_alta';
  if (value <= lowThreshold) return 'negligenciado';
  return 'equilibrado';
}

// Helper function to get title with appropriate emoji
function getClassificationTitle(pillarName: string, classification: 'prioridade_alta' | 'equilibrado' | 'negligenciado'): string {
  const emoji = classification === 'prioridade_alta' 
    ? '🟢' 
    : classification === 'negligenciado' 
      ? '🔴' 
      : '🔵';
  
  const status = classification === 'prioridade_alta' 
    ? 'Priorizado' 
    : classification === 'negligenciado' 
      ? 'Negligenciado' 
      : 'Equilibrado';
  
  return `${emoji} ${pillarName} - ${status}`;
}

// Export COLORS for other components
export const PILLAR_COLORS = COLORS;
