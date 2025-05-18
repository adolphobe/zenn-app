
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

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  
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
      // In a real implementation, we would delete the account here
      // For now, we'll just show a toast and close the modal
      toast({
        title: "Operação simulada",
        description: "Em uma implementação real, sua conta seria excluída.",
      });
      
      // Reset the state and close the modal
      setStep(1);
      setConfirmText('');
      setError('');
      onClose();
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
            variant="outline"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleNext}
            className={step === 1 ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {step === 1 ? "Avançar" : "Confirmar exclusão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountModal;
