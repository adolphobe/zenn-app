
import React from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, RefreshCw } from 'lucide-react';
import { Task } from '@/types';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface TaskTableProps {
  tasks: Task[];
  onSelectTask: (taskId: string) => void;
  onRestoreTask?: (taskId: string) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({ 
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

  // Helper for pillar badge styling
  const getPillarStyles = (pillar: string) => {
    switch(pillar) {
      case 'risco':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'orgulho':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'crescimento':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper for score color
  const getScoreColor = (score: number) => {
    if (score >= 12) return 'text-green-600';
    if (score >= 9) return 'text-blue-600';
    if (score >= 6) return 'text-orange-600';
    return 'text-gray-600';
  };

  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  // Create motion variants for the TableRow
  const MotionTableRow = motion(TableRow);

  return (
    <div className="border rounded-md overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tarefa</TableHead>
            <TableHead>Pontuação</TableHead>
            <TableHead>Pilar</TableHead>
            <TableHead>Data de Conclusão</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        
        {/* Properly wrapping TableBody with motion */}
        <motion.div
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="contents"
        >
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Nenhuma tarefa encontrada
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => {
                const dominantPillar = getDominantPillar(task);
                const pillarStyle = getPillarStyles(dominantPillar);
                const scoreColor = getScoreColor(task.totalScore);
                
                return (
                  <MotionTableRow
                    key={task.id}
                    className="hover:bg-muted/50 transition-colors"
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <TableCell 
                      className="font-medium cursor-pointer"
                      onClick={() => onSelectTask(task.id)}
                    >
                      {task.title}
                    </TableCell>
                    <TableCell 
                      className={`cursor-pointer font-semibold ${scoreColor}`}
                      onClick={() => onSelectTask(task.id)}
                    >
                      {task.totalScore || 0}/15
                    </TableCell>
                    <TableCell 
                      className="cursor-pointer"
                      onClick={() => onSelectTask(task.id)}
                    >
                      <Badge className={`${pillarStyle} capitalize`} variant="outline">
                        {dominantPillar}
                      </Badge>
                    </TableCell>
                    <TableCell 
                      className="cursor-pointer"
                      onClick={() => onSelectTask(task.id)}
                    >
                      {task.completedAt 
                        ? format(new Date(task.completedAt), 'dd/MM/yyyy HH:mm') 
                        : 'Data desconhecida'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
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
                          Ver
                        </Button>
                        
                        {onRestoreTask && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
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
                    </TableCell>
                  </MotionTableRow>
                );
              })
            )}
          </TableBody>
        </motion.div>
      </Table>
    </div>
  );
};
