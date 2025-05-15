
import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    className="flex items-center gap-2"
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
  setPillarFilter
}) => (
  <Card className="p-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Período</label>
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os períodos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os períodos</SelectItem>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="week">Esta semana</SelectItem>
            <SelectItem value="month">Este mês</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Pontuação</label>
        <Select value={scoreFilter} onValueChange={setScoreFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Todas pontuações" />
          </SelectTrigger>
          <SelectContent>
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
          <SelectContent>
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
          <SelectContent>
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
