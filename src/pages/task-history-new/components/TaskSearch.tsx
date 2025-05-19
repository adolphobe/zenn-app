
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TaskSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const TaskSearch = ({ searchQuery, setSearchQuery }: TaskSearchProps) => {
  return (
    <div className="relative flex-grow max-w-md mb-4">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        placeholder="Buscar tarefas concluídas..."
        className="pl-9"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};
