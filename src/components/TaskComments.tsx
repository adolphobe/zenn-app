
import React from 'react';
import { Comment } from '@/types';
import { Avatar } from './ui/avatar';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import { useAuth } from '@/context/auth';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
}

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId, comments }) => {
  const { currentUser } = useAuth();

  if (!comments || comments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const createdAt = comment.createdAt ? new Date(comment.createdAt) : new Date();
        const isCurrentUserComment = currentUser?.id === comment.userId;
        
        return (
          <div
            key={comment.id}
            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8 border">
                  {comment.user?.avatarUrl ? (
                    <img
                      src={comment.user.avatarUrl}
                      alt={comment.user.name || "Avatar do usuário"}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 font-semibold text-sm">
                      {comment.user?.name ? comment.user.name.substring(0, 2).toUpperCase() : "UN"}
                    </div>
                  )}
                </Avatar>
                <div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {comment.user?.name || "Usuário"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(createdAt, {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {comment.text}
                  </div>
                </div>
              </div>
              {isCurrentUserComment && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                    <span className="sr-only">Excluir comentário</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskComments;
