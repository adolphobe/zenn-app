
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
import { Task } from '@/types';

interface TaskTableProps {
  tasks: Task[];
  onSelectTask: (taskId: string) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, onSelectTask }) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tarefa</TableHead>
            <TableHead>Pontuação</TableHead>
            <TableHead>Pilar</TableHead>
            <TableHead>Data de Conclusão</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                Nenhuma tarefa encontrada
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow 
                key={task.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onSelectTask(task.id)}
              >
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{task.totalScore || 0}</TableCell>
                <TableCell>
                  <span className="capitalize">{task.pillar || 'N/A'}</span>
                </TableCell>
                <TableCell>
                  {task.completedAt 
                    ? format(task.completedAt, 'dd/MM/yyyy HH:mm') 
                    : 'Data desconhecida'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
