
import { useEffect, useRef } from 'react';
import { throttledLog } from '../utils/logUtils';

interface UseAnimationObserverProps {
  enabled: boolean;
  threshold?: number;
  rootMargin?: string;
  animationDelay?: number;
}

export const useAnimationObserver = ({
  enabled = true,
  threshold = 0.1,
  rootMargin = '0px',
  animationDelay = 100,
}: UseAnimationObserverProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Cancelar qualquer animationFrame pendente
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Desconectar observer anterior se existir
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Configurar novo IntersectionObserver
    const setupObserver = () => {
      const observerOptions = { 
        root: null, 
        rootMargin, 
        threshold
      };
      
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            setTimeout(() => {
              element.classList.add('animate-in');
            }, animationDelay);
            
            // Parar de observar após animar
            observerRef.current?.unobserve(element);
          }
        });
      }, observerOptions);
      
      // Selecionar e observar todos os elementos com a classe animate-on-scroll
      const elements = document.querySelectorAll('.animate-on-scroll');
      if (elements.length > 0) {
        throttledLog("ANIMATION", `Observando ${elements.length} elementos para animação`);
        elements.forEach(section => observerRef.current?.observe(section));
      } else {
        throttledLog("ANIMATION", "Nenhum elemento encontrado para animar");
      }
    };
    
    // Usar requestAnimationFrame para sincronizar com o ciclo de renderização
    animationFrameRef.current = requestAnimationFrame(() => {
      setupObserver();
    });
    
    return () => {
      // Limpar na desmontagem
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, rootMargin, threshold, animationDelay]);
  
  return { observerRef };
};

export default useAnimationObserver;
