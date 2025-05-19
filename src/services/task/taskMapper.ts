
import { Task } from '@/types';
import { dateService } from '../dateService';

/**
 * Maps Supabase response data to the Task type with consistent date handling
 */
export const mapToTask = (data: any): Task => ({
  id: data.id,
  title: data.title,
  consequenceScore: data.consequence_score,
  prideScore: data.pride_score,
  constructionScore: data.construction_score,
  totalScore: data.total_score,
  idealDate: dateService.parseDate(data.ideal_date),
  hidden: data.hidden,
  completed: data.completed,
  completedAt: dateService.parseDate(data.completed_at),
  createdAt: dateService.parseDate(data.created_at) || new Date(),
  updatedAt: dateService.parseDate(data.updated_at) || new Date(),
  userId: data.user_id || '',
  feedback: data.feedback,
  pillar: data.pillar,
  comments: data.comments || [],
  operationLoading: {}
});

/**
 * Determines the dominant pillar based on task scores
 */
export const calculateDominantPillar = (
  consequenceScore: number, 
  prideScore: number, 
  constructionScore: number
): string => {
  const scores = [
    { name: 'risco', value: consequenceScore },
    { name: 'orgulho', value: prideScore },
    { name: 'crescimento', value: constructionScore },
  ];
  
  return scores.reduce((prev, current) => 
    (prev.value > current.value) ? prev : current
  ).name;
};

/**
 * Calculates the total score from individual pillar scores
 */
export const calculateTotalScore = (
  consequenceScore: number, 
  prideScore: number, 
  constructionScore: number
): number => {
  return consequenceScore + prideScore + constructionScore;
};
