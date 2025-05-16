
import React, { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { Comment } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { X } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
}

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId, comments }) => {
  const { deleteComment } = useAppContext();
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Injetar CSS global para scrollbar
  useEffect(() => {
    // Criar um elemento style
    const style = document.createElement('style');
    const styleId = 'native-scrollbar-styles';
    
    // Verificar se já existe
    if (!document.getElementById(styleId)) {
      style.id = styleId;
      style.innerHTML = `
        /* Personalização da scrollbar para Chrome, Edge e Safari */
        .native-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
          display: block !important;
        }
        
        .native-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .native-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.7);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        
        .native-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.9);
        }
        
        /* Personalização da scrollbar para Firefox */
        .native-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.7) transparent;
        }
        
        /* Estilo para tema escuro */
        .dark .native-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(209, 213, 219, 0.5);
        }
        
        .dark .native-scrollbar {
          scrollbar-color: rgba(209, 213, 219, 0.5) transparent;
        }
      `;
      
      // Adicionar ao head
      document.head.appendChild(style);
    }
    
    // Não é necessário limpar, pois queremos que o estilo permaneça.
  }, []);
  
  // Efeito para rolar para o final sempre que os comentários mudarem
  useEffect(() => {
    if (scrollContainerRef.current && comments.length > 0) {
      // Rolar para o final da div de comentários
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [comments]); // Executar quando os comentários mudarem
  
  if (!comments || comments.length === 0) {
    return null;
  }
  
  const handleDeleteComment = (commentId: string) => {
    if (deleteComment) {
      deleteComment(taskId, commentId);
      setCommentToDelete(null);
    }
  };
  
  // Impedir a propagação do evento de clique
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Comment container clicked, stopped propagation');
  };
  
  return (
    <div className="mt-4" onClick={handleContainerClick}>
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Comentários</h4>
      
      {/* Div com scrollbar nativa e estilização, agora com ref e onClick para evitar propagação */}
      <div 
        ref={scrollContainerRef}
        className="native-scrollbar h-60 overflow-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        onClick={handleContainerClick}
      >
        <div className="space-y-3 p-4">
          {comments.map(comment => (
            <div 
              key={comment.id} 
              className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md relative"
              onClick={handleContainerClick}
            >
              <p className="text-sm text-gray-700 dark:text-gray-200">{comment.text}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-400">
                  {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm')}
                </p>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Remover comentário"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Delete button clicked, stopped propagation');
                      }}
                    >
                      <X size={14} />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent 
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Dialog content clicked, stopped propagation');
                    }}
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
                        Confirmar exclusão
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                        Tem certeza que deseja excluir este comentário?
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel 
                        className="bg-gray-50 hover:bg-gray-200 text-gray-700 hover:text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-gray-200 dark:hover:text-gray-200 border-gray-200 dark:border-gray-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteComment(comment.id);
                        }}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 hover:border-red-200"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskComments;
