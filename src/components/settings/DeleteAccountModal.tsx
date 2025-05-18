
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { signOut } = useAuth();
  
  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      // Step 2: Validate the confirmation text
      if (confirmText !== 'APAGAR') {
        setError('Por favor, digite "APAGAR" exatamente como mostrado.');
        return;
      }
      
      // If we get here, the text is correct
      handleDeleteAccount();
    }
  };
  
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Delete the user account using Supabase
      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id || ''
      );
      
      if (error) throw error;
      
      // Log the user out
      await signOut();
      
      toast({
        title: "Conta apagada",
        description: "Sua conta foi apagada com sucesso.",
      });
      
      // Reset the state and close the modal
      setStep(1);
      setConfirmText('');
      setError('');
      onClose();
    } catch (err) {
      console.error('Error deleting account:', err);
      toast({
        title: "Erro ao apagar conta",
        description: "Não foi possível apagar sua conta. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleCancel = () => {
    // Reset the state and close the modal
    setStep(1);
    setConfirmText('');
    setError('');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            Apagar conta
          </DialogTitle>
          <DialogDescription>
            {step === 1 ? (
              <>
                Esta ação não pode ser desfeita. Ao apagar sua conta, todos os seus dados, 
                incluindo tarefas e configurações pessoais, serão permanentemente excluídos.
              </>
            ) : (
              <>
                Para confirmar a exclusão da sua conta, digite <strong>APAGAR</strong> no campo abaixo.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {step === 2 && (
          <div className="py-4">
            <Input
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                setError('');
              }}
              placeholder="Digite APAGAR"
              className={error ? "border-red-500" : ""}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <Button
            variant="destructive"
            onClick={handleCancel}
            className="hover:bg-red-600"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleNext}
            variant="outline"
            disabled={isDeleting}
            className="border-gray-200 hover:bg-transparent"
          >
            {step === 1 ? "Avançar" : isDeleting ? "Excluindo..." : "Confirmar exclusão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountModal;
