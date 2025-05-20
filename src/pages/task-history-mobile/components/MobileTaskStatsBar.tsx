
import React from 'react';
import { Activity, Award, Hash } from 'lucide-react';

interface MobileTaskStatsBarProps {
  taskCount: number;
  highScoreTasks: number;
  averageScore: string;
}

const MobileTaskStatsBar: React.FC<MobileTaskStatsBarProps> = ({
  taskCount,
  highScoreTasks,
  averageScore
}) => {
  return (
    <div className="grid grid-cols-3 gap-1 px-4 py-3 bg-muted/30 border-b">
      <div className="text-center">
        <div className="flex flex-col items-center">
          <div className="bg-blue-100 p-1.5 rounded-full mb-1.5">
            <Hash size={16} className="text-blue-600" />
          </div>
          <div className="font-semibold">{taskCount}</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
      </div>
      
      <div className="text-center">
        <div className="flex flex-col items-center">
          <div className="bg-orange-100 p-1.5 rounded-full mb-1.5">
            <Award size={16} className="text-orange-600" />
          </div>
          <div className="font-semibold">{highScoreTasks}</div>
          <div className="text-xs text-muted-foreground">Alto valor</div>
        </div>
      </div>
      
      <div className="text-center">
        <div className="flex flex-col items-center">
          <div className="bg-green-100 p-1.5 rounded-full mb-1.5">
            <Activity size={16} className="text-green-600" />
          </div>
          <div className="font-semibold">{averageScore}</div>
          <div className="text-xs text-muted-foreground">Média</div>
        </div>
      </div>
    </div>
  );
};

export default MobileTaskStatsBar;
