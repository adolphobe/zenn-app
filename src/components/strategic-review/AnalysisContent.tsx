
import React from 'react';
import { Task } from '@/types';
import TaskSummaryCard from './TaskSummaryCard';
import PillarsAnalysisCard from './PillarsAnalysisCard';
import FeedbackAnalysisCard from './FeedbackAnalysisCard';

interface AnalysisContentProps {
  tasks: Task[];
}

const AnalysisContent: React.FC<AnalysisContentProps> = ({ tasks }) => {
  const hasCompletedTasks = tasks.length > 0;
  
  return (
    <div className="space-y-6">
      <TaskSummaryCard tasks={tasks} />
      
      {/* Only show analysis cards if there are tasks */}
      {hasCompletedTasks && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Making each card have the same height with matching flex */}
          <div className="flex">
            <FeedbackAnalysisCard tasks={tasks} />
          </div>
          
          {/* Right column */}
          <div className="flex">
            <PillarsAnalysisCard tasks={tasks} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisContent;
