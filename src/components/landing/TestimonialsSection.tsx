
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TestimonialsSectionProps {
  activeTestimonial: number;
  setActiveTestimonial: (index: number) => void;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ 
  activeTestimonial, 
  setActiveTestimonial 
}) => {
  const testimonials = [
    { 
      name: "Mariana Silva", 
      role: "Empreendedora", 
      initials: "MS", 
      quote: "\"Finalmente consigo focar no que realmente importa. O Zenn me ajudou a eliminar o ruído e focar nas tarefas que realmente movem minha empresa para frente.\"" 
    }, 
    { 
      name: "Ricardo Mendes", 
      role: "Gerente de Projetos", 
      initials: "RM", 
      quote: "\"A análise por pilares mudou completamente a maneira como eu priorizo tarefas. Agora tenho clareza sobre o que realmente vai gerar impacto no meu trabalho e na minha vida.\"" 
    }, 
    { 
      name: "Juliana Costa", 
      role: "Desenvolvedora", 
      initials: "JC", 
      quote: "\"Eu estava sobrecarregada com milhares de tarefas. O Zenn me ajudou a simplificar e focar apenas no que vai realmente me fazer crescer profissionalmente.\"" 
    }
  ];

  return (
    <section className="py-32 relative z-10 overflow-hidden bg-gradient-to-b from-white via-blue-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="blob-animation w-72 h-72 top-40 right-20 opacity-50" style={{ animation: 'float-around 20s infinite ease-in-out' }}></div>
      <div className="blob-animation w-80 h-80 bottom-40 left-10 opacity-40" style={{ animation: 'float-around 25s infinite ease-in-out reverse' }}></div>
      <div className="container mx-auto px-8 relative z-10">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-sm font-medium mb-4">Experiências Reais</span>
          <h2 className="text-4xl md:text-5xl font-semibold mb-8 text-gray-900 dark:text-white">O que nossos usuários dizem</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Pessoas que encontraram clareza e propósito em suas tarefas diárias com o Zenn</p>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className={`testimonial-card w-full lg:w-1/3 ${activeTestimonial === index ? 'testimonial-active' : 'testimonial-inactive'}`} 
                  onClick={() => setActiveTestimonial(index)} 
                  onMouseEnter={() => setActiveTestimonial(index)}
                >
                  <Card className="bg-white dark:bg-gray-800 border-none transition-all duration-300 overflow-hidden rounded-2xl h-full">
                    <CardContent className="p-8">
                      <div className="mb-8">
                        <div className="flex gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="text-yellow-400" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-lg italic">{testimonial.quote}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold text-xl mr-4">{testimonial.initials}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-10 gap-3">
              {[0, 1, 2].map((index) => (
                <button 
                  key={index} 
                  onClick={() => setActiveTestimonial(index)} 
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${activeTestimonial === index ? 'bg-blue-600 dark:bg-blue-400 w-10' : 'bg-blue-200 dark:bg-gray-700'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
