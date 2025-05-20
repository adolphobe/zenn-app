
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Este componente verifica se o usuário está em um dispositivo móvel
 * e redireciona para a versão mobile apropriada com base no viewMode.
 */
const MobileRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { state: { viewMode } } = useAppContext();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Se estiver em um dispositivo móvel e na rota principal do dashboard
    if (isMobile && window.location.pathname === '/dashboard') {
      if (viewMode === 'power') {
        navigate('/mobile/power', { replace: true });
      } else if (viewMode === 'chronological') {
        navigate('/mobile/chronological', { replace: true });
      }
    }
  }, [isMobile, viewMode, navigate]);

  // Este componente não renderiza nada visualmente
  return null;
};

export default MobileRedirect;
