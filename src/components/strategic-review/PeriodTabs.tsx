
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PeriodType } from './types';

interface PeriodTabsProps {
  period: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

const PeriodTabs: React.FC<PeriodTabsProps> = ({ period, onPeriodChange }) => {
  return (
    <TabsList className="flex flex-wrap">
      <TabsTrigger value="today">Hoje</TabsTrigger>
      <TabsTrigger value="yesterday">Ontem</TabsTrigger>
      <TabsTrigger value="week">Esta Semana</TabsTrigger>
      <TabsTrigger value="month">Este Mês</TabsTrigger>
      <TabsTrigger value="custom">Últimos 30 dias</TabsTrigger>
      <TabsTrigger value="custom-range">Personalizado</TabsTrigger>
    </TabsList>
  );
};

export default PeriodTabs;
