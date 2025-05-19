
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FeaturesSectionProps {
  openExplanationModal: (type: 'pilares' | 'clareza' | 'estrategia') => void;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ openExplanationModal }) => {
  return (
    <section className="py-16 pt-8 relative z-10 overflow-hidden bg-gradient-to-b from-white via-blue-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" style={{backfaceVisibility: 'hidden', transform: 'translateZ(0)'}}>
      <div className="blob-animation w-64 h-64 top-20 left-10" style={{ animation: 'float-around 25s infinite ease-in-out' }}></div>
      <div className="blob-animation w-96 h-96 bottom-40 right-20" style={{ animation: 'float-around 30s infinite ease-in-out reverse' }}></div>
      <div className="container mx-auto px-8 relative">
        <div className="text-center mb-24">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-sm font-medium mb-4">Uma lista de tarefas diferente</span>
          <h2 className="text-4xl md:text-5xl font-semibold mb-8 text-gray-900 dark:text-white">
            Não se trata apenas de <span className="text-blue-600 dark:text-blue-400">fazer</span>.<br />
            Trata-se de <span className="text-blue-600 dark:text-blue-400">escolher o que importa</span>.
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            O que faz cada tarefa valer a pena? O Zenn ajuda você a avaliar e escolher o que realmente vai trazer impacto para sua vida.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Card className="gradient-card-hover bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-none h-full rounded-xl overflow-hidden transition-all duration-300">
              <CardContent className="p-10 flex flex-col h-full">
                <div className="rounded-full bg-blue-50 dark:bg-blue-900/50 w-16 h-16 flex items-center justify-center mb-8 transition-transform duration-300 group-hover:scale-110">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12L11 14L15 10M12 3L4.5 10.5L4.5 20.5H19.5V10.5L12 3Z" stroke="#3b82f6" className="dark:stroke-blue-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="text-2xl font-semibold mb-5 text-gray-800 dark:text-white">Análise por pilares</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg flex-grow">Avalie cada tarefa pelos três pilares fundamentais: importância real, orgulho pós-execução e contribuição para seu crescimento pessoal.</p>
                <div className="mt-8">
                  <Button variant="ghost" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/70 p-0 flex items-center gap-2 group" onClick={() => openExplanationModal('pilares')}>
                      Saiba mais
                      <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="gradient-card-hover bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-none h-full rounded-xl overflow-hidden transition-all duration-300">
              <CardContent className="p-10 flex flex-col h-full">
                <div className="rounded-full bg-blue-50 dark:bg-blue-900/50 w-16 h-16 flex items-center justify-center mb-8">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 16.5V14M7 10.5H17M7 7.5H17M9 19.5H15C16.1046 19.5 17 18.6046 17 17.5V6.5C17 5.39543 16.1046 4.5 15 4.5H9C7.89543 4.5 7 5.39543 7 6.5V17.5C7 18.6046 7.89543 19.5 9 19.5Z" stroke="#3b82f6" className="dark:stroke-blue-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="text-2xl font-semibold mb-5 text-gray-800 dark:text-white">Clareza nas escolhas</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg flex-grow">Abandone o ruído das tarefas sem propósito. Foque apenas no que realmente vai te levar aonde você quer chegar.</p>
                <div className="mt-8">
                  <Button variant="ghost" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/70 p-0 flex items-center gap-2 group" onClick={() => openExplanationModal('clareza')}>
                      Saiba mais 
                      <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="gradient-card-hover bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-none h-full rounded-xl overflow-hidden transition-all duration-300">
              <CardContent className="p-10 flex flex-col h-full">
                <div className="rounded-full bg-blue-50 dark:bg-blue-900/50 w-16 h-16 flex items-center justify-center mb-8">
                   <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 17L15 17M12 13L12 7M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="#3b82f6" className="dark:stroke-blue-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="text-2xl font-semibold mb-5 text-gray-800 dark:text-white">Análise estratégica</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg flex-grow">Entenda padrões e tendências nas suas escolhas para refinar continuamente sua abordagem e melhorar sua execução.</p>
                <div className="mt-8">
                  <Button variant="ghost" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/70 p-0 flex items-center gap-2 group" onClick={() => openExplanationModal('estrategia')}>
                      Saiba mais 
                      <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
