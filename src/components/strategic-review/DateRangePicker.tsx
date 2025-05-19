
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CalendarRange } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface DateRangePickerProps {
  customStartDate: Date | undefined;
  customEndDate: Date | undefined;
  setCustomStartDate: (date: Date | undefined) => void;
  setCustomEndDate: (date: Date | undefined) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  customStartDate,
  customEndDate,
  setCustomStartDate,
  setCustomEndDate
}) => {
  const { addToast } = useToast(); // Correct usage of useToast
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Data inicial</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[200px] justify-start text-left font-normal",
                !customStartDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {customStartDate ? format(customStartDate, 'dd/MM/yyyy') : <span>Selecionar data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={customStartDate}
              onSelect={setCustomStartDate}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div>
        <label className="text-sm font-medium mb-1 block">Data final</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[200px] justify-start text-left font-normal",
                !customEndDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {customEndDate ? format(customEndDate, 'dd/MM/yyyy') : <span>Selecionar data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={customEndDate}
              onSelect={setCustomEndDate}
              initialFocus
              className="p-3 pointer-events-auto"
              disabled={(date) => 
                customStartDate ? date < customStartDate : false
              }
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex items-end">
        <Button 
          className="mb-0.5"
          variant="secondary" 
          onClick={() => {
            if (!customStartDate || !customEndDate) {
              addToast({
                title: "Datas inválidas",
                description: "Por favor, selecione ambas as datas.",
                variant: "destructive"
              });
              return;
            }
            
            if (customEndDate < customStartDate) {
              addToast({
                title: "Intervalo inválido",
                description: "A data final deve ser posterior à data inicial.",
                variant: "destructive"
              });
              return;
            }
            
            addToast({
              title: "Filtro aplicado",
              description: `Mostrando dados de ${format(customStartDate, 'dd/MM/yyyy')} a ${format(customEndDate, 'dd/MM/yyyy')}`
            });
          }}
        >
          <CalendarRange className="h-4 w-4 mr-2" />
          Aplicar intervalo
        </Button>
      </div>
    </div>
  );
};

export default DateRangePicker;
