
import React from 'react';
import { Task } from '@/types';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MobileTaskCardProps {
  task: Task;
  onViewTask: () => void;
}

const MobileTaskCard: React.FC<MobileTaskCardProps> = ({ task, onViewTask }) => {
  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 12) return 'text-orange-600';
    if (score >= 8) return 'text-blue-600';
    return 'text-slate-600';
  };

  // Get feedback badge style
  const getFeedbackStyles = (feedback: string | undefined) => {
    if (!feedback) return '';
    
    const styles = {
      transformed: 'bg-green-100 text-green-700 border-green-300',
      relief: 'bg-blue-100 text-blue-700 border-blue-300',
      obligation: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    
    return styles[feedback as keyof typeof styles] || '';
  };
  
  // Format date nicely
  const formatDate = (dateInput: Date | string | null | undefined) => {
    if (!dateInput) return 'Data desconhecida';
    
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Map feedback to readable text
  const feedbackText = {
    transformed: 'Foi transformador terminar',
    relief: 'Tive alívio ao finalizar',
    obligation: 'Terminei por obrigação'
  };

  const scoreColor = getScoreColor(task.totalScore);
  
  return (
    <Card 
      className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow"
      onClick={onViewTask}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium text-base">{task.title}</h3>
            
            {/* Pill scores and date */}
            <div className="mt-2 flex flex-wrap gap-2 items-center text-xs text-gray-600">
              <span>Risco: <strong>{task.consequenceScore}</strong></span>
              <span className="text-gray-300">|</span>
              <span>Orgulho: <strong>{task.prideScore}</strong></span>
              <span className="text-gray-300">|</span>
              <span>Crescimento: <strong>{task.constructionScore}</strong></span>
              <span className="text-gray-300">|</span>
              <span>{formatDate(task.completedAt)}</span>
            </div>
          </div>
          
          <div className="ml-3 flex flex-col items-end gap-2">
            <Badge 
              variant="outline" 
              className={cn("text-xs", scoreColor)}
            >
              {task.totalScore}/15
            </Badge>
            
            <ArrowRight size={16} className="text-muted-foreground mt-1" />
          </div>
        </div>
        
        {/* Optional feedback badge */}
        {task.feedback && (
          <div className="mt-3">
            <Badge 
              variant="outline" 
              className={cn("text-xs font-normal", getFeedbackStyles(task.feedback))}
            >
              {feedbackText[task.feedback as keyof typeof feedbackText] || ''}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileTaskCard;
