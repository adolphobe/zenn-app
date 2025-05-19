
import React from 'react';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ViewToggleProps {
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  setViewMode,
  sortBy,
  setSortBy
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-end md:items-center justify-end mb-4">
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Mais recentes</SelectItem>
          <SelectItem value="oldest">Mais antigas</SelectItem>
          <SelectItem value="highScore">Maior pontuação</SelectItem>
          <SelectItem value="lowScore">Menor pontuação</SelectItem>
          <SelectItem value="alphabetical">Alfabética</SelectItem>
        </SelectContent>
      </Select>
      
      <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'list' | 'grid')}>
        <ToggleGroupItem value="grid" aria-label="Ver como grade">
          <LayoutGrid className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="Ver como lista">
          <LayoutList className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
