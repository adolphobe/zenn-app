
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SortDirection } from '@/types';
import { dropdownStyles } from '@/lib/utils';

const MobileSortDropdown: React.FC = () => {
  const { state, setSortOptions } = useAppContext();
  const { viewMode, sortOptions } = state;
  
  const currentSortOptions = sortOptions[viewMode];
  const sortDirection = currentSortOptions.sortDirection;
  
  const handleSortDirectionChange = (direction: SortDirection) => {
    setSortOptions({
      sortDirection: direction
    });
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 px-3 py-1.5"
        >
          {sortDirection === 'desc' ? (
            <ArrowDown size={16} className="text-primary" />
          ) : (
            <ArrowUp size={16} className="text-primary" />
          )}
          <span className="text-xs">Ordenar</span>
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

export default MobileSortDropdown;
