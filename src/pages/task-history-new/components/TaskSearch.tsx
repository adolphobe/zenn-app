
import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TaskSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export const TaskSearch = ({ 
  searchQuery, 
  setSearchQuery, 
  showFilters, 
  setShowFilters 
}: TaskSearchProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4 w-full">
      <div className="relative flex-grow max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Buscar tarefas concluídas..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center gap-2 ${showFilters ? 'bg-muted' : ''}`}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtros avançados
      </Button>
    </div>
  );
};
