
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Check, Smile, Droplets, Frown } from 'lucide-react';
import { Task } from '../types';
import { useAppContext } from '../context/AppContext';

interface FeedbackOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
}

interface PostCompletionFeedbackProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (feedbackType: string) => void;
}

const PostCompletionFeedback: React.FC<PostCompletionFeedbackProps> = ({
  task,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleConfirm = () => {
    if (selectedOption) {
      onConfirm(selectedOption);
      setSelectedOption(null);
    }
  };

  const handleCancel = () => {
    setSelectedOption(null);
    onClose();
  };

  const feedbackOptions: FeedbackOption[] = [
    {
      id: 'transformed',
      label: 'Me transformou',
      description: 'Esta tarefa me fortaleceu e expandiu',
      icon: <Smile className="h-6 w-6" />,
      colorClass: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800'
    },
    {
      id: 'relief',
      label: 'Deu alívio',
      description: 'Senti uma liberação de pressão',
      icon: <Droplets className="h-6 w-6" />,
      colorClass: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800'
    },
    {
      id: 'obligation',
      label: 'Foi só obrigação',
      description: 'Apenas cumpri o que precisava ser feito',
      icon: <Frown className="h-6 w-6" />,
      colorClass: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            Como você se sentiu ao concluir essa tarefa?
          </DialogTitle>
          {task && (
            <p className="text-center text-sm text-muted-foreground mt-1">
              "{task.title}"
            </p>
          )}
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {feedbackOptions.map((option) => (
              <div
                key={option.id}
                className={`
                  p-4 rounded-lg border cursor-pointer transition-all duration-200
                  ${selectedOption === option.id ? option.colorClass + ' scale-105' : 'bg-background hover:bg-muted'}
                `}
                onClick={() => handleOptionSelect(option.id)}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className={`
                    p-2 rounded-full
                    ${selectedOption === option.id ? 'bg-white/80 dark:bg-black/20' : 'bg-muted'}
                  `}>
                    {option.icon}
                  </div>
                  <h3 className="font-medium">{option.label}</h3>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedOption}
            className="gap-1"
          >
            <Check className="h-4 w-4" />
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostCompletionFeedback;
