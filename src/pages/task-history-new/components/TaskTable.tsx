
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

  return (
    <div className="border rounded-md">
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
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                Nenhuma tarefa encontrada
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell 
                  className="font-medium"
                  onClick={() => onSelectTask(task.id)}
                >
                  {task.title}
                </TableCell>
                <TableCell onClick={() => onSelectTask(task.id)}>
                  {task.totalScore || 0}/15
                </TableCell>
                <TableCell onClick={() => onSelectTask(task.id)}>
                  <span className="capitalize">
                    {getDominantPillar(task)}
                  </span>
                </TableCell>
                <TableCell onClick={() => onSelectTask(task.id)}>
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
