
import React, { useEffect, useState } from 'react';
import { cn } from "../lib/utils";
import "../styles/task-score.css";

interface TaskScoreDisplayProps {
  score: number;
  maxScore?: number;
}

const TaskScoreDisplay: React.FC<TaskScoreDisplayProps> = ({ 
  score, 
  maxScore = 15 
}) => {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    setAnimated(true);
    const timer = setTimeout(() => setAnimated(false), 1000);
    return () => clearTimeout(timer);
  }, [score]);

  // Determine the styling based on score ranges
  const getScoreStyling = () => {
    if (score >= 14) {
      return "task-score-critical"; // Red with animation
    } else if (score >= 11) {
      return "task-score-important"; // Orange with animation
    } else if (score >= 8) {
      return "task-score-moderate"; // Now uses blue without animation
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

  return (
    <div className="task-score-container">
      <div className="task-score-header">
        <span className={cn("task-score-title text-[20px]", scoreClassName, animationClass)}>
          Score Total:
        </span>
        <span className={cn("task-score-value text-[20px]", scoreClassName, animationClass)}>
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
