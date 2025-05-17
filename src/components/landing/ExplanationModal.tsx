
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModalData {
  title: string;
  content: JSX.Element;
}

interface ModalContentType {
  pilares: ModalData;
  clareza: ModalData;
  estrategia: ModalData;
}

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModalData: ModalData | null;
}

export const modalDataContent: ModalContentType = {
  pilares: {
    title: "🌟 Análise por Pilares",
    content: (
      <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <p className="font-semibold">No Zenn, você não adiciona uma tarefa apenas com um título e uma data. Você adiciona consciência.</p>
        <p>Cada tarefa é avaliada com base em três pilares:</p>
        <div className="pl-4 space-y-3">
          <div>
            <h4 className="font-semibold text-blue-600 dark:text-blue-400">Importância real (Risco de não fazer)</h4>
            <p className="italic text-sm">"Se eu ignorar isso, vai ter consequência?"</p>
            <p>É o que te faz priorizar o que realmente não pode ser adiado.</p>
          </div>
          <div>
            <h4 className="font-semibold text-blue-600 dark:text-blue-400">Orgulho pós-execução</h4>
            <p className="italic text-sm">"Quando eu terminar, vou me sentir mais alinhado com quem quero ser?"</p>
            <p>É o pilar que mede sua conexão com o que você faz. Não é só cumprir — é se respeitar por ter feito.</p>
          </div>
          <div>
            <h4 className="font-semibold text-blue-600 dark:text-blue-400">Crescimento pessoal</h4>
            <p className="italic text-sm">"Fazer isso me torna alguém melhor?"</p>
            <p>É o que separa tarefas operacionais de tarefas que constroem a sua evolução real.</p>
          </div>
        </div>
        <p className="font-semibold pt-2">Esses três pilares não são para julgar produtividade. Eles te ajudam a escolher com consciência o que realmente merece seu tempo.</p>
      </div>
    )
  },
  clareza: {
    title: "🎯 Clareza nas Escolhas",
    content: (
      <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <p className="font-semibold">Todo mundo tem uma lista de tarefas. O Zenn não é mais uma. Ele é o primeiro sistema que organiza a intenção por trás de cada escolha.</p>
        <p>Não basta fazer. Você precisa sentir que valeu a pena.</p>
        <p>É por isso que, no momento em que você cria uma tarefa no Zenn, você é convidado a refletir:</p>
        <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400 font-medium pl-2">
          <li>Isso é importante mesmo?</li>
          <li>Isso vai me deixar orgulhoso?</li>
          <li>Isso me faz crescer?</li>
        </ul>
        <p>Você começa a abandonar o excesso, a rasura, o "checklist automático". No lugar disso, você executa com peso emocional e propósito estratégico.</p>
        <p className="font-semibold pt-2">E isso te leva longe!</p>
      </div>
    )
  },
  estrategia: {
    title: "📊 Análise Estratégica",
    content: (
      <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <p className="font-semibold">Você não precisa esperar uma crise para perceber que está vivendo no automático. O Zenn analisa, em tempo real, o que suas tarefas estão dizendo sobre você.</p>
        <p>A cada tarefa concluída, o sistema registra e organiza:</p>
        <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400 font-medium pl-2">
          <li>Qual pilar você mais fortaleceu?</li>
          <li>Quais tarefas te transformaram de verdade?</li>
          <li>O que você concluiu por obrigação?</li>
        </ul>
        <p>Esses dados geram um relatório estratégico semanal com frases claras e insights práticos. Você começa a enxergar padrões de comportamento — e pode ajustar seu foco antes de cair em ciclos improdutivos.</p>
        <p className="font-semibold pt-2">Não é só um app de tarefas. É um sistema de leitura da sua própria execução.</p>
      </div>
    )
  }
};

const ExplanationModal: React.FC<ExplanationModalProps> = ({ 
  isOpen, 
  onClose, 
  currentModalData 
}) => {
  if (!isOpen || !currentModalData) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[85vh] shadow-2xl p-6 md:p-8 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {currentModalData.title}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
            <X size={20} />
          </Button>
        </div>

        <div className="overflow-y-auto flex-grow pr-2 modal-content-area">
          {currentModalData.content}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-right">
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 px-6 py-2">
            Entendido
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExplanationModal;
