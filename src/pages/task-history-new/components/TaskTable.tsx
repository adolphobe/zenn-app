
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
import { Eye, RefreshCw, ArrowUp, ArrowDown } from 'lucide-react';
import { Task } from '@/types';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface TaskTableProps {
  tasks: Task[];
  onSelectTask: (taskId: string) => void;
  onRestoreTask?: (taskId: string) => void;
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export const TaskTable: React.FC<TaskTableProps> = ({ 
  tasks, 
  onSelectTask, 
  onRestoreTask,
  onSort,
  sortField,
  sortDirection
}) => {
  // Helper for score color - UPDATED to match TaskScoreDisplay colors exactly
  const getScoreColor = (score: number) => {
    if (score >= 14) return 'text-red-600';
    if (score >= 11) return 'text-orange-500';
    if (score >= 8) return 'text-blue-600';
    return 'text-slate-500';
  };

  // Helper for feedback badge styling
  const getFeedbackStyles = (feedback: string | null) => {
    switch(feedback) {
      case 'transformed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'relief':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'obligation':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper for feedback label - with full messages
  const getFeedbackLabel = (feedback: string | null) => {
    switch(feedback) {
      case 'transformed':
        return 'Foi transformador terminar';
      case 'relief':
        return 'Tive alívio ao finalizar';
      case 'obligation':
        return 'Terminei por obrigação';
      default:
        return 'Sem feedback';
    }
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
  
  // Handle sort click
  const handleSortClick = (field: string) => {
    if (!onSort) return;
    
    // If already sorting by this field, toggle direction
    const newDirection = (sortField === field && sortDirection === 'asc') ? 'desc' : 'asc';
    onSort(field, newDirection);
  };
  
  // Render sort indicator
  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-1 h-4 w-4 inline" /> 
      : <ArrowDown className="ml-1 h-4 w-4 inline" />;
  };
  
  // Make table head sortable
  const SortableTableHead = ({ field, children }: { field: string, children: React.ReactNode }) => {
    // Only add sort functionality if onSort callback is provided
    if (!onSort) return <TableHead>{children}</TableHead>;
    
    return (
      <TableHead 
        className="cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => handleSortClick(field)}
      >
        <div className="flex items-center">
          {children}
          {renderSortIndicator(field)}
        </div>
      </TableHead>
    );
  };

  return (
    <div className="border rounded-md overflow-hidden shadow-sm bg-white">
      {/* Multiple overflow-hidden wrappers to ensure no horizontal scrolling occurs */}
      <div className="w-full overflow-x-hidden">
        <div className="overflow-x-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <SortableTableHead field="title">Tarefa</SortableTableHead>
                <SortableTableHead field="totalScore">Pontuação</SortableTableHead>
                <SortableTableHead field="feedback">Feedback</SortableTableHead>
                <SortableTableHead field="completedAt">Data de Conclusão</SortableTableHead>
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
                    const scoreColor = getScoreColor(task.totalScore);
                    const feedbackStyle = getFeedbackStyles(task.feedback);
                    const feedbackLabel = getFeedbackLabel(task.feedback);
                    
                    return (
                      <MotionTableRow
                        key={task.id}
                        className="hover:bg-gray-50 transition-colors"
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <TableCell 
                          className="font-medium cursor-pointer max-w-[150px] sm:max-w-[300px] truncate"
                          onClick={() => onSelectTask(task.id)}
                        >
                          <span className="block truncate">{task.title}</span>
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
                          <Badge className={`${feedbackStyle} capitalize whitespace-nowrap`} variant="outline">
                            {feedbackLabel}
                          </Badge>
                        </TableCell>
                        <TableCell 
                          className="cursor-pointer whitespace-nowrap"
                          onClick={() => onSelectTask(task.id)}
                        >
                          {task.completedAt 
                            ? format(new Date(task.completedAt), 'dd/MM/yyyy HH:mm') 
                            : 'Data desconhecida'}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
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
      </div>
    </div>
  );
};
