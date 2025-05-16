
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface MainContentProps {
  loaded: boolean;
  isNavigating: boolean;
  onNavigate: (path: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ loaded, isNavigating, onNavigate }) => {
  return (
    <main className={`flex flex-col items-center justify-center text-center px-6 transition-all duration-1000 ease-out ${isNavigating ? 'opacity-0 transform translate-y-10' : loaded ? 'opacity-100' : 'opacity-0 transform translate-y-10'}`} style={{ height: 'calc(100vh - 140px)' }}>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-100 leading-tight max-w-3xl mb-8 transition-all duration-700 delay-200 transform animate-fade-in">
        Comece a fazer o que realmente importa pra você.
      </h1>
      
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-12 transition-all duration-700 delay-400 transform animate-fade-in">
        Zenn organiza suas tarefas com base no que importa de verdade: o que pesa, o que te orgulha e o que te fortalece.
      </p>
      
      <Button 
        onClick={() => onNavigate('/login')} 
        className="text-lg px-8 py-6 rounded-full bg-blue-400 hover:bg-blue-500 text-white shadow-blue-200/50 hover:shadow-blue-300/50 transition-all duration-300 transform hover:translate-y-[-2px] hover:scale-[1.02] animate-fade-in"
      >
        Criar minha primeira tarefa
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </main>
  );
};

export default MainContent;
