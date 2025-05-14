
import { useMemo } from 'react';
import { Task } from '@/types';

// Colors for the charts
const COLORS = {
  zone: {
    critical: '#ffcdd2',
    important: '#ffe0b2',
    moderate: '#bbdefb',
    hidden: '#e0e0e0'
  }
};

export const useZoneAnalysis = (tasks: Task[]) => {
  // Calculate zone distributions
  const zoneData = useMemo(() => {
    const zones = {
      critical: 0,
      important: 0,
      moderate: 0,
      hidden: 0
    };
    
    tasks.forEach(task => {
      if (task.totalScore >= 14) zones.critical++;
      else if (task.totalScore >= 11) zones.important++;
      else if (task.totalScore >= 8) zones.moderate++;
      else zones.hidden++;
    });
    
    return [
      { name: 'Zona de Ação Imediata', value: zones.critical, color: COLORS.zone.critical },
      { name: 'Zona de Mobilização', value: zones.important, color: COLORS.zone.important },
      { name: 'Zona Moderada', value: zones.moderate, color: COLORS.zone.moderate },
      { name: 'Zona Oculta', value: zones.hidden, color: COLORS.zone.hidden }
    ];
  }, [tasks]);

  // Calculate task statistics
  const taskStats = useMemo(() => {
    if (tasks.length === 0) return { avgTotal: 0, highConsequence: 0, highPride: 0 };
    
    const avgTotal = tasks.reduce((sum, task) => sum + task.totalScore, 0) / tasks.length;
    const highConsequence = tasks.filter(task => task.consequenceScore >= 4).length;
    const highPride = tasks.filter(task => task.prideScore === 5).length;
    
    return { avgTotal, highConsequence, highPride };
  }, [tasks]);

  return {
    zoneData,
    taskStats,
    colors: COLORS.zone
  };
};
