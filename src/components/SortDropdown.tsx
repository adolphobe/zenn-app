
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
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { SortDirection } from '../types';
import { dropdownStyles } from '@/lib/utils';

const SortDropdown: React.FC = () => {
  const { state, setSortOptions } = useAppContext();
  const { viewMode, sortOptions } = state;
  
  const currentSortOptions = sortOptions[viewMode];
  const sortDirection = currentSortOptions.sortDirection;
  
  const handleSortDirectionChange = (direction: SortDirection) => {
    setSortOptions({
      [viewMode]: {
        sortDirection: direction
      }
    });
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 px-4 py-5 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
        >
          <ArrowUpDown size={16} />
          <span className="hidden sm:inline">Ordenação</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className={dropdownStyles.label}>
          {viewMode === 'power' ? 'Ordenar por Score' : 'Ordenar por Data'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className={dropdownStyles.separator} />
        
        {viewMode === 'power' ? (
          <>
            <DropdownMenuItem
              onClick={() => handleSortDirectionChange('desc')}
              className={`${dropdownStyles.item} ${sortDirection === 'desc' ? dropdownStyles.itemSelected : ''} cursor-pointer`}
            >
              Score: Maior → Menor
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortDirectionChange('asc')}
              className={`${dropdownStyles.item} ${sortDirection === 'asc' ? dropdownStyles.itemSelected : ''} cursor-pointer`}
            >
              Score: Menor → Maior
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              onClick={() => handleSortDirectionChange('desc')}
              className={`${dropdownStyles.item} ${sortDirection === 'desc' ? dropdownStyles.itemSelected : ''} cursor-pointer`}
            >
              Datas mais próximas primeiro
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortDirectionChange('asc')}
              className={`${dropdownStyles.item} ${sortDirection === 'asc' ? dropdownStyles.itemSelected : ''} cursor-pointer`}
            >
              Datas mais distantes primeiro
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortDropdown;
