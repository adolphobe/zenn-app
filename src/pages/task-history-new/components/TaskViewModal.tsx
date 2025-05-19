
import React from 'react';
import { Task } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RefreshCw } from 'lucide-react';

interface TaskViewModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (taskId: string) => void;
}

const TaskViewModal: React.FC<TaskViewModalProps> = ({ 
  task, 
  isOpen, 
  onClose,
  onRestore
}) => {
  if (!task) return null;
  
  // Format date helper
  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Data não disponível';
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };
  
  // Helper to determine dominant pillar
  const getDominantPillar = () => {
    const scores = [
      { name: 'risco', value: task.consequenceScore },
      { name: 'orgulho', value: task.prideScore },
      { name: 'crescimento', value: task.constructionScore },
    ];
    return scores.reduce((prev, current) => 
      (prev.value > current.value) ? prev : current
    ).name;
  };

  const handleRestore = () => {
    onRestore(task.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Detalhes da Tarefa</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {/* Title */}
          <div>
            <h2 className="text-lg font-medium">{task.title}</h2>
            <p className="text-sm text-muted-foreground">
              Concluída em {formatDate(task.completedAt)}
            </p>
          </div>
          
          {/* Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Risco</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pontuação</span>
                <Badge variant="outline">{task.consequenceScore}/5</Badge>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Orgulho</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pontuação</span>
                <Badge variant="outline">{task.prideScore}/5</Badge>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Crescimento</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pontuação</span>
                <Badge variant="outline">{task.constructionScore}/5</Badge>
              </div>
            </div>
          </div>
          
          {/* Total score and pillar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div>
              <h3 className="text-sm font-medium mb-1">Pilar dominante</h3>
              <Badge>{getDominantPillar()}</Badge>
            </div>
            
            <div className="mt-4 md:mt-0">
              <h3 className="text-sm font-medium mb-1">Pontuação total</h3>
              <span className="text-2xl font-bold">{task.totalScore}/15</span>
            </div>
          </div>
          
          {/* Feedback section */}
          {task.feedback && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Feedback</h3>
              <p>
                {task.feedback === 'transformed' && 'Foi transformador terminar'}
                {task.feedback === 'relief' && 'Tive alívio ao finalizar'}
                {task.feedback === 'obligation' && 'Terminei por obrigação'}
              </p>
            </div>
          )}
          
          {/* Comments section - simplified */}
          {task.comments && task.comments.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Comentários</h3>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {task.comments.map((comment, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-sm">{comment.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleRestore}
            className="flex items-center gap-1.5"
          >
            <RefreshCw size={16} />
            Restaurar tarefa
          </Button>
          
          <Button onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskViewModal;
