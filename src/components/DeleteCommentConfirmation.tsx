
import React from 'react';
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

interface DeleteCommentConfirmationProps {
  commentId: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (commentId: string) => void;
}

const DeleteCommentConfirmation: React.FC<DeleteCommentConfirmationProps> = ({
  commentId,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const handleConfirm = () => {
    onConfirm(commentId);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir comentário</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a excluir este comentário.
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

export default DeleteCommentConfirmation;
