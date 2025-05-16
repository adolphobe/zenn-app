
import React from 'react';
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

interface DeleteTaskConfirmationProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteTaskConfirmation: React.FC<DeleteTaskConfirmationProps> = ({
  task,
  isOpen,
  onClose,
}) => {
  const { deleteTask } = useAppContext();

  const handleConfirm = () => {
    if (deleteTask) {
      deleteTask(task.id);
    }
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir tarefa</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a excluir a tarefa <strong>"{task.title}"</strong> da sua lista de tarefas.
            <br /><br />
            Essa ação não pode ser desfeita. Deseja continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTaskConfirmation;
