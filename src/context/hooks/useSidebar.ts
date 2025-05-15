
import { useAppContext } from '../AppContext';
import { useIsMobile } from '@/hooks/use-mobile';

export const useSidebar = () => {
  const { 
    state: { sidebarOpen },
    toggleSidebar
  } = useAppContext();
  const isMobile = useIsMobile();

  const openSidebar = () => {
    if (!sidebarOpen) {
      toggleSidebar();
    }
  };

  return {
    isOpen: sidebarOpen,
    toggle: toggleSidebar,
    open: openSidebar,
    isMobile
  };
};
