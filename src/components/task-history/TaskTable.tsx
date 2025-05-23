
import React, { useState } from 'react';
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
import { RefreshCw, Eye } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import CompletedTaskModal from './completed-task-modal';
import RestoreTaskConfirmation from './RestoreTaskConfirmation';
import DateTimeDisplay from '@/components/DateTimeDisplay';
import { logDateInfo } from '@/utils/diagnosticLog';

// Table row component
export const CompletedTaskRow: React.FC<{ task: Task }> = ({ task }) => {
  const [showRestore, setShowRestore] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showRestoreConfirmation, setShowRestoreConfirmation] = useState(false);
  const { restoreTask } = useAppContext();

  // Log the task's completedAt for diagnosis
  React.useEffect(() => {
    logDateInfo('CompletedTaskRow', `Task ${task.id} completedAt in table`, task.completedAt);
  }, [task.id, task.completedAt]);

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

  // Updated score color getter to match TaskScoreDisplay
  const getScoreColor = (score: number) => {
    if (score >= 14) return 'text-red-600';
    if (score >= 11) return 'text-orange-500';
    if (score >= 8) return 'text-blue-600';
    return 'text-slate-500';
  };

  const dominantPillar = getDominantPillar();
  const scoreColor = getScoreColor(task.totalScore);
  
  // Consistent feedback mapping across the application
  const feedbackLabels = {
    transformed: 'Foi transformador terminar',
    relief: 'Tive alívio ao finalizar',
    obligation: 'Terminei por obrigação'
  };

  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowRestoreConfirmation(true);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTaskModal(true);
  };

  const handleRowClick = () => {
    setShowTaskModal(true);
  };

  return (
    <>
      <TableRow onClick={handleRowClick} className="cursor-pointer">
        <TableCell className="opacity-70">{task.title}</TableCell>
        <TableCell>
          <DateTimeDisplay 
            date={task.completedAt} 
            showTimeZone={false} 
            showRelative={false}
            fallback="(data não disponível)" 
          />
        </TableCell>
        <TableCell className={scoreColor}>{task.totalScore}/15</TableCell>
        <TableCell className="capitalize">{dominantPillar}</TableCell>
        <TableCell>{task.feedback ? feedbackLabels[task.feedback as keyof typeof feedbackLabels] || '-' : '-'}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                handleView(e);
              }}
            >
              <Eye size={16} />
              Visualizar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                handleRestore(e);
              }}
            >
              <RefreshCw size={16} />
              Restaurar
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {showTaskModal && (
        <CompletedTaskModal 
          task={task} 
          isOpen={showTaskModal} 
          onClose={() => setShowTaskModal(false)} 
        />
      )}

      {showRestoreConfirmation && (
        <RestoreTaskConfirmation
          task={task}
          isOpen={showRestoreConfirmation}
          onClose={() => setShowRestoreConfirmation(false)}
        />
      )}
    </>
  );
};

export const TasksTable: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  // Verificar se temos tarefas válidas
  if (!tasks || tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-center text-muted-foreground">Sem tarefas para exibir</p>
        </CardContent>
      </Card>
    );
  }

  return (
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
};
