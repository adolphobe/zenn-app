
import React from 'react';
import { Task } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface RestoreTaskDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (taskId: string) => void;
}

export const RestoreTaskDialog: React.FC<RestoreTaskDialogProps> = ({
  task,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!task) return null;

  const handleConfirm = () => {
    onConfirm(task.id);
    onClose();
  };

  // Format date to Brazilian format
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'Hoje';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
  };

  // The restored task will use today as the ideal date if no date was set
  const restorationDate = task.idealDate ? formatDate(task.idealDate) : 'Hoje';

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restaurar tarefa concluída</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a restaurar a tarefa <strong>"{task.title}"</strong> para a sua lista de tarefas.
            <br /><br />
            A tarefa será definida para a data: <strong>{restorationDate}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
       <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction 
          onClick={handleConfirm}
          className="btn-green"
        >
          Confirmar
        </AlertDialogAction>
      </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RestoreTaskDialog;
