
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
    prioridade_alta: "As tarefas que você tem feito mostram foco total em resolver o que não pode ser ignorado. Você tem lidado com o que realmente importa antes que vire dor de cabeça.",
    equilibrado: "Você tem equilibrado bem tarefas urgentes com outras de impacto mais leve. Tá lidando com as prioridades sem se deixar sobrecarregar.",
    negligenciado: "Você criou tarefas importantes, mas deixou de lado as que já tinham impacto real. Pode não parecer grave agora, mas esse tipo de adiamento pesa depois — principalmente na consciência."
  },
  pride: {
    prioridade_alta: "Você tem feito tarefas que te dão orgulho real. Isso mostra que você não tá só executando, mas entregando coisas que te representam de verdade.",
    equilibrado: "Você tem mantido um bom nível de conexão pessoal com o que faz. Suas tarefas têm sido úteis e, em parte, alinhadas com seus valores.",
    negligenciado: "As tarefas que você concluiu foram úteis, mas não te deixaram satisfeito. Pode estar operando no automático, sem sentir que tá construindo algo com a sua cara."
  },
  construction: {
    prioridade_alta: "Você tem escolhido tarefas que te fortalecem de verdade. Cada entrega mostra que você tá comprometido com a sua evolução pessoal.",
    equilibrado: "Você tá conseguindo agir no presente sem perder de vista o seu crescimento. Suas tarefas te mantêm em movimento e em construção ao mesmo tempo.",
    negligenciado: "As tarefas que você tem feito te mantêm ocupado, mas não te fazem crescer. Pode estar rodando bem por fora, mas sem avançar por dentro."
  }
};



export const useInsightsAnalysis = (tasks: Task[]): PillarDataType => {
  return useMemo(() => {
    // Return default empty values if no tasks
    if (!tasks || tasks.length === 0) {
      return {
        averages: [
          { name: 'Risco', value: 0, color: COLORS.consequence, id: 'consequence' },
          { name: 'Orgulho', value: 0, color: COLORS.pride, id: 'pride' },
          { name: 'Crescimento', value: 0, color: COLORS.construction, id: 'construction' }
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
      { name: 'Risco', value: avgConsequence, color: COLORS.consequence, id: 'consequence' },
      { name: 'Orgulho', value: avgPride, color: COLORS.pride, id: 'pride' },
      { name: 'Crescimento', value: avgConstruction, color: COLORS.construction, id: 'construction' }
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
