
import React from 'react';
import { format } from 'date-fns';
import { Task } from '@/types'; // Import Task type from main types file
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

// Table row component
export const CompletedTaskRow: React.FC<{ task: Task }> = ({ task }) => {
  // Determine dominant pillar based on scores
  const getDominantPillar = () => {
    const scores = [
      { name: 'consequência', value: task.consequenceScore },
      { name: 'orgulho', value: task.prideScore },
      { name: 'construção', value: task.constructionScore },
    ];
    const max = scores.reduce((prev, current) => 
      (prev.value > current.value) ? prev : current
    );
    return max.name;
  };

  const dominantPillar = getDominantPillar();
  const feedbackLabels = {
    transformed: 'Transformadora',
    relief: 'Alívio',
    obligation: 'Obrigação'
  };

  // Make sure we have a completedAt value before trying to format it
  const completedDate = task.completedAt ? format(new Date(task.completedAt), 'dd/MM/yyyy') : '-';

  return (
    <TableRow>
      <TableCell className="line-through opacity-70">{task.title}</TableCell>
      <TableCell>{completedDate}</TableCell>
      <TableCell>{task.totalScore}</TableCell>
      <TableCell className="capitalize">{dominantPillar}</TableCell>
      <TableCell>{task.feedback ? feedbackLabels[task.feedback] : '-'}</TableCell>
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
