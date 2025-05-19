
import React from 'react';
import { Task } from '@/types';
import PillarAnalysisCard from './PillarAnalysisCard';
import FeedbackAnalysisCard from './FeedbackAnalysisCard';
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
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div variants={itemVariants}>
          <PillarAnalysisCard tasks={tasks} />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <FeedbackAnalysisCard tasks={tasks} />
        </motion.div>
      </div>
      
      <motion.div variants={itemVariants}>
        <CompletionTimeAnalysisCard tasks={tasks} />
      </motion.div>
    </motion.div>
  );
};

export default TaskAnalyticsSection;
