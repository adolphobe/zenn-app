
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
    prioridade_alta: "Você tem criado tarefas que, pra você, eram importantes de fazer. Você reconheceu que não dava pra deixar de lado — e concluiu mesmo assim. Isso mostra clareza e responsabilidade com o que realmente importa.",
    equilibrado: "Você tem equilibrado tarefas importantes com outras mais leves. Nem tudo era urgente, mas você soube reconhecer o que precisava ser feito e o que podia esperar.",
    negligenciado: "Você concluiu tarefas que, na hora de criar, não pareciam tão importantes. Isso pode indicar que o que mais pesa pra você ainda tá ficando pra depois."
  },

  pride: {
    prioridade_alta: "Boa parte das tarefas que você concluiu foram pensadas pra te dar orgulho. Você tem escolhido fazer o que te representa — e isso reforça seu senso de identidade.",
    equilibrado: "Você tem feito um pouco do que precisa e um pouco do que te dá satisfação. Isso mostra equilíbrio entre execução e envolvimento pessoal.",
    negligenciado: "A maioria das suas tarefas não foram criadas pra te gerar orgulho. Você pode estar fazendo muito, mas sem sentir que tá construindo algo que tem a sua cara."
  },

  construction: {
    prioridade_alta: "Você tem criado tarefas que te puxam pra cima. Mesmo antes de começar, já enxergava valor nelas como parte do seu crescimento. Isso mostra foco em se tornar alguém melhor.",
    equilibrado: "Suas tarefas têm misturado rotina com construção. Você tá se mantendo em movimento sem deixar de crescer aos poucos.",
    negligenciado: "Você concluiu tarefas que, pra você, não fariam diferença real. Isso pode indicar que seu esforço recente te manteve ocupado, mas não em evolução."
  }
};




export const useInsightsAnalysis = (tasks: Task[]): PillarDataType => {
  return useMemo(() => {
    // Return default empty values if no tasks
    if (!tasks || tasks.length === 0) {
      return {
        averages: [
          { name: 'Era importante fazer', value: 0, color: COLORS.consequence, id: 'consequence' },
          { name: 'Deu orgulho de ter feito', value: 0, color: COLORS.pride, id: 'pride' },
          { name: 'Gerou evolução pessoal', value: 0, color: COLORS.construction, id: 'construction' }
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
      { name: 'Era importante fazer', value: avgConsequence, color: COLORS.consequence, id: 'consequence' },
      { name: 'Deu orgulho de ter feito', value: avgPride, color: COLORS.pride, id: 'pride' },
      { name: 'Gerou evolução pessoal', value: avgConstruction, color: COLORS.construction, id: 'construction' }
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
      title: 'Risco',
      classification: consequenceClassification,
      messages: [PILLAR_MESSAGES.consequence[consequenceClassification]]
    });
    
    const prideClassification = getClassification(avgPride, HIGH_THRESHOLD, LOW_THRESHOLD);
    insights.push({
      id: 'pride',
      title: 'Orgulho',
      classification: prideClassification, 
      messages: [PILLAR_MESSAGES.pride[prideClassification]]
    });
    
    const constructionClassification = getClassification(avgConstruction, HIGH_THRESHOLD, LOW_THRESHOLD);
    insights.push({
      id: 'construction',
      title: 'Crescimento pessoal',
      classification: constructionClassification,
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

// Export COLORS for other components
export const PILLAR_COLORS = COLORS;
