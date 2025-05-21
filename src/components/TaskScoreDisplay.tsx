
import React, { useEffect, useState } from 'react';
import { cn } from "../lib/utils";
import "../styles/task-score.css";

interface TaskScoreDisplayProps {
  score: number;
  maxScore?: number;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const TaskScoreDisplay: React.FC<TaskScoreDisplayProps> = ({ 
  score, 
  maxScore = 15,
  animate = true,
  size = 'md'
}) => {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    if (animate && score >= 11) {
      setAnimated(true);
      const timer = setTimeout(() => setAnimated(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [score, animate]);

  // Determine the styling based on score ranges
  const getScoreStyling = () => {
    if (score >= 14) {
      return "task-score-critical"; // Red with animation
    } else if (score >= 11) {
      return "task-score-important"; // Orange with animation
    } else if (score >= 8) {
      return "task-score-moderate"; // Blue without animation
    } else {
      return "task-score-light"; // Light gray without animation
    }
  };

  const getScoreLabel = () => {
    if (score >= 14) {
      return "Tarefa Crítica";
    } else if (score >= 11) {
      return "Tarefa Importante";
    } else if (score >= 8) {
      return "Tarefa Moderada";
    } else {
      return "Tarefa Leve";
    }
  };

  const scoreClassName = getScoreStyling();
  const animationClass = (score >= 11 && animated) ? "task-score-animate" : "";

  const textSize = {
    sm: "text-base",
    md: "text-[20px]",
    lg: "text-3xl"
  };

  return (
    <div className="task-score-container">
      <div className="task-score-header">
        <span className={cn("task-score-title", textSize[size], scoreClassName, animationClass)}>
          Score Total:
        </span>
        <span className={cn("task-score-value", textSize[size], scoreClassName, animationClass)}>
          {score}/{maxScore}
        </span>
      </div>
      <div className="task-score-label">
        {getScoreLabel()}
      </div>
    </div>
  );
};

export default TaskScoreDisplay;
