
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PeriodType } from './types';

interface PeriodTabsProps {
  period: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

const PeriodTabs: React.FC<PeriodTabsProps> = ({ period, onPeriodChange }) => {
  return (
    <Tabs value={period} onValueChange={(value) => onPeriodChange(value as PeriodType)}>
      <TabsList className="flex flex-wrap mb-2">
        <TabsTrigger value="today">Hoje</TabsTrigger>
        <TabsTrigger value="yesterday">Ontem</TabsTrigger>
        <TabsTrigger value="week">Esta Semana</TabsTrigger>
        <TabsTrigger value="month">Este Mês</TabsTrigger>
        <TabsTrigger value="custom">Últimos 30 dias</TabsTrigger>
        <TabsTrigger value="custom-range">Personalizado</TabsTrigger>
        <TabsTrigger value="all-time">Todo o Tempo</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default PeriodTabs;
