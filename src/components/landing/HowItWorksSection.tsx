
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  return (
    <section className="relative z-10 overflow-hidden bg-gradient-to-b from-white via-blue-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-sm font-medium mb-4">Fluxo Simples</span>
            <h2 className="text-4xl md:text-5xl font-semibold mb-8 text-gray-900 dark:text-white">
              Como o <span className="text-blue-600 dark:text-blue-400">Zenn</span> funciona
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-16 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-200 dark:from-blue-700 dark:via-blue-500 dark:to-blue-700 hidden md:block"></div>
            <div className="space-y-20">
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                <div className="flex-shrink-0 relative"><div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-500 flex items-center justify-center text-white text-4xl font-bold">1</div><div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 opacity-70"></div></div>
                <div className="md:pt-3">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Defina suas tarefas</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">Adicione suas tarefas no Zenn e as classifique usando os três pilares fundamentais: importância real para seus objetivos, orgulho que sentirá após concluí-la, e contribuição para seu crescimento pessoal.</p>
                  <div className="p-5 bg-blue-50 dark:bg-gray-800 rounded-xl" style={{ border: '1px solid #bddbff', backgroundColor: '#f5f9ff' }} ><div className="flex items-start gap-3"><CheckCircle2 className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" size={20} /><p className="text-blue-700 dark:text-blue-300">Interface intuitiva que torna simples a classificação de cada tarefa</p></div></div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                <div className="flex-shrink-0 relative"><div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 flex items-center justify-center text-white text-4xl font-bold">2</div><div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 opacity-70"></div></div>
                <div className="md:pt-3">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Priorize o que importa</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">A análise de pilares gera um score que te ajuda a distinguir o essencial do acessório. Foque nas tarefas com maior impacto e significado para seus objetivos de longo prazo.</p>
                  <div className="p-5 bg-blue-50 dark:bg-gray-800 rounded-xl" style={{ border: '1px solid #bddbff', backgroundColor: '#f5f9ff' }} ><div className="flex items-start gap-3"><CheckCircle2 className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" size={20} /><p className="text-blue-700 dark:text-blue-300">Sistema de score visual que permite identificar imediatamente o que merece sua atenção</p></div></div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                <div className="flex-shrink-0 relative"><div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-600 dark:from-blue-800 dark:to-blue-700 flex items-center justify-center text-white text-4xl font-bold">3</div><div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 opacity-70"></div></div>
                <div className="md:pt-3">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Revise e aprenda</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">Acompanhe seu progresso através de insights estratégicos que revelam padrões em suas escolhas. Refine sua abordagem ao longo do tempo para maximizar seu impacto e satisfação pessoal.</p>
                  <div className="p-5 bg-blue-50 dark:bg-gray-800 rounded-xl" style={{ border: '1px solid #bddbff', backgroundColor: '#f5f9ff' }} ><div className="flex items-start gap-3"><CheckCircle2 className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" size={20} /><p className="text-blue-700 dark:text-blue-300">Relatórios semanais personalizados para aprimorar constantemente suas decisões</p></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-32">
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute -top-8 -left-8 w-64 h-64 bg-blue-100 dark:bg-blue-900/50 rounded-full opacity-70 blur-3xl"></div><div className="absolute -bottom-8 -right-8 w-64 h-64 bg-blue-200 dark:bg-blue-800/50 rounded-full opacity-70 blur-3xl"></div>
            <div className="relative overflow-hidden rounded-2xl border border-white/30 dark:border-gray-700/30"><img src="https://cdn.shopify.com/s/files/1/0629/1993/4061/files/Sem_Titulo-14_57956f3d-9daf-4aee-a20b-68f3bb0f3858.webp?v=1747464720" alt="Dashboard" className="w-full h-auto"/><div className="hidden absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-blue-400/10 to-transparent dark:from-blue-900/20 dark:via-blue-700/10"></div></div>
            <div className="absolute top-10 right-10 max-w-xs bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg border border-blue-100 dark:border-gray-700"><h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Visão por Pilares</h4><p className="text-sm text-gray-600 dark:text-gray-400">Visualize rapidamente suas tarefas organizadas de acordo com os três pilares fundamentais.</p></div>
            <div className="absolute bottom-10 left-10 max-w-xs bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-lg border border-blue-100 dark:border-gray-700"><h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Score Intuitivo</h4><p className="text-sm text-gray-600 dark:text-gray-400">Identifique facilmente quais tarefas merecem sua atenção prioritária através dos scores visuais.</p></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
