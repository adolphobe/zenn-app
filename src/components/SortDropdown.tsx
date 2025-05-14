
import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { SortDirection } from '../types';

const SortDropdown: React.FC = () => {
  const { state, setSortOptions } = useAppContext();
  const { viewMode, sortOptions } = state;
  
  const currentSortOptions = sortOptions[viewMode];
  const { sortDirection, noDateAtEnd } = currentSortOptions;
  
  const handleSortDirectionChange = (direction: SortDirection) => {
    setSortOptions({ 
      sortDirection: direction,
      noDateAtEnd: currentSortOptions.noDateAtEnd 
    });
  };
  
  const handleNoDateToggle = () => {
    if (viewMode === 'chronological') {
      setSortOptions({ 
        sortDirection,
        noDateAtEnd: !noDateAtEnd 
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowUpDown size={16} />
          <span className="hidden sm:inline">Ordenação</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          {viewMode === 'power' ? 'Ordenar por Score' : 'Ordenar por Data'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {viewMode === 'power' ? (
          <>
            <DropdownMenuItem
              onClick={() => handleSortDirectionChange('desc')}
              className={sortDirection === 'desc' ? 'bg-accent text-accent-foreground' : ''}
            >
              Score: Maior → Menor
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortDirectionChange('asc')}
              className={sortDirection === 'asc' ? 'bg-accent text-accent-foreground' : ''}
            >
              Score: Menor → Maior
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              onClick={() => handleSortDirectionChange('asc')}
              className={sortDirection === 'asc' ? 'bg-accent text-accent-foreground' : ''}
            >
              Data: Próximas primeiro
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortDirectionChange('desc')}
              className={sortDirection === 'desc' ? 'bg-accent text-accent-foreground' : ''}
            >
              Data: Distantes primeiro
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={Boolean(noDateAtEnd)}
              onCheckedChange={handleNoDateToggle}
            >
              Sem data no final
            </DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortDropdown;
