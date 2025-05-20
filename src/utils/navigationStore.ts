
import { getLocalStorage, setLocalStorage, removeLocalStorage } from './localStorage';

/**
 * Utilities for tracking and managing navigation state
 */
export const NavigationStore = {
  // Keys used in local storage
  keys: {
    LAST_ROUTE: 'last_route',
    NAV_TYPE: 'navigation_type',
    RECENT_VIEWS: 'recent_views',
    LAST_DASHBOARD_VISIT: 'last_dashboard_visit'
  },
  
  // Track the current navigation
  setNavigationType(type: 'internal' | 'external'): void {
    setLocalStorage(this.keys.NAV_TYPE, type);
  },
  
  getNavigationType(): 'internal' | 'external' | null {
    const value = getLocalStorage(this.keys.NAV_TYPE);
    return value ? JSON.parse(value) : null;
  },
  
  // Track dashboard visit times
  recordDashboardVisit(): void {
    setLocalStorage(this.keys.LAST_DASHBOARD_VISIT, Date.now());
  },
  
  getLastDashboardVisit(): number | null {
    const value = getLocalStorage(this.keys.LAST_DASHBOARD_VISIT);
    return value ? JSON.parse(value) : null;
  },
  
  // Check if dashboard was visited recently
  wasDashboardVisitedRecently(thresholdMs: number = 30000): boolean {
    const lastVisit = this.getLastDashboardVisit();
    if (!lastVisit) return false;
    
    return Date.now() - lastVisit < thresholdMs;
  },
  
  // Track recently visited routes
  addRecentRoute(route: string): void {
    const recentRoutesJson = getLocalStorage(this.keys.RECENT_VIEWS);
    const recentRoutes: string[] = recentRoutesJson ? JSON.parse(recentRoutesJson) : [];
    
    // Add to front, remove duplicates, limit to 5
    const updatedRoutes = [
      route,
      ...recentRoutes.filter(r => r !== route)
    ].slice(0, 5);
    
    setLocalStorage(this.keys.RECENT_VIEWS, updatedRoutes);
  },
  
  getRecentRoutes(): string[] {
    const value = getLocalStorage(this.keys.RECENT_VIEWS);
    return value ? JSON.parse(value) : [];
  },
  
  // Track last route for detecting repeat navigations
  setLastRoute(route: string): void {
    setLocalStorage(this.keys.LAST_ROUTE, route);
  },
  
  getLastRoute(): string | null {
    const value = getLocalStorage(this.keys.LAST_ROUTE);
    return value ? JSON.parse(value) : null;
  },
  
  isRepeatNavigation(currentRoute: string): boolean {
    return this.getLastRoute() === currentRoute;
  }
};
