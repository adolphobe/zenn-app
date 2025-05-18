
import React, { useEffect } from 'react';

interface PillarTooltipProps {
  active?: boolean;
  payload?: any[];
}

const PillarTooltip: React.FC<PillarTooltipProps> = ({ active, payload }) => {
  // Adicionar log para rastrear valores recebidos
  useEffect(() => {
    if (active && payload && payload.length > 0) {
      console.log("PillarTooltip: Payload recebido:", payload[0]?.payload);
    }
  }, [active, payload]);

  if (!active || !payload || !payload.length) {
    return null;
  }
  
  // Verificar se payload[0] existe antes de acessar payload
  if (!payload[0]) {
    console.warn("PillarTooltip: payload[0] é undefined");
    return null;
  }
  
  const data = payload[0].payload;
  
  // Check if the necessary data exists before accessing it
  if (!data || !data.id || typeof data.value !== 'number') {
    console.warn("PillarTooltip: Dados inválidos no payload:", data);
    return null;
  }
  
  const { nivel, mensagem } = getPillarTooltip(data.id, data.value);
  
  return (
    <div className="bg-white p-2 border rounded-md shadow-md text-sm">
      <p className="font-bold">{data.name || data.id}</p>
      <p className="font-semibold text-blue-600">{nivel}</p>
      <p className="text-gray-700">{mensagem}</p>
      <p className="font-mono mt-1">Nota: {data.value.toFixed(1)}</p>
    </div>
  );
};

// Helper function to generate tooltip text based on pillar and score
const getPillarTooltip = (pilarId: string, score: number) => {
  let nivel = "";
  let mensagem = "";

  if (score >= 4.2) nivel = "Muito forte";
  else if (score >= 3.6) nivel = "Acima da média";
  else if (score >= 3.0) nivel = "Moderado";
  else if (score >= 2.5) nivel = "Fraco";
  else nivel = "Muito fraco";

  switch (pilarId) {
    case "consequence":
      if (score >= 4.2) mensagem = "Você concluiu tarefas que, pra você, eram realmente importantes";
      else if (score >= 3.6) mensagem = "Você resolveu coisas relevantes, mas não urgentes.";
      else if (score >= 3.0) mensagem = "Você fez tarefas com alguma utilidade, mas sem grande peso.";
      else mensagem = "Você concluiu tarefas que tinham pouca importância pra você.";
      break;

    case "pride":
      if (score >= 4.2) mensagem = "Você buscou sentir orgulho do que entregou.";
      else if (score >= 3.6) mensagem = "Você fez tarefas que, em parte, te representam.";
      else if (score >= 3.0) mensagem = "Você entregou o que precisava, mas sem orgulho real.";
      else mensagem = "Você concluiu tarefas que não te deixaram satisfeito.";
      break;

    case "construction":
      if (score >= 4.2) mensagem = "Você escolheu crescer de verdade com o que fez.";
      else if (score >= 3.6) mensagem = "Você buscou evoluir, mas sem se desafiar tanto.";
      else if (score >= 3.0) mensagem = "Você se manteve ativo, mas não saiu do lugar.";
      else mensagem = "Você se ocupou, mas não cresceu.";
      break;
      
    default:
      mensagem = "Análise não disponível para este pilar.";
  }

  return { nivel, mensagem };
};

export default PillarTooltip;
