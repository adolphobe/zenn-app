
import React from 'react';
import { Task } from '@/types';

interface TaskPillarDetailsProps {
  task: Task;
}

const TaskPillarDetails: React.FC<TaskPillarDetailsProps> = ({ task }) => {
  return (
    <div className="space-y-0 text-sm">
<div className="rounded-md bg-white px-[10px] py-[3px] text-blue-600 border border-blue-200 text-[13px]">
        <span className="font-medium">Consequência de Ignorar:</span> {task.consequenceScore} | {task.consequenceScore === 5 ? "Vou me sentir bem mal comigo mesmo por não ter feito." : 
                  task.consequenceScore === 4 ? "Se eu ignorar, vou ficar incomodado." :
                  task.consequenceScore === 3 ? "Vai dar aquela sensação de \"tô enrolando\", mas ainda dá pra tolerar." :
                  task.consequenceScore === 2 ? "Sei que devia fazer, mas não vou me cobrar." :
                  "Ignorar isso não muda nada na minha vida."}
      </div>
      
<div className="rounded-md bg-white px-[10px] !pt-[6px] pb-[3px] text-orange-600 border border-orange-200 text-[13px] mt-[6px]">
        <span className="font-medium">Orgulho pós-execução:</span> {task.prideScore} | {task.prideScore === 5 ? "Total senso de potência. Vou me sentir acima da média." : 
            task.prideScore === 4 ? "Vou me olhar com respeito." :
            task.prideScore === 3 ? "Boa sensação de ter mantido o ritmo." :
            task.prideScore === 2 ? "Leve alívio por ter feito." :
            "Nenhum orgulho. Só rotina ou tarefa obrigatória."}
      </div>
      
<div className="rounded-md bg-white px-[10px] !pt-[6px] pb-[3px] text-green-600 border border-green-200 text-[13px] !mt-[6px]">
        <span className="font-medium">Força de construção pessoal:</span> {task.constructionScore} | {task.constructionScore === 5 ? "Essa tarefa solidifica quem eu quero me tornar." : 
                task.constructionScore === 4 ? "Vai me posicionar num degrau acima da versão atual." :
                task.constructionScore === 3 ? "Me move um pouco, mas não me desafia." :
                task.constructionScore === 2 ? "Útil, mas não muda nada em mim." :
                "Só me ocupa."}
      </div>
    </div>
  );
};

export default TaskPillarDetails;
