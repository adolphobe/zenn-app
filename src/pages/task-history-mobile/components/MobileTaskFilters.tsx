
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Check } from 'lucide-react';

interface MobileTaskFiltersProps {
  periodFilter: string;
  setPeriodFilter: (value: string) => void;
  scoreFilter: string;
  setScoreFilter: (value: string) => void;
  feedbackFilter: string;
  setFeedbackFilter: (value: string) => void;
  onClose: () => void;
}

const MobileTaskFilters: React.FC<MobileTaskFiltersProps> = ({
  periodFilter,
  setPeriodFilter,
  scoreFilter,
  setScoreFilter,
  feedbackFilter,
  setFeedbackFilter,
  onClose
}) => {
  return (
    <div className="px-1 pt-2">
      <div className="space-y-6">
        {/* Period filter */}
        <div>
          <h3 className="font-medium mb-3">Período</h3>
          <RadioGroup value={periodFilter} onValueChange={setPeriodFilter}>
            <div className="space-y-2">
              <div className="flex items-center">
                <RadioGroupItem value="all" id="period-all" />
                <Label htmlFor="period-all" className="ml-2 cursor-pointer">Todos</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="today" id="period-today" />
                <Label htmlFor="period-today" className="ml-2 cursor-pointer">Hoje</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="yesterday" id="period-yesterday" />
                <Label htmlFor="period-yesterday" className="ml-2 cursor-pointer">Ontem</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="week" id="period-week" />
                <Label htmlFor="period-week" className="ml-2 cursor-pointer">Esta semana</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="month" id="period-month" />
                <Label htmlFor="period-month" className="ml-2 cursor-pointer">Este mês</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        {/* Score filter */}
        <div>
          <h3 className="font-medium mb-3">Pontuação</h3>
          <RadioGroup value={scoreFilter} onValueChange={setScoreFilter}>
            <div className="space-y-2">
              <div className="flex items-center">
                <RadioGroupItem value="all" id="score-all" />
                <Label htmlFor="score-all" className="ml-2 cursor-pointer">Todas</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="high" id="score-high" />
                <Label htmlFor="score-high" className="ml-2 cursor-pointer">Alta (12-15)</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="medium" id="score-medium" />
                <Label htmlFor="score-medium" className="ml-2 cursor-pointer">Média (8-11)</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="low" id="score-low" />
                <Label htmlFor="score-low" className="ml-2 cursor-pointer">Baixa (3-7)</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        {/* Feedback filter */}
        <div>
          <h3 className="font-medium mb-3">Feedback</h3>
          <RadioGroup value={feedbackFilter} onValueChange={setFeedbackFilter}>
            <div className="space-y-2">
              <div className="flex items-center">
                <RadioGroupItem value="all" id="feedback-all" />
                <Label htmlFor="feedback-all" className="ml-2 cursor-pointer">Todos</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="transformed" id="feedback-transformed" />
                <Label htmlFor="feedback-transformed" className="ml-2 cursor-pointer">Foi transformador</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="relief" id="feedback-relief" />
                <Label htmlFor="feedback-relief" className="ml-2 cursor-pointer">Tive alívio</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="obligation" id="feedback-obligation" />
                <Label htmlFor="feedback-obligation" className="ml-2 cursor-pointer">Por obrigação</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      <div className="mt-8 sticky bottom-0 bg-background pt-4 pb-4">
        <Button onClick={onClose} className="w-full">
          Aplicar filtros
        </Button>
      </div>
    </div>
  );
};

export default MobileTaskFilters;
