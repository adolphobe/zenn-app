
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Task } from '@/types';
import { useAppContext } from '@/context/AppContext';
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

interface RestoreTaskConfirmationProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const RestoreTaskConfirmation: React.FC<RestoreTaskConfirmationProps> = ({
  task,
  isOpen,
  onClose,
}) => {
  const { restoreTask } = useAppContext();

  const handleConfirm = () => {
    if (restoreTask) {
      restoreTask(task.id);
    }
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
          <AlertDialogAction onClick={handleConfirm}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RestoreTaskConfirmation;
