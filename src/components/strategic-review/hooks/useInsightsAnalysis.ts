
import { useMemo } from 'react';
import { Task } from '@/types';
import { PillarDataType } from '../types';

// Colors for the pillars
const COLORS = {
  consequence: '#3B82F6', // Azul
  pride: '#F97316',       // Laranja
  construction: '#10B981' // Verde
};

// Messages for each pillar based on classification - Updated with new messages
const PILLAR_MESSAGES = {
  consequence: {
    prioridade_alta: "Você tá mandando bem em resolver o que não pode ser adiado. Isso é ótimo porque te livra de problemas futuros antes mesmo deles virarem dor de cabeça.",
    equilibrado: "Você tá sabendo equilibrar as tarefas que cobram um preço se forem ignoradas. Isso mantém sua vida em dia sem entrar em modo incêndio.",
    negligenciado: "Você tá deixando de lado tarefas que vão te cobrar depois. Cuidado pra não empurrar o que pode virar problema real lá na frente."
  },
  pride: {
    prioridade_alta: "Você tá fazendo o que te dá orgulho de verdade. Isso reforça quem você é e te deixa mais confiante a cada entrega.",
    equilibrado: "Você tá se mantendo alinhado com o que acredita. Tá fazendo coisas que não são só úteis, mas também têm a sua cara.",
    negligenciado: "Você tá executando sem se orgulhar do que faz. Tá batendo meta, mas sem sentir que tá construindo algo que te representa."
  },
  construction: {
    prioridade_alta: "Você tá focado no que te fortalece. Cada tarefa tá te deixando mais perto do seu Eu ideal. Isso é evolução real.",
    equilibrado: "Você tá numa boa média entre agir no presente e construir pro futuro. Tá andando e se desenvolvendo ao mesmo tempo.",
    negligenciado: "Você tá se ocupando, mas sem crescer. Tá mantendo a rotina, mas não tá ficando mais forte com o que faz."
  }
};

export const useInsightsAnalysis = (tasks: Task[]): PillarDataType => {
  return useMemo(() => {
    // Return default empty values if no tasks
    if (!tasks || tasks.length === 0) {
      return {
        averages: [
          { name: 'Consequência', value: 0, color: COLORS.consequence, id: 'consequence' },
          { name: 'Orgulho', value: 0, color: COLORS.pride, id: 'pride' },
          { name: 'Construção', value: 0, color: COLORS.construction, id: 'construction' }
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
      { name: 'Consequência', value: avgConsequence, color: COLORS.consequence, id: 'consequence' },
      { name: 'Orgulho', value: avgPride, color: COLORS.pride, id: 'pride' },
      { name: 'Construção', value: avgConstruction, color: COLORS.construction, id: 'construction' }
    ];
    
    // Define classification thresholds
    const HIGH_THRESHOLD = 4.0; // >= 4.0 is high priority (priorizado)
    const LOW_THRESHOLD = 2.5;  // <= 2.5 is low priority (negligenciado)
    
    // Generate insights based on classifications
    const insights = [];
    
    // Add insights for each pillar based on their scores
    const consequenceClassification = getClassification(avgConsequence, HIGH_THRESHOLD, LOW_THRESHOLD);
    insights.push({
      id: 'consequence',
      title: getClassificationTitle('Consequência', consequenceClassification),
      messages: [PILLAR_MESSAGES.consequence[consequenceClassification]]
    });
    
    const prideClassification = getClassification(avgPride, HIGH_THRESHOLD, LOW_THRESHOLD);
    insights.push({
      id: 'pride',
      title: getClassificationTitle('Orgulho', prideClassification),
      messages: [PILLAR_MESSAGES.pride[prideClassification]]
    });
    
    const constructionClassification = getClassification(avgConstruction, HIGH_THRESHOLD, LOW_THRESHOLD);
    insights.push({
      id: 'construction',
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
