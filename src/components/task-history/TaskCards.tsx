
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Task } from '@/types'; 
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RefreshCw } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useExpandedTask } from '@/context/hooks';

interface TaskGroup {
  label: string;
  tasks: Task[];
}

// Task card component
export const CompletedTaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const { restoreTask } = useAppContext();
  const { expandedTaskId, toggleTaskExpanded, isTaskExpanded } = useExpandedTask();
  const expanded = isTaskExpanded(task.id);

  // Determine dominant pillar based on scores
  const getDominantPillar = () => {
    const scores = [
      { name: 'consequência', value: task.consequenceScore },
      { name: 'orgulho', value: task.prideScore },
      { name: 'construção', value: task.constructionScore },
    ];
    const max = scores.reduce((prev, current) => 
      (prev.value > current.value) ? prev : current
    );
    return max.name;
  };

  const dominantPillar = getDominantPillar();
  const pillarColors = {
    consequência: 'bg-orange-100 text-orange-800 border-orange-200',
    orgulho: 'bg-purple-100 text-purple-800 border-purple-200',
    construção: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const feedbackColors = {
    transformed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    relief: 'bg-blue-100 text-blue-800 border-blue-200',
    obligation: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  const feedbackLabels = {
    transformed: 'Foi transformador terminar',
    relief: 'Tive alívio ao finalizar',
    obligation: 'Terminei por obrigação'
  };

  // Make sure we have a completedAt value before trying to format it
  const completedDate = task.completedAt ? format(new Date(task.completedAt), 'dd/MM/yyyy') : '-';

  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (restoreTask) {
      restoreTask(task.id);
    }
  };

  return (
    <Card 
      className="mb-3 border-l-4 border-l-gray-300" 
      onClick={() => toggleTaskExpanded(task.id)}
    >
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 opacity-70">{task.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Concluída em {completedDate}
            </p>
          </div>
          <div className="flex gap-2">
            {task.feedback && (
              <Badge className={feedbackColors[task.feedback] || 'bg-gray-100 text-gray-800'} variant="outline">
                {feedbackLabels[task.feedback] || '-'}
              </Badge>
            )}
            <Badge
              className={`${pillarColors[dominantPillar] || 'bg-gray-100 text-gray-800'} hidden`}
              variant="outline"
            >
              {dominantPillar}
            </Badge>
            <Badge variant="outline" className="bg-gray-100 text-gray-800">
              {task.totalScore}/15
            </Badge>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 animate-fade-in">
            <div className="space-y-3 text-sm">
              <div className="rounded-md bg-white px-3 py-2 text-blue-600 border border-blue-200">
                <span className="font-medium">Consequência de Ignorar:</span> {task.consequenceScore} – {task.consequenceScore === 5 ? "Vou me sentir bem mal comigo mesmo por não ter feito." : 
                          task.consequenceScore === 4 ? "Se eu ignorar, vou ficar incomodado." :
                          task.consequenceScore === 3 ? "Vai dar aquela sensação de \"tô enrolando\", mas ainda dá pra tolerar." :
                          task.consequenceScore === 2 ? "Sei que devia fazer, mas não vou me cobrar." :
                          "Ignorar isso não muda nada na minha vida."}
              </div>
              
              <div className="rounded-md bg-white px-3 py-2 text-orange-600 border border-orange-200">
                <span className="font-medium">Orgulho pós-execução:</span> {task.prideScore} – {task.prideScore === 5 ? "Total senso de potência. Vou me sentir acima da média." : 
                    task.prideScore === 4 ? "Vou me olhar com respeito." :
                    task.prideScore === 3 ? "Boa sensação de ter mantido o ritmo." :
                    task.prideScore === 2 ? "Leve alívio por ter feito." :
                    "Nenhum orgulho. Só rotina ou tarefa obrigatória."}
              </div>
              
              <div className="rounded-md bg-white px-3 py-2 text-green-600 border border-green-200">
                <span className="font-medium">Força de construção pessoal:</span> {task.constructionScore} – {task.constructionScore === 5 ? "Essa tarefa solidifica quem eu quero me tornar." : 
                        task.constructionScore === 4 ? "Vai me posicionar num degrau acima da versão atual." :
                        task.constructionScore === 3 ? "Me move um pouco, mas não me desafia." :
                        task.constructionScore === 2 ? "Útil, mas não muda nada em mim." :
                        "Só me ocupa."}
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleRestore}
              >
                <RefreshCw size={16} />
                Restaurar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const TaskGroupGrid: React.FC<{ groups: TaskGroup[] }> = ({ groups }) => (
  <div className="space-y-6">
    {groups.map((group, index) => (
      <div key={index}>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-medium">{group.label}</h3>
          <Badge variant="outline">{group.tasks.length}</Badge>
          
        </div>
        <div className="grid grid-cols-1">
          {group.tasks.map(task => (
            <CompletedTaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    ))}
  </div>
);
