
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
    prioridade_alta: "Você tá priorizando tarefas que não podem ser ignoradas. Isso mostra foco em resolver o que importa antes que vire dor de cabeça. É uma forma madura de proteger o seu futuro agindo no presente.",
    
    equilibrado: "Você tá equilibrando bem o que tem peso real. Sabe quando precisa agir e quando pode esperar, sem deixar o importante virar urgente. Essa clareza evita acúmulo e te mantém em fluxo sem pressão constante.",
    
    negligenciado: "Você tá deixando de lado tarefas que já têm impacto real. Pode parecer leve agora, mas vai pesar na consciência quando perceber que perdeu tempo com o que não te levava pra lugar nenhum. O fardo não é só o que ficou por fazer — é saber que foi escolha sua."
  },
  
  pride: {
    prioridade_alta: "Você tá fazendo entregas que te dão orgulho real. Isso reforça sua identidade e te mantém respeitando suas próprias escolhas.",
    
    equilibrado: "Você tá se mantendo coerente com o que valoriza. Suas ações têm sua assinatura e não são só pra cumprir tabela.",
    
    negligenciado: "Você tá fazendo o que precisa, mas sem se ver no que entrega. Isso pode te deixar produtivo por fora, mas vazio por dentro."
  },
  
  construction: {
    prioridade_alta: "Você tá escolhendo tarefas que te constroem. Cada entrega tá te deixando mais forte, mais preparado e mais próximo de quem você quer ser.",
    
    equilibrado: "Você tá conseguindo se mover e se desenvolver ao mesmo tempo. Tá cumprindo o presente sem perder o futuro de vista.",
    
    negligenciado: "Você tá ocupado, mas não evoluindo. Tá girando, mas não subindo. Isso pode te manter no mesmo lugar por tempo demais."
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
