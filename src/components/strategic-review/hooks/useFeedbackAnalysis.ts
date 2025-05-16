
import { useMemo } from 'react';
import { Task } from '@/types';

// Colors for the charts
export const COLORS = {
  feedback: {
    transformed: '#4CAF50',  // Verde
    relief: '#2196F3',       // Azul
    obligation: '#9E9E9E'    // Cinza
  }
};

// Background gradients for insights
export const GRADIENTS = {
  transformed: 'linear-gradient(to right, rgba(210, 255, 220, 0.5), rgba(180, 250, 210, 0.3))', // Subtle green
  relief: 'linear-gradient(to right, rgba(210, 230, 255, 0.5), rgba(180, 210, 250, 0.3))', // Subtle blue
  obligation: 'linear-gradient(to right, rgba(230, 230, 230, 0.5), rgba(210, 210, 210, 0.3))', // Subtle gray
  transformed_relief: 'linear-gradient(to right, rgba(180, 250, 210, 0.3), rgba(180, 210, 250, 0.3))', // Green-Blue
  transformed_obligation: 'linear-gradient(to right, rgba(180, 250, 210, 0.3), rgba(210, 210, 210, 0.3))', // Green-Gray
  relief_obligation: 'linear-gradient(to right, rgba(180, 210, 250, 0.3), rgba(210, 210, 210, 0.3))', // Blue-Gray
  balanced: 'linear-gradient(to right, rgba(220, 220, 250, 0.5), rgba(220, 250, 220, 0.3))' // Subtle rainbow
};

// Feedback insights messages for all possible combinations
const FEEDBACK_MESSAGES = {
  // 🔷 Predominância clara: Transformação
  // O usuário concluiu muitas tarefas que deixaram uma sensação forte de evolução pessoal.
  transformed: "% das suas tarefas te transformaram.\nVocê está priorizando entregas que impactam quem você é.\nIsso mostra foco em crescimento real e construção pessoal.",

  // 🔷 Predominância clara: Alívio
  // O usuário concluiu tarefas que aliviaram pressão ou pendências — sem peso emocional profundo.
  relief: "% das suas tarefas te deram alívio.\nVocê está escolhendo aliviar pressões, mas talvez sem investir tanto em evolução.\nIsso pode ser útil, mas não transforma.",

  // 🔷 Predominância clara: Obrigação
  // Tarefas concluídas foram percebidas como cumprimento necessário, sem envolvimento emocional ou identidade.
  obligation: "% das suas tarefas foram classificadas como 'só obrigação'.\nVocê está executando o necessário, mas sem envolvimento pessoal.\nIsso indica esforço sem nenhuma identificação com as tarefas e sem nenhum foco na construção de si mesmo.",

  // 🔷 Empate: Transformação + Alívio
  // O usuário concluiu tarefas que tanto o fizeram crescer quanto trouxeram alívio emocional.
  transformed_relief: "Suas tarefas mais recentes te fizeram crescer e também aliviaram o peso.\nVocê saiu de muitas delas sentindo evolução, mas também respirando fundo.\nÉ um equilíbrio entre se construir e se preservar.",

  // 🔷 Empate: Transformação + Obrigação
  // O usuário alternou entre tarefas que geraram orgulho/evolução e outras feitas só por dever.
  transformed_obligation: "Você concluiu tarefas que realmente mexeram com você, mas também outras que foram só dever cumprido.\nÉ um contraste entre fazer por identidade e fazer por obrigação.\nEsse padrão revela momentos de potência, cercados de manutenção.",

  // 🔷 Empate: Alívio + Obrigação
  // A maioria das tarefas trouxe apenas leveza ou foi feita por necessidade, sem emoção mais profunda.
  relief_obligation: "Suas tarefas têm girado entre tirar peso da frente e só cumprir o que precisa.\nVocê está se mantendo funcional, mas sem se ver no que faz.\nIsso pode parecer produtividade, mas não constrói quem você quer ser.",

  // 🔷 Empate: Todos os três — Transformação + Alívio + Obrigação
  // O usuário tem vivido uma experiência fragmentada, sentindo de tudo um pouco após concluir as tarefas.
  balanced: "Suas tarefas têm te feito sentir um pouco de tudo: transformação, alívio e obrigação.\nVocê está fazendo, sentindo, cumprindo — mas sem um padrão claro.\nEsse mix pode ser sinal de versatilidade... ou de falta de foco emocional na execução."
};

