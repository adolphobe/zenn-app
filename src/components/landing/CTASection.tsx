
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CTASectionProps {
  handleGetStarted: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ handleGetStarted }) => {
  const navigate = useNavigate();
  
  return (
    <section className="py-32 relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-800 dark:to-blue-700 z-0"></div>
      <div className="absolute inset-0 overflow-hidden"> 
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-xl"></div> 
        <div className="absolute top-20 right-20 w-60 h-60 bg-white/10 rounded-full blur-xl"></div> 
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white/10 rounded-full blur-xl"></div> 
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,256L80,261.3C160,267,320,277,480,250.7C640,224,800,160,960,138.7C1120,117,1280,139,1360,149.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" fill="rgba(255,255,255,0.05)"></path></svg> 
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,128L48,117.3C96,107,192,85,288,90.7C384,96,480,128,576,144C672,160,768,160,864,138.7C960,117,1056,75,1152,58.7C1248,43,1344,53,1392,58.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" fill="rgba(255,255,255,0.1)"></path></svg> 
      </div>
      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-white">Pronto para encontrar clareza?</h2>
            <p className="text-xl text-blue-100 dark:text-blue-200 mb-10 max-w-2xl mx-auto">Comece hoje a jornada para uma execução pessoal com propósito e direção.</p>
            <Button 
              onClick={() => navigate('/login')} 
              className="bg-white text-blue-600 dark:text-blue-700 hover:text-blue-700 dark:hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-100 px-10 py-6 rounded-xl text-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto group"
            >
              Começar Agora <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <p className="text-blue-100/80 dark:text-blue-200/80 mt-10">Experimente gratuitamente por 14 dias. Sem compromisso.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
