
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NavigationStore } from '@/utils/navigationStore';

/**
 * Hook to manage route transitions, preloading, and navigation optimizations
 * @returns Object with transition state and helper methods
 */
export const useRouteTransition = () => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  
  // Record route visits and transitions
  useEffect(() => {
    // Get the current path
    const currentPath = location.pathname;
    
    // First check if this is a repeat navigation
    const isRepeat = NavigationStore.isRepeatNavigation(currentPath);
    
    // If not a repeat navigation, track transition
    if (!isRepeat) {
      setIsTransitioning(true);
      
      // Record this navigation in our store
      NavigationStore.setLastRoute(currentPath);
      NavigationStore.addRecentRoute(currentPath);
      
      // Reset transition state after animation completes
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300); // match this with your animation duration
      
      return () => clearTimeout(timer);
    } else {
      // For repeat navigations, don't animate
      setIsTransitioning(false);
    }
    
    setPreviousPath(currentPath);
  }, [location.pathname]);
  
  // Preload related routes based on current path
  useEffect(() => {
    const preloadRelatedRoutes = async () => {
      const currentPath = location.pathname;
      
      // Mobile routes - preload related pages
      if (currentPath.startsWith('/mobile')) {
        if (currentPath === '/mobile/power') {
          import('@/pages/mobile/MobileChronologicalPage').catch(() => {});
          import('@/pages/mobile/MobileTaskHistoryPage').catch(() => {});
        }
        else if (currentPath === '/mobile/chronological') {
          import('@/pages/mobile/MobilePowerPage').catch(() => {});
          import('@/pages/mobile/MobileTaskHistoryPage').catch(() => {});
        }
        else if (currentPath === '/mobile/history') {
          import('@/pages/mobile/MobilePowerPage').catch(() => {});
          import('@/pages/mobile/MobileChronologicalPage').catch(() => {});
        }
      }
      // Desktop routes - preload related pages
      else if (currentPath === '/dashboard') {
        import('@/pages/task-history-new/TaskHistoryNewPage').catch(() => {});
        import('@/pages/StrategicReview').catch(() => {});
      }
      else if (currentPath === '/task-history-new') {
        import('@/pages/StrategicReview').catch(() => {});
      }
    };
    
    preloadRelatedRoutes();
  }, [location.pathname]);
  
  return {
    isTransitioning,
    previousPath,
    // Direction could be used for slide animations
    direction: previousPath && location.pathname > previousPath ? 'forward' : 'backward',
    // Helper to determine if this is a mobile route
    isMobileRoute: location.pathname.startsWith('/mobile'),
  };
};

export default useRouteTransition;