export const useFeedbackAnalysis = (tasks: Task[]) => {
  // Calculate feedback distribution
  const feedbackData = useMemo(() => {
    if (tasks.length === 0) {
      return {
        distribution: [
          { name: 'Foi só obrigação', value: 0, percent: 0, color: COLORS.feedback.obligation, id: 'obligation' },
          { name: 'Deu alívio', value: 0, percent: 0, color: COLORS.feedback.relief, id: 'relief' },
          { name: 'Me transformou', value: 0, percent: 0, color: COLORS.feedback.transformed, id: 'transformed' }
        ],
        insight: '',
        withFeedback: false,
        topFeedback: ''
      };
    }
    
    // Count actual feedback from tasks
    let transformed = 0;
    let relief = 0;
    let obligation = 0;
    
    tasks.forEach(task => {
      if (task.feedback === 'transformed') transformed++;
      else if (task.feedback === 'relief') relief++;
      else if (task.feedback === 'obligation') obligation++;
    });
    
    const total = transformed + relief + obligation;
    const withFeedback = total > 0;
    
    // Calculate percentages if we have feedback data
    const transformedPercent = withFeedback ? Math.round((transformed / total) * 100) : 0;
    const reliefPercent = withFeedback ? Math.round((relief / total) * 100) : 0;
    const obligationPercent = withFeedback ? Math.round((obligation / total) * 100) : 0;
    
    // Determine insight based on highest percentage and possible ties
    let insight = '';
    let topFeedback = '';

    // Define threshold for considering percentages as tied (within 5%)
    const THRESHOLD = 5;
    
    // Helper function to check if two values are considered tied
    const isTied = (a: number, b: number) => Math.abs(a - b) <= THRESHOLD;
    
    if (withFeedback) {
      // Check for three-way tie
      if (isTied(transformedPercent, reliefPercent) && 
          isTied(reliefPercent, obligationPercent) && 
          isTied(transformedPercent, obligationPercent)) {
        insight = FEEDBACK_MESSAGES.balanced;
        topFeedback = 'balanced';
      }
      // Check for two-way ties
      else if (isTied(transformedPercent, reliefPercent) && 
               transformedPercent > obligationPercent) {
        insight = FEEDBACK_MESSAGES.transformed_relief;
        topFeedback = 'transformed_relief';
      }
      else if (isTied(transformedPercent, obligationPercent) && 
               transformedPercent > reliefPercent) {
        insight = FEEDBACK_MESSAGES.transformed_obligation;
        topFeedback = 'transformed_obligation';
      }
      else if (isTied(reliefPercent, obligationPercent) && 
               reliefPercent > transformedPercent) {
        insight = FEEDBACK_MESSAGES.relief_obligation;
        topFeedback = 'relief_obligation';
      }
      // Check for single predominant type
      else if (transformedPercent > reliefPercent && transformedPercent > obligationPercent) {
        insight = `${transformedPercent}${FEEDBACK_MESSAGES.transformed}`;
        topFeedback = 'transformed';
      }
      else if (reliefPercent > transformedPercent && reliefPercent > obligationPercent) {
        insight = `${reliefPercent}${FEEDBACK_MESSAGES.relief}`;
        topFeedback = 'relief';
      }
      else if (obligationPercent > transformedPercent && obligationPercent > reliefPercent) {
        insight = `${obligationPercent}${FEEDBACK_MESSAGES.obligation}`;
        topFeedback = 'obligation';
      }
    }
    
    // If there's no feedback data, add some sample data for visualization
    if (!withFeedback) {
      console.log("No feedback data found in tasks. Adding sample data for visualization.");
      // Use sample data instead of updating the actual counts
      return {
        distribution: [
          { name: 'Foi só obrigação', value: 1, percent: 12, color: COLORS.feedback.obligation, id: 'obligation' },
          { name: 'Deu alívio', value: 4, percent: 50, color: COLORS.feedback.relief, id: 'relief' },
          { name: 'Me transformou', value: 3, percent: 38, color: COLORS.feedback.transformed, id: 'transformed' }
        ],
        insight: `50${FEEDBACK_MESSAGES.relief}`,
        withFeedback: true,
        topFeedback: 'relief'
      };
    }
    
    return {
      distribution: [
        { name: 'Foi só obrigação', value: obligation, percent: obligationPercent, color: COLORS.feedback.obligation, id: 'obligation' },
        { name: 'Deu alívio', value: relief, percent: reliefPercent, color: COLORS.feedback.relief, id: 'relief' },
        { name: 'Me transformou', value: transformed, percent: transformedPercent, color: COLORS.feedback.transformed, id: 'transformed' }
      ],
      insight,
      withFeedback,
      topFeedback
    };
  }, [tasks]);

  return feedbackData;
};
