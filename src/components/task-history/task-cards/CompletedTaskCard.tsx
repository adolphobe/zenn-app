import React, { useState } from 'react';
import { Task } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle2, Clock4, Edit, ListChecks, MessageSquare, User2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import TaskComments from '@/components/TaskComments';

interface CompletedTaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export const CompletedTaskCard: React.FC<CompletedTaskCardProps> = ({
  task,
  onEdit,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {task.title}
          </h3>
          <Badge className="bg-green-500 text-white">Concluída</Badge>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{task.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {task.tags && task.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <div className="mt-4 flex items-center text-gray-500 dark:text-gray-300 text-sm">
          <User2 className="mr-2 h-4 w-4" />
          <span>{task.assignee?.name || 'Sem responsável'}</span>
        </div>
        <div className="mt-2 flex items-center text-gray-500 dark:text-gray-300 text-sm">
          <Clock4 className="mr-2 h-4 w-4" />
          <span>
            Concluída{' '}
            {formatDistanceToNow(new Date(task.endDate || ''), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
        <Button variant="ghost" size="sm" onClick={() => onEdit?.(task)}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Editar</span>
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Ver detalhes</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{task.title}</DialogTitle>
              <DialogDescription>
                Detalhes completos da tarefa concluída.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] w-full pr-4">
              <div className="grid gap-4 py-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Status:</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Concluída</span>
                </div>
                <div>
                  <span className="text-sm font-medium">Descrição:</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Responsável:</span>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={task.assignee?.avatarUrl || ''} alt={task.assignee?.name || 'Avatar'} />
                      <AvatarFallback>{task.assignee?.name?.substring(0, 2).toUpperCase() || 'UN'}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{task.assignee?.name || 'Sem responsável'}</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {task.tags && task.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Data de Conclusão:</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(task.endDate || '').toLocaleDateString(
                      'pt-BR',
                      {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      }
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium">Comentários:</span>
                  <TaskComments 
                    taskId={task.id} 
                    comments={task.comments || []} 
                  />
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
