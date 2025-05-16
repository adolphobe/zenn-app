
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Task } from '@/types'; 
import { 
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

// Table row component
export const CompletedTaskRow: React.FC<{ task: Task }> = ({ task }) => {
  const [showRestore, setShowRestore] = useState(false);
  const { restoreTask } = useAppContext();

  // Determine dominant pillar based on scores
  const getDominantPillar = () => {
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

  const dominantPillar = getDominantPillar();
  
  // Consistent feedback mapping across the application
  const feedbackLabels = {
    transformed: 'Foi transformador terminar',
    relief: 'Tive alívio ao finalizar',
    obligation: 'Terminei por obrigação'
  };

  // Format the completion date and time in Brazilian format (DD/MM/YYYY HH:MM)
  const formatCompletionDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    try {
      const date = parseISO(dateString);
      console.log(`[TaskTable] Formatting date for "${task.title}": ${dateString} -> parsed as ${date}`);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch (e) {
      console.error("Error formatting date:", e);
      console.error("Invalid date string:", dateString);
      return '-';
    }
  };

  const completedDateTime = formatCompletionDateTime(task.completedAt);

  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (restoreTask) {
      restoreTask(task.id);
    }
  };

  return (
    <TableRow onClick={() => setShowRestore(!showRestore)} className="cursor-pointer">
      <TableCell className="opacity-70">{task.title}</TableCell>
      <TableCell>{completedDateTime}</TableCell>
      <TableCell>{task.totalScore}/15</TableCell>
      <TableCell className="capitalize">{dominantPillar}</TableCell>
      <TableCell>{task.feedback ? feedbackLabels[task.feedback] : '-'}</TableCell>
      <TableCell>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={handleRestore}
        >
          <RefreshCw size={16} />
          Restaurar
        </Button>
      </TableCell>
    </TableRow>
  );
};

export const TasksTable: React.FC<{ tasks: Task[] }> = ({ tasks }) => (
  <Card>
    <CardContent className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Concluído em</TableHead>
            <TableHead>Pontuação</TableHead>
            <TableHead>Pilar</TableHead>
            <TableHead>Feedback</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map(task => (
            <CompletedTaskRow key={task.id} task={task} />
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);
