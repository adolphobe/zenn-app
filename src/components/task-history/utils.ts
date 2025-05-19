
import { Task } from '@/types';
import { startOfWeek, startOfMonth, differenceInMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { dateService } from '@/services/dateService';

// Cache global para períodos comuns - calculados apenas uma vez
// Isso melhora significativamente a performance do agrupamento de tarefas
const dateCache = {
  today: dateService.startOfDay(new Date()),
  thisWeekStart: startOfWeek(new Date(), { locale: ptBR }),
  thisMonthStart: startOfMonth(new Date()),
  get yesterday() {
    const yesterday = new Date(this.today);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  }
};

/**
 * Agrupa tarefas por linha do tempo - otimizado para melhor performance
 * Versão refatorada para minimizar recálculos e evitar problemas de datas
 */
export const groupTasksByTimeline = (tasks: Task[], periodFilter: string = 'all') => {
  // Saída antecipada se não houver tarefas, evita processamento
  if (!tasks || tasks.length === 0) {
    return [];
  }
  
  // Se um filtro de período específico estiver ativo, retorna todas as tarefas em um único grupo
  if (periodFilter !== 'all' && periodFilter !== 'custom') {
    return [{
      label: '',  // Rótulo vazio significa sem cabeçalho de divisão de linha do tempo
      tasks: [...tasks]
    }];
  }
  
  // Grupos predefinidos com tipagem forte
  const groups: Record<string, {label: string, tasks: Task[]}> = {
    today: { label: 'Hoje', tasks: [] },
    yesterday: { label: 'Ontem', tasks: [] },
    thisWeek: { label: 'Esta semana', tasks: [] },
    thisMonth: { label: 'Este mês', tasks: [] },
    lastMonth: { label: 'Mês passado', tasks: [] },
    twoMonthsAgo: { label: 'Dois meses atrás', tasks: [] },
    older: { label: 'Anteriores', tasks: [] },
  };
  
  // Cópia defensiva das tarefas
  const allTasks = [...tasks]; 
  
  // Mapeamento de tarefas para grupos - otimização para reduzir chamadas de função
  allTasks.forEach(task => {
    // Pular tarefas sem completedAt
    if (!task.completedAt) {
      groups.older.tasks.push(task);
      return;
    }
    
    try {
      // Parse da data apenas uma vez - reutiliza o resultado
      const completedDate = task.completedAt instanceof Date ? 
        task.completedAt : 
        dateService.parseDate(task.completedAt);
      
      if (!completedDate || isNaN(completedDate.getTime())) {
        groups.older.tasks.push(task);
        return;
      }
      
      // Verifica se é hoje (comparação de data sem hora)
      if (dateService.isToday(completedDate)) {
        groups.today.tasks.push(task);
        return;
      }
      
      // Verifica se é ontem
      if (dateService.isYesterday(completedDate)) {
        groups.yesterday.tasks.push(task);
        return;
      }
      
      // Referências em cache para comparação rápida
      const { today, thisWeekStart, thisMonthStart } = dateCache;
      
      // Verifica se é esta semana (mas não hoje ou ontem)
      if (completedDate >= thisWeekStart && completedDate < today) {
        groups.thisWeek.tasks.push(task);
        return;
      }
      
      // Verifica se é este mês (mas não esta semana)
      if (completedDate >= thisMonthStart && completedDate < thisWeekStart) {
        groups.thisMonth.tasks.push(task);
        return;
      }
      
      // Verifica meses anteriores com memoização para evitar recálculos
      const monthsDifference = differenceInMonths(today, completedDate);
      
      if (monthsDifference === 1) {
        groups.lastMonth.tasks.push(task);
      } else if (monthsDifference === 2) {
        groups.twoMonthsAgo.tasks.push(task);
      } else {
        groups.older.tasks.push(task);
      }
    } catch (error) {
      // Fallback para "older" se o processamento de data falhar
      groups.older.tasks.push(task);
    }
  });
  
  // Filtra grupos vazios e retorna
  return Object.values(groups).filter(group => group.tasks.length > 0);
};

/**
 * Limpa o cache de datas para forçar recálculos - útil para testes
 * ou quando a data atual muda significativamente
 */
export const clearTimelineCache = () => {
  // Redefine as datas em cache
  Object.defineProperties(dateCache, {
    today: {
      value: dateService.startOfDay(new Date()),
      writable: true
    },
    thisWeekStart: {
      value: startOfWeek(new Date(), { locale: ptBR }),
      writable: true
    },
    thisMonthStart: {
      value: startOfMonth(new Date()),
      writable: true
    }
  });
};
