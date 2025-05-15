
import { useAppContext } from '../AppContext';
import { useIsMobile } from '@/hooks/use-mobile';

export const useSidebar = () => {
  const { 
    state: { sidebarOpen },
    toggleSidebar
  } = useAppContext();
  const isMobile = useIsMobile();

  return {
    isOpen: sidebarOpen,
    toggle: toggleSidebar,
    isMobile
  };
};
