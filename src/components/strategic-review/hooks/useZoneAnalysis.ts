import { useMemo } from 'react';
import { Task } from '@/types';

// Define types for the return value
interface ZoneData {
  name: string;
  value: number;
  color: string;
}

interface TaskStats {
  avgTotal: number;
  criticalCount: number;
  criticalPct: number;
}

interface ZoneAnalysisResult {
  zoneData: ZoneData[];
  taskStats: TaskStats | null;
  colors: {
    critical: string;
    important: string;
    moderate: string;
    hidden: string;
  };
}

export const useZoneAnalysis = (tasks: Task[]): ZoneAnalysisResult => {
  const colors = {
    critical: '#ef5350',    // Vermelho - tarefas de alto score
    important: '#ffb74d',   // Laranja - tarefas de médio-alto score
    moderate: '#64b5f6',    // Azul - tarefas de médio score
    hidden: '#bdbdbd'       // Cinza - tarefas escondidas
  };
  
  return useMemo(() => {
    // Validação básica
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      console.log("useZoneAnalysis: Nenhuma tarefa para análise");
      return { 
        zoneData: [], 
        taskStats: null,
        colors
      };
    }

    // Log de debug
    console.log(`useZoneAnalysis: Analisando ${tasks.length} tarefas concluídas`);

    // Contagem inicial para verificar se há dados válidos
    let validScoreTasks = 0;
    tasks.forEach(task => {
      if (typeof task.totalScore === 'number' || 
          (typeof task.consequenceScore === 'number' && 
           typeof task.prideScore === 'number' && 
           typeof task.constructionScore === 'number')) {
        validScoreTasks++;
      }
    });

    console.log(`useZoneAnalysis: ${validScoreTasks} tarefas com scores válidos`);
    
    // Classificar tarefas por zonas baseadas no score total
    const criticalZone = tasks.filter(task => task.totalScore >= 12);
    const importantZone = tasks.filter(task => task.totalScore >= 8 && task.totalScore < 12);
    const moderateZone = tasks.filter(task => task.totalScore < 8);
    const hiddenTasks = tasks.filter(task => task.hidden);
    
    // Calcular estatísticas
    const totalScore = tasks.reduce((sum, task) => {
      return sum + (task.totalScore || 0);
    }, 0);

    const avgTotal = tasks.length > 0 ? totalScore / tasks.length : 0;
    const criticalCount = criticalZone.length;
    const criticalPct = tasks.length > 0 ? (criticalCount / tasks.length) * 100 : 0;
    
    console.log(`useZoneAnalysis: Pontuação média: ${avgTotal.toFixed(1)}`);
    console.log(`useZoneAnalysis: Tarefas críticas: ${criticalCount} (${criticalPct.toFixed(1)}%)`);

    // Criar dados para o gráfico de barras
    const zoneData: ZoneData[] = [
      {
        name: "Zona Crítica",
        value: criticalZone.length,
        color: colors.critical
      },
      {
        name: "Zona Importante",
        value: importantZone.length,
        color: colors.important
      },
      {
        name: "Zona Moderada",
        value: moderateZone.length,
        color: colors.moderate
      }
    ];

    // Adicionar tarefas escondidas se houver
    if (hiddenTasks.length > 0) {
      zoneData.push({
        name: "Tarefas Ocultas",
        value: hiddenTasks.length,
        color: colors.hidden
      });
    }
    
    // Filtrar zonas vazias para o gráfico
    const filteredZoneData = zoneData.filter(zone => zone.value > 0);
    console.log("useZoneAnalysis: Dados do gráfico gerados:", filteredZoneData);

    return {
      zoneData: filteredZoneData,
      taskStats: {
        avgTotal,
        criticalCount,
        criticalPct
      },
      colors
    };
  }, [tasks, colors]);
};
