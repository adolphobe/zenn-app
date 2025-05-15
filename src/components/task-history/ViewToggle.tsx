
import React from 'react';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dropdownStyles } from '@/lib/utils';

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
}) => (
  <div className="flex gap-2">
    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className="w-auto">
        <SelectValue placeholder="Ordenar por" />
      </SelectTrigger>
      <SelectContent className="p-1.5">
        <SelectItem value="recent" className={dropdownStyles.item}>Mais recentes</SelectItem>
        <SelectItem value="oldest" className={dropdownStyles.item}>Mais antigas</SelectItem>
        <SelectItem value="highScore" className={dropdownStyles.item}>Maior pontuação</SelectItem>
        <SelectItem value="lowScore" className={dropdownStyles.item}>Menor pontuação</SelectItem>
        <SelectItem value="alphabetical" className={dropdownStyles.item}>Alfabética</SelectItem>
      </SelectContent>
    </Select>
    
    <div className="flex border rounded-md">
      <Toggle 
        pressed={viewMode === 'grid'} 
        onPressedChange={() => setViewMode('grid')}
        size="sm"
        aria-label="View as grid"
      >
        <LayoutGrid size={16} />
      </Toggle>
      <Toggle 
        pressed={viewMode === 'list'} 
        onPressedChange={() => setViewMode('list')}
        size="sm"
        aria-label="View as list"
      >
        <LayoutList size={16} />
      </Toggle>
    </div>
  </div>
);
