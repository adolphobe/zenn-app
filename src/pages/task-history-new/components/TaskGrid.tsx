
import React from 'react';
import { Task } from '@/types';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskGridProps {
  tasks: Task[];
  onSelectTask: (taskId: string) => void;
  onRestoreTask?: (taskId: string) => void;
}

export const TaskGrid: React.FC<TaskGridProps> = ({ 
  tasks, 
  onSelectTask, 
  onRestoreTask 
}) => {
  // Helper to determine dominant pillar
  const getDominantPillar = (task: Task) => {
    const scores = [
      { name: 'risco', value: task.consequenceScore },
      { name: 'orgulho', value: task.prideScore },
      { name: 'crescimento', value: task.constructionScore },
    ];
    const max = scores.reduce((prev, current) => 
      (prev.value > current.value) ? prev : current
    );
    return max.name;
  };

  // Visual styles per pillar
  const pillarColors: Record<string, string> = {
    risco: 'bg-orange-100 text-orange-800 border-orange-200',
    orgulho: 'bg-purple-100 text-purple-800 border-purple-200',
    crescimento: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  // Visual styles per feedback type
  const feedbackColors: Record<string, string> = {
    transformed: 'bg-[#deffe0] text-[#3d8c40] border-[#a8d9aa]',
    relief: 'bg-[#e2f2ff] text-[#2970a8] border-[#a3d0f0]',
    obligation: 'bg-[#f1f1f1] text-[#6e6e6e] border-[#d0d0d0]',
  };

  const feedbackLabels: Record<string, string> = {
    transformed: 'Foi transformador terminar',
    relief: 'Tive alívio ao finalizar',
    obligation: 'Terminei por obrigação'
  };

  // Determine border color based on task score
  const getBorderColor = (score: number) => {
    if (score >= 12) return 'border-l-green-500';
    if (score >= 9) return 'border-l-blue-500';
    if (score >= 6) return 'border-l-orange-500';
    return 'border-l-gray-300';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  if (!tasks.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma tarefa encontrada para os filtros atuais.</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {tasks.map((task) => {
        const dominantPillar = getDominantPillar(task);
        const borderColorClass = getBorderColor(task.totalScore);

        return (
          <motion.div key={task.id} variants={itemVariants}>
            <Card className={`mb-3 border-l-4 ${borderColorClass} hover:bg-muted/10 transition-colors shadow-sm hover:shadow-md`}>
              <CardContent className="p-4">
                <div 
                  className="cursor-pointer"
                  onClick={() => onSelectTask(task.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">{task.title}</h3>
                    <Badge variant="outline" className={`bg-gray-100 text-gray-800 ml-2 ${task.totalScore >= 12 ? 'bg-green-50 text-green-800' : ''}`}>
                      {task.totalScore}/15
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Concluída em {task.completedAt 
                      ? format(new Date(task.completedAt), 'dd/MM/yyyy')
                      : '(data não disponível)'}
                  </p>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {task.feedback && (
                      <Badge className={feedbackColors[task.feedback] || 'bg-gray-100 text-gray-800'} variant="outline">
                        {feedbackLabels[task.feedback] || '-'}
                      </Badge>
                    )}
                    
                    <Badge
                      className={pillarColors[dominantPillar] || 'bg-gray-100 text-gray-800'}
                      variant="outline"
                    >
                      {dominantPillar}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTask(task.id);
                    }}
                  >
                    <Eye size={16} />
                    Visualizar
                  </Button>
                  
                  {onRestoreTask && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestoreTask(task.id);
                      }}
                    >
                      <RefreshCw size={16} />
                      Restaurar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
