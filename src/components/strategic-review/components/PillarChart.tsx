
import React from 'react';
import { ChartContainer } from '@/components/ui/chart';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LabelList, Cell, Tooltip } from 'recharts';
import PillarTooltip from './PillarTooltip';

interface PillarChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
    id: string;
  }>;
  onPillarHover: (id: string) => void;
  height?: string | number;
}

const PillarChart: React.FC<PillarChartProps> = ({ 
  data, 
  onPillarHover,
  height = "100%"
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Nenhuma tarefa concluída no período selecionado</p>
      </div>
    );
  }

  return (
    <ChartContainer 
      className="h-full w-full"
      config={{
        consequence: { color: '#3B82F6' }, // Azul
        pride: { color: '#F97316' },       // Laranja
        construction: { color: '#10B981' }, // Verde
      }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <BarChart 
          data={data} 
          barGap={12} 
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis 
            domain={[2.5, 5.0]} 
            tickCount={6} 
            hide={true} 
          />
          <Tooltip 
            content={<PillarTooltip />}
            cursor={{fill: 'rgba(0, 0, 0, 0.05)'}}
          />
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={80}
            fillOpacity={0.9}
            animationDuration={1000}
            animationBegin={200}
            animationEasing="ease-out"
            onMouseEnter={(data) => {
              onPillarHover(data.id);
            }}
          >
            <LabelList 
              dataKey="value" 
              position="top" 
              fill="#888888"
              formatter={(value: number) => value.toFixed(1)}
              style={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PillarChart;
