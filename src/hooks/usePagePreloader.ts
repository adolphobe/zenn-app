
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to preload pages for smoother navigation experience
 * @param isMobile Whether the device is mobile
 */
export const usePagePreloader = (isMobile: boolean = false) => {
  const location = useLocation();
  
  // Preload relevant pages based on current location
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Set timeout to avoid blocking the main thread during initial render
    setTimeout(() => {
      if (isMobile) {
        // On mobile, preload both main views regardless of current page
        const preloadPower = import('@/pages/mobile/MobilePowerPage');
        const preloadChrono = import('@/pages/mobile/MobileChronologicalPage');
        
        // Only preload additional pages if we're on one of the main views
        if (currentPath === '/mobile/power' || currentPath === '/mobile/chronological') {
          const preloadHistory = import('@/pages/mobile/MobileTaskHistoryPage');
        }
      } else {
        // Desktop preloading logic could go here
      }
    }, 100);
  }, [location.pathname, isMobile]);
  
  return null;
};

export default usePagePreloader;
