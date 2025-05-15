import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Comment } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { X } from 'lucide-react';
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

// Versão modificada do ScrollArea do Radix com scrollbar sempre visível
const AlwaysVisibleScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  const scrollbarRef = useRef<HTMLDivElement>(null);
  
  // Força a visibilidade usando um effect
  useEffect(() => {
    // Função para aplicar estilos diretamente ao DOM
    const forceScrollbarVisibility = () => {
      if (scrollbarRef.current) {
        const scrollbarElement = scrollbarRef.current;
        
        // Aplicar estilos diretamente ao elemento DOM
        scrollbarElement.style.opacity = '1';
        scrollbarElement.style.visibility = 'visible';
        scrollbarElement.style.display = 'flex';
        scrollbarElement.style.transition = 'none';
        
        // Buscar o thumb e aplicar estilos
        const thumbElement = scrollbarElement.querySelector('[data-radix-scroll-area-thumb]');
        if (thumbElement instanceof HTMLElement) {
          thumbElement.style.backgroundColor = 'rgba(156, 163, 175, 0.7)';
          thumbElement.style.opacity = '1';
          thumbElement.style.visibility = 'visible';
        }
        
        // Forçar o estado para "visible"
        scrollbarElement.dataset.state = 'visible';
      }
    };
    
    // Função para observar mudanças no DOM (caso a scrollbar seja re-renderizada)
    const createObserver = () => {
      if (!scrollbarRef.current) return;
      
      const observer = new MutationObserver((mutations) => {
        forceScrollbarVisibility();
      });
      
      observer.observe(scrollbarRef.current, {
        attributes: true,
        attributeFilter: ['data-state', 'style'],
        childList: true,
        subtree: true
      });
      
      return observer;
    };
    
    // Aplicar imediatamente
    forceScrollbarVisibility();
    
    // E também aplicar após um curto delay para garantir
    const immediateTimer = setTimeout(forceScrollbarVisibility, 50);
    
    // Aplicar periodicamente (para caso de mudanças de estado)
    const intervalTimer = setInterval(forceScrollbarVisibility, 200);
    
    // Observar mudanças no DOM
    const observer = createObserver();
    
    return () => {
      clearTimeout(immediateTimer);
      clearInterval(intervalTimer);
      observer?.disconnect();
    };
  }, []);
  
  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
      style={{
        ...props.style,
        // Override any styles that might hide the scrollbar
        overflow: 'hidden',
      }}
      data-force-visible-scrollbar="true"
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      
      <ScrollAreaPrimitive.ScrollAreaScrollbar
        ref={scrollbarRef}
        orientation="vertical"
        className={cn(
          "flex touch-none select-none !opacity-100 !visible",
          "h-full w-3 border-l border-l-transparent p-[1px] right-0"
        )}
        style={{
          opacity: 1,
          visibility: 'visible',
          display: 'flex',
          transition: 'none',
        }}
        data-always-visible="true"
        data-state="visible"
      >
        <ScrollAreaPrimitive.ScrollAreaThumb 
          className="relative flex-1 rounded-full bg-gray-400 dark:bg-gray-600"
          style={{
            backgroundColor: 'rgba(156, 163, 175, 0.7)',
          }}
        />
      </ScrollAreaPrimitive.ScrollAreaScrollbar>
      
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});

AlwaysVisibleScrollArea.displayName = "AlwaysVisibleScrollArea";

interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
}

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId, comments }) => {
  const { deleteComment } = useAppContext();
  
  // Força estilos globais diretamente no documento
  useEffect(() => {
    // Injetamos CSS diretamente no cabeçalho do documento
    const style = document.createElement('style');
    style.innerHTML = `
      /* Forçar scrollbar sempre visível */
      [data-radix-scroll-area-scrollbar],
      [data-radix-scroll-area-scrollbar][data-orientation="vertical"],
      [data-radix-scroll-area-scrollbar][data-state] {
        opacity: 1 !important;
        visibility: visible !important;
        display: flex !important;
        transition: none !important;
      }
      
      [data-radix-scroll-area-thumb] {
        background-color: rgba(156, 163, 175, 0.7) !important;
      }
      
      .dark [data-radix-scroll-area-thumb] {
        background-color: rgba(209, 213, 219, 0.5) !important;
      }
      
      /* Sobrescrever qualquer outro estilo específico do Radix */
      [data-force-visible-scrollbar="true"] [data-radix-scroll-area-scrollbar] {
        opacity: 1 !important;
        visibility: visible !important;
        display: flex !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  if (!comments || comments.length === 0) {
    return null;
  }
  
  const handleDeleteComment = (commentId: string) => {
    if (deleteComment) {
      deleteComment(taskId, commentId);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Comentários</h4>
      
      <AlwaysVisibleScrollArea className="h-60 rounded-md border border-gray-200 dark:border-gray-700">
        <div className="space-y-3 p-4">
          {comments.map(comment => (
            <div 
              key={comment.id} 
              className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md relative"
            >
              <p className="text-sm text-gray-700 dark:text-gray-200">{comment.text}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-400">
                  {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm')}
                </p>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Remover comentário"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </AlwaysVisibleScrollArea>
    </div>
  );
};

export default TaskComments;
