
import { Task } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useTaskDataContext } from '@/context/TaskDataProvider';

export const showToggleHiddenToast = (task: Task) => {
  const { toggleTaskHidden } = useTaskDataContext();
  
  // Se estamos prestes a ocultar uma tarefa (atualmente visível)
  if (!task.hidden) {
    // Notificar o usuário que a tarefa irá desaparecer
    toast({
      title: "A tarefa será ocultada",
      description: "Esta tarefa desaparecerá da lista. Para vê-la novamente, ative a opção 'Mostrar tarefas ocultas' no menu lateral.",
    });
    
    // Aplicar uma pequena pausa para permitir que o usuário veja o toast antes da animação
    setTimeout(() => {
      toggleTaskHidden(task.id);
    }, 300);
    return;
  }
  
  // Em todos os outros casos, alternar imediatamente
  toggleTaskHidden(task.id);
};
