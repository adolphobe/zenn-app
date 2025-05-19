
import React from 'react';
import { Task } from '@/types';
import CompletionTimeAnalysisCard from './CompletionTimeAnalysisCard';
import { motion } from 'framer-motion';

interface TaskAnalyticsSectionProps {
  tasks: Task[];
  isVisible: boolean;
}

const TaskAnalyticsSection: React.FC<TaskAnalyticsSectionProps> = ({ 
  tasks, 
  isVisible 
}) => {
  if (!isVisible) return null;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.4
      }
    }
  };

  return (
    <motion.div
      className="mt-8 mb-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="text-xl font-bold mb-4">Análise de Tarefas</h2>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <CompletionTimeAnalysisCard tasks={tasks} />
      </motion.div>
    </motion.div>
  );
};

export default TaskAnalyticsSection;
