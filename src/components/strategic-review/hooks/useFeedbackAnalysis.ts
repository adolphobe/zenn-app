
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
  obligation: 'linear-gradient(to right, rgba(230, 230, 230, 0.5), rgba(210, 210, 210, 0.3))' // Subtle gray
};

// Feedback insights messages
export const FEEDBACK_MESSAGES = {
  transformed: "% das suas tarefas te 'transformaram'. Você está focando no que realmente te fortalece.",
  relief: "% das suas tarefas te deram 'alívio'. Você está buscando reduzir peso mais do que construir potência.",
  obligation: "% das suas tarefas foram classificadas como 'só obrigação'. Você pode estar executando sem identidade."
};

export const useFeedbackAnalysis = (tasks: Task[]) => {
  // Calculate feedback distribution
  const feedbackData = useMemo(() => {
    if (tasks.length === 0) {
      return {
        distribution: [
          { name: 'Me transformou', value: 0, percent: 0, color: COLORS.feedback.transformed, id: 'transformed' },
          { name: 'Deu alívio', value: 0, percent: 0, color: COLORS.feedback.relief, id: 'relief' },
          { name: 'Foi só obrigação', value: 0, percent: 0, color: COLORS.feedback.obligation, id: 'obligation' }
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
    
    // Ensure we have at least minimal data for testing
    if (!withFeedback) {
      console.log("No feedback data found in tasks. Adding sample data for visualization.");
      transformed = 1;
      relief = 2;
      obligation = 1;
    }
    
    // Determine insight based on highest percentage
    let insight = '';
    let topFeedback = '';
    
    if (withFeedback) {
      if (obligationPercent >= reliefPercent && obligationPercent >= transformedPercent) {
        insight = `${obligationPercent}${FEEDBACK_MESSAGES.obligation}`;
        topFeedback = 'obligation';
      } else if (transformedPercent >= reliefPercent && transformedPercent >= obligationPercent) {
        insight = `${transformedPercent}${FEEDBACK_MESSAGES.transformed}`;
        topFeedback = 'transformed';
      } else if (reliefPercent >= transformedPercent && reliefPercent >= obligationPercent) {
        insight = `${reliefPercent}${FEEDBACK_MESSAGES.relief}`;
        topFeedback = 'relief';
      }
    }
    
    return {
      distribution: [
        { name: 'Me transformou', value: transformed, percent: transformedPercent, color: COLORS.feedback.transformed, id: 'transformed' },
        { name: 'Deu alívio', value: relief, percent: reliefPercent, color: COLORS.feedback.relief, id: 'relief' },
        { name: 'Foi só obrigação', value: obligation, percent: obligationPercent, color: COLORS.feedback.obligation, id: 'obligation' }
      ],
      insight,
      withFeedback,
      topFeedback
    };
  }, [tasks]);

  return feedbackData;
};
