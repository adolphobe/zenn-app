
import React, { useState } from 'react';
import { Search, SlidersHorizontal, Calendar as CalendarIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  periodFilter: string;
  setPeriodFilter: (period: string) => void;
  scoreFilter: string;
  setScoreFilter: (score: string) => void;
  feedbackFilter: string;
  setFeedbackFilter: (feedback: string) => void;
  pillarFilter: string;
  setPillarFilter: (pillar: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
}

export const TaskSearchBar: React.FC<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean; 
  setShowFilters: (show: boolean) => void;
}> = ({ searchQuery, setSearchQuery, showFilters, setShowFilters }) => (
  <div className="relative flex-grow md:max-w-md">
    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
    <Input
      placeholder="Buscar tarefas concluídas..."
      className="pl-9"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
);

export const TaskFiltersToggle: React.FC<{
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}> = ({ showFilters, setShowFilters }) => (
  <Button 
    variant="outline" 
    size="sm" 
    onClick={() => setShowFilters(!showFilters)}
    className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
  >
    <SlidersHorizontal size={16} />
    Filtros
  </Button>
);

export const AdvancedFilters: React.FC<Omit<TaskFiltersProps, 'searchQuery' | 'setSearchQuery' | 'showFilters' | 'setShowFilters'>> = ({
  periodFilter,
  setPeriodFilter,
  scoreFilter,
  setScoreFilter,
  feedbackFilter,
  setFeedbackFilter,
  pillarFilter,
  setPillarFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}) => {
  const [isCustomPeriod, setIsCustomPeriod] = useState(periodFilter === 'custom');

  // Update the state when period filter changes
  React.useEffect(() => {
    setIsCustomPeriod(periodFilter === 'custom');
  }, [periodFilter]);

  // Handle period filter change with custom handling
  const handlePeriodChange = (value: string) => {
    setPeriodFilter(value);
    setIsCustomPeriod(value === 'custom');
  };

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Período</label>
          <Select value={periodFilter} onValueChange={handlePeriodChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os períodos" />
            </SelectTrigger>
            <SelectContent className="bg-white p-1.5">
              <SelectItem value="all">Todos os períodos</SelectItem>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mês</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          
          {isCustomPeriod && (
            <div className="mt-2 flex flex-col gap-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">Data inicial</p>
                <DatePicker 
                  date={startDate} 
                  setDate={setStartDate}
                  placeholder="Selecione a data inicial"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Data final</p>
                <DatePicker 
                  date={endDate} 
                  setDate={setEndDate}
                  placeholder="Selecione a data final"
                />
              </div>
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Pontuação</label>
          <Select value={scoreFilter} onValueChange={setScoreFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todas pontuações" />
            </SelectTrigger>
            <SelectContent className="bg-white p-1.5">
              <SelectItem value="all">Todas pontuações</SelectItem>
              <SelectItem value="high">Alta (≥ 12)</SelectItem>
              <SelectItem value="medium">Média (8-11)</SelectItem>
              <SelectItem value="low">Baixa (&lt; 8)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Feedback</label>
          <Select value={feedbackFilter} onValueChange={setFeedbackFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todos feedbacks" />
            </SelectTrigger>
            <SelectContent className="bg-white p-1.5">
              <SelectItem value="all">Todos feedbacks</SelectItem>
              <SelectItem value="transformed">Foi transformador</SelectItem>
              <SelectItem value="relief">Foi um alívio</SelectItem>
              <SelectItem value="obligation">Foi obrigação</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Pilar dominante</label>
          <Select value={pillarFilter} onValueChange={setPillarFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todos pilares" />
            </SelectTrigger>
            <SelectContent className="bg-white p-1.5">
              <SelectItem value="all">Todos pilares</SelectItem>
              <SelectItem value="consequence">Consequência</SelectItem>
              <SelectItem value="pride">Orgulho</SelectItem>
              <SelectItem value="construction">Construção</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};

// Date picker component
const DatePicker = ({ 
  date, 
  setDate, 
  placeholder 
}: { 
  date: Date | undefined; 
  setDate: (date: Date | undefined) => void;
  placeholder: string;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};
