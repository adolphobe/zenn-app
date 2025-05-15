
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
    prioridade_alta: "Você tem priorizado o que não dá pra adiar. Gosta de resolver o que pesa logo, antes que vire problema. Isso mostra atenção ao que realmente importa.",
    equilibrado: "Você tem mantido um bom equilíbrio entre tarefas urgentes e outras mais leves. Sabe quando precisa agir, mas também não vive correndo atrás do prejuízo.",
    negligenciado: "Você tem deixado de lado algumas tarefas importantes. Parece que só percebe o peso delas quando já passou. Isso te faz perder energia corrigindo depois."
  },
  pride: {
    prioridade_alta: "Você tem feito coisas que te deixam satisfeito. Dá pra ver que gosta de cumprir o que tem valor pessoal e não faz só por fazer.",
    equilibrado: "Você tem mantido uma boa média entre fazer o que precisa e o que te deixa orgulhoso. Nem sempre se vê nas tarefas, mas ainda sente que tá no caminho.",
    negligenciado: "Você tem feito muita coisa, mas quase nada que te orgulha de verdade. Tá entregando, mas sem sentir que o que faz representa quem você é."
  },
  construction: {
    prioridade_alta: "Você tem procurado crescer. Escolhe tarefas que te desafiam, que te puxam pra frente. Dá pra ver que quer ficar mais forte com o que faz.",
    equilibrado: "Você tá fazendo o necessário, mas sem esquecer do seu desenvolvimento. Cresce aos poucos, com constância.",
    negligenciado: "Você tá se mantendo ocupado, mas não tá evoluindo. Faz o que precisa, mas quase nada que realmente te transforme."
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
