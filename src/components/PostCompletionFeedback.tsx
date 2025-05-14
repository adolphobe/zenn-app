
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Task } from '../types';

const feedbackOptions = [
  {
    type: 'satisfaction',
    label: 'Satisfação plena',
    description: 'Sinto que conquistei algo importante',
    color: 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-800',
    textColor: 'text-green-800 dark:text-green-300'
  },
  {
    type: 'relief',
    label: 'Deu alívio',
    description: 'Tirei um peso das costas',
    color: 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-800',
    textColor: 'text-blue-800 dark:text-blue-300'
  },
  {
    type: 'neutral',
    label: 'Neutro',
    description: 'Apenas cumpri uma obrigação',
    color: 'bg-gray-100 border-gray-300 dark:bg-gray-800/50 dark:border-gray-700',
    textColor: 'text-gray-800 dark:text-gray-300'
  }
];

interface PostCompletionFeedbackProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (feedbackType: string) => void;
}

const PostCompletionFeedback: React.FC<PostCompletionFeedbackProps> = ({ task, isOpen, onClose, onConfirm }) => {
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedFeedback) {
      onConfirm(selectedFeedback);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Missão cumprida! 🎯</DialogTitle>
          <DialogDescription>
            Como você se sente agora que concluiu "{task.title}"?
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {feedbackOptions.map(option => (
            <button
              key={option.type}
              className={`p-4 border rounded-lg transition-all ${option.color} ${option.textColor} ${
                selectedFeedback === option.type 
                  ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400' 
                  : 'hover:bg-opacity-80'
              }`}
              onClick={() => setSelectedFeedback(option.type)}
            >
              <div className="font-medium text-lg mb-1">{option.label}</div>
              <div className="text-sm opacity-90">{option.description}</div>
            </button>
          ))}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedFeedback}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostCompletionFeedback;
