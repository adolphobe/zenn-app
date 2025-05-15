
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
    prioridade_alta: "A maioria das tarefas que você criou tinham risco alto de serem ignoradas. Você tem focado em resolver o que pesa, o que não pode esperar. Isso mostra que sua atenção está no que realmente importa.",
    equilibrado: "Você tem equilibrado bem tarefas urgentes com outras mais leves. Sabe o que precisa ser feito agora e o que pode esperar. Isso te mantém no controle sem viver apagando incêndio.",
    negligenciado: "Muitas das tarefas que você concluiu tinham risco baixo, enquanto outras com impacto real ficaram de lado. Isso pode parecer inofensivo agora, mas costuma pesar depois — principalmente na consciência."
  },

  pride: {
    prioridade_alta: "Boa parte das tarefas que você tem feito te dão orgulho de verdade. Você não tá só executando: tá entregando coisas que importam pra você, que carregam o seu nome de verdade.",
    equilibrado: "Você tem feito tarefas que te atendem, mesmo que nem todas tragam orgulho. Ainda assim, mostra que você se preocupa em manter algum alinhamento pessoal com o que entrega.",
    negligenciado: "Você tem concluído tarefas que não te deixam satisfeito. Isso pode te deixar produtivo por fora, mas com uma sensação de vazio depois. Pode estar entregando muito — mas sem se sentir parte do que faz."
  },

  construction: {
    prioridade_alta: "A maior parte das suas tarefas contribui diretamente pro seu crescimento. Você tá escolhendo fazer coisas que te desafiam, que te puxam pra cima. Isso mostra foco em evolução real.",
    equilibrado: "Você tá misturando bem tarefas que mantêm sua rotina com outras que te fazem crescer. Esse ritmo é bom pra seguir em movimento sem perder direção.",
    negligenciado: "As tarefas que você tem feito mantêm as coisas funcionando, mas não estão te levando além. Seu tempo está ocupado, mas sua evolução pessoal tá parada."
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
