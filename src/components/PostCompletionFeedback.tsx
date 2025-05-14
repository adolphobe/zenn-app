
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Task } from '../types';
import { useIsMobile } from '@/hooks/use-mobile';

interface PostCompletionFeedbackProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (feedbackType: string) => void;
}

const PostCompletionFeedback: React.FC<PostCompletionFeedbackProps> = ({ task, isOpen, onClose, onConfirm }) => {
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleConfirm = () => {
    if (selectedFeedback) {
      onConfirm(selectedFeedback);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">Como você se sentiu ao concluir essa tarefa?</DialogTitle>
          <DialogDescription className="text-center">
            "{task.title}"
          </DialogDescription>
        </DialogHeader>
        
        <div className={`grid ${isMobile ? 'gap-4 py-4' : 'grid-cols-3 gap-3 py-4'}`}>
          <button
            className={`p-4 border rounded-lg transition-all ${
              selectedFeedback === 'satisfaction' 
                ? 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-800' 
                : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-green-50'
            }`}
            onClick={() => setSelectedFeedback('satisfaction')}
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl">😊</span>
              <div className="font-medium text-center mt-2">Me transformou</div>
              <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-300">
                Esta tarefa me fortaleceu e expandiu
              </p>
            </div>
          </button>

          <button
            className={`p-4 border rounded-lg transition-all ${
              selectedFeedback === 'relief' 
                ? 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-800' 
                : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-50'
            }`}
            onClick={() => setSelectedFeedback('relief')}
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl">🔥</span>
              <div className="font-medium text-center mt-2">Deu alívio</div>
              <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-300">
                Senti uma liberação de pressão
              </p>
            </div>
          </button>

          <button
            className={`p-4 border rounded-lg transition-all ${
              selectedFeedback === 'neutral' 
                ? 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600' 
                : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedFeedback('neutral')}
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl">😐</span>
              <div className="font-medium text-center mt-2">Foi só obrigação</div>
              <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-300">
                Apenas cumpri o que precisava ser feito
              </p>
            </div>
          </button>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!selectedFeedback}
            className="w-full sm:w-auto"
          >
            ✓ Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostCompletionFeedback;
