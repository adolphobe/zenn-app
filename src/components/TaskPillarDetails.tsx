
import React from 'react';
import { Task } from '@/types';

interface TaskPillarDetailsProps {
  task: Task;
}

const TaskPillarDetails: React.FC<TaskPillarDetailsProps> = ({ task }) => {
  return (
    <div className="space-y-0 text-sm">
<div className="rounded-md bg-white px-[10px] pt-[3px] pb-[3px] text-blue-600 border border-blue-200 text-[13px] !mt-[15px]">
        <span className="font-medium">Risco:</span> {task.consequenceScore} | {task.consequenceScore === 5 ? "Não fazer isso me deixará muito mal" : 
                  task.consequenceScore === 4 ? "Deixar isso de lado vai me atrapalhar" :
                  task.consequenceScore === 3 ? "Vai gerar um leve incômodo se não fizer" :
                  task.consequenceScore === 2 ? "Ignorar não pesa agora, mas tem sua importância" :
                  "Não tem problema algum ignorar"}
      </div>
      
<div className="rounded-md bg-white px-[10px] pt-[3px] pb-[3px] text-orange-600 border border-orange-200 text-[13px] !mt-[6px]">
        <span className="font-medium">Orgulho:</span> {task.prideScore} | {task.prideScore === 5 ? "Vou ficar muito orgulhoso de mim mesmo!" : 
            task.prideScore === 4 ? "Vou sentir que cumpri algo importante pra mim" :
            task.prideScore === 3 ? "Vou sentir que fiz algo que valeu a pena" :
            task.prideScore === 2 ? "Vai evitar incômodo, mas não trará satisfação" :
            "Isso não tem valor nenhum pra mim"}
      </div>
      
<div className="rounded-md bg-white px-[10px] !pt-[3px] pb-[3px] text-green-600 border border-green-200 text-[13px] !mt-[6px]">
        <span className="font-medium">Crescimento pessoal:</span> {task.constructionScore} | {task.constructionScore === 5 ? "Cada vez que faço algo assim, eu fico mais inabalável" : 
                task.constructionScore === 4 ? "Me exige acima do meu normal. Me força a crescer enquanto faço" :
                task.constructionScore === 3 ? "Começa a me puxar pra cima, mesmo que só um pouco" :
                task.constructionScore === 2 ? "Pode ser útil, mas não muda nada em quem eu sou" :
                "Isso não me move nem 1%"}
      </div>
    </div>
  );
};

export default TaskPillarDetails;
