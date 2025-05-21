import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, ListOrdered, Filter, History, Calendar, Moon, Sun, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/auth';
import { NavigationStore } from '@/utils/navigationStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer';

// Preload functions for key pages
const preloadMobilePower = () => import('@/pages/mobile/MobilePowerPage');
const preloadMobileChronological = () => import('@/pages/mobile/MobileChronologicalPage');
const preloadMobileHistory = () => import('@/pages/mobile/MobileTaskHistoryPage');

type NavigationItem = {
  icon: React.ElementType;
  label: string;
  action?: () => void;
  path?: string;
};

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, currentUser } = useAuth();
  const { 
    state: { viewMode, darkMode, showHiddenTasks, showPillars, showDates, showScores }, 
    setViewMode,
    toggleDarkMode,
    toggleShowHiddenTasks,
    toggleShowPillars,
    toggleShowDates,
    toggleShowScores
  } = useAppContext();
  
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);

  // Preload all mobile pages when bottom nav mounts
  useEffect(() => {
    // Start preloading with small delays to not block the main thread
    setTimeout(() => preloadMobilePower(), 100);
    setTimeout(() => preloadMobileChronological(), 200);
    setTimeout(() => preloadMobileHistory(), 300);
    
    // Preload strategic review only if we're on a main page
    if (location.pathname === '/mobile/power' || location.pathname === '/mobile/chronological') {
      setTimeout(() => import('@/pages/mobile/MobileStrategicReviewPage'), 500);
    }
  }, []);

  // Enhanced navigation handlers with NavigationStore
  const handlePowerMode = () => {
    const currentPath = '/mobile/power';
    
    // Skip navigation if already on the same route
    if (NavigationStore.isRepeatNavigation(currentPath)) {
      setFilterDrawerOpen(false);
      return;
    }
    
    setViewMode('power');
    setFilterDrawerOpen(false); // Close filter drawer when changing modes
    
    // Track navigation
    NavigationStore.setNavigationType('internal');
    NavigationStore.setLastRoute(currentPath);
    NavigationStore.addRecentRoute(currentPath);
    
    navigate(currentPath);
  };

  const handleChronologicalMode = () => {
    const currentPath = '/mobile/chronological';
    
    // Skip navigation if already on the same route
    if (NavigationStore.isRepeatNavigation(currentPath)) {
      setFilterDrawerOpen(false);
      return;
    }
    
    setViewMode('chronological');
    setFilterDrawerOpen(false); // Close filter drawer when changing modes
    
    // Track navigation
    NavigationStore.setNavigationType('internal');
    NavigationStore.setLastRoute(currentPath);
    NavigationStore.addRecentRoute(currentPath);
    
    navigate(currentPath);
  };
  
  const handleHistoryMode = () => {
    const currentPath = '/mobile/history';
    
    // Skip navigation if already on the same route
    if (NavigationStore.isRepeatNavigation(currentPath)) {
      setFilterDrawerOpen(false);
      return;
    }
    
    setFilterDrawerOpen(false); // Close filter drawer when changing modes
    
    // Track navigation
    NavigationStore.setNavigationType('external');
    NavigationStore.setLastRoute(currentPath);
    NavigationStore.addRecentRoute(currentPath);
    
    navigate(currentPath);
  };

  const handleStrategicReview = () => {
    const currentPath = '/mobile/strategic-review';
    
    // Skip navigation if already on the same route
    if (NavigationStore.isRepeatNavigation(currentPath)) {
      setMoreDrawerOpen(false);
      return;
    }
    
    setMoreDrawerOpen(false);
    
    // Track navigation
    NavigationStore.setNavigationType('external');
    NavigationStore.setLastRoute(currentPath);
    NavigationStore.addRecentRoute(currentPath);
    
    navigate(currentPath);
  };
  
  const handleLogout = async () => {
    await logout();
    setMoreDrawerOpen(false);
    navigate('/login');
  };
  
  // Check if current route is Power or Chronological page
  const isPowerOrChronologicalPage = location.pathname === '/mobile/power' || location.pathname === '/mobile/chronological';
  
  // Filter drawer items (depend on view mode)
  const filterItems = viewMode === 'power' ? [
    { 
      icon: showHiddenTasks ? Eye : EyeOff, 
      label: showHiddenTasks ? 'Esconder tarefas ocultas' : 'Mostrar tarefas ocultas',
      action: toggleShowHiddenTasks 
    },
    { 
      icon: Pillar, 
      label: showPillars ? 'Esconder pilares' : 'Mostrar pilares',
      action: toggleShowPillars 
    },
    { 
      icon: Calendar, 
      label: showDates ? 'Esconder datas' : 'Mostrar datas',
      action: toggleShowDates 
    }
  ] : [
    { 
      icon: showHiddenTasks ? Eye : EyeOff, 
      label: showHiddenTasks ? 'Esconder tarefas ocultas' : 'Mostrar tarefas ocultas',
      action: toggleShowHiddenTasks 
    },
    { 
      icon: Pillar, 
      label: showPillars ? 'Esconder pilares' : 'Mostrar pilares',
      action: toggleShowPillars 
    }
  ];
  
  // More drawer items
  const moreItems: NavigationItem[] = [
    { 
      icon: Calendar, 
      label: 'Análise Estratégica', 
      path: '/mobile/strategic-review' 
    },
    { 
      icon: darkMode ? Sun : Moon, 
      label: darkMode ? 'Modo Claro' : 'Modo Escuro',
      action: toggleDarkMode 
    },
    { 
      icon: Settings, 
      label: 'Configurações', 
      path: '/settings' 
    },
    { 
      icon: LogOut, 
      label: 'Sair',
      action: handleLogout 
    }
  ];

  // Modified: Always include Filter in mainNavItems but conditionally set disabled state
  const mainNavItems = [
    { 
      icon: Zap, 
      label: 'Potência', 
      isActive: location.pathname === '/mobile/power',
      action: handlePowerMode 
    },
    { 
      icon: ListOrdered, 
      label: 'Cronológico',
      isActive: location.pathname === '/mobile/chronological',
      action: handleChronologicalMode 
    },
    { 
      icon: History,
      label: 'Histórico',
      isActive: location.pathname === '/mobile/history',
      action: handleHistoryMode
    },
    { 
      icon: Filter, 
      label: 'Filtros',
      isActive: filterDrawerOpen,
      isDisabled: !isPowerOrChronologicalPage,
      action: () => {
        if (isPowerOrChronologicalPage) {
          setFilterDrawerOpen(!filterDrawerOpen);
        }
      }
    },
    // Replace the MoreHorizontal icon with a user Avatar
    { 
      customRender: () => (
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-6 w-6 mb-1">
            <AvatarImage src={currentUser?.profileImage} />
            <AvatarFallback className="text-[10px] bg-primary/10">
              {currentUser?.name?.substring(0, 2) || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="text-[10px]">Mais opções</span>
        </div>
      ),
      label: 'Mais',
      isActive: moreDrawerOpen,
      action: () => setMoreDrawerOpen(!moreDrawerOpen)
    }
  ];

  // Drawer menu item renderer
  const renderDrawerItem = (item: NavigationItem) => (
    <button 
      key={item.label}
      className="flex items-center gap-3 w-full p-3 hover:bg-muted rounded-md"
      onClick={() => {
        if (item.action) {
          item.action();
        } else if (item.path) {
          // Use NavigationStore for path navigation
          if (NavigationStore.isRepeatNavigation(item.path)) {
            setFilterDrawerOpen(false);
            setMoreDrawerOpen(false);
            return;
          }
          
          NavigationStore.setNavigationType('external');
          NavigationStore.setLastRoute(item.path);
          NavigationStore.addRecentRoute(item.path);
          
          navigate(item.path);
          setFilterDrawerOpen(false);
          setMoreDrawerOpen(false);
        }
      }}
    >
      <item.icon size={20} />
      <span className="text-sm">{item.label}</span>
    </button>
  );

  return (
    <>
      {/* Filter Drawer */}
      <Drawer open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen} direction="bottom">
        <DrawerContent className="max-h-[70vh]">
          <div className="py-3 px-4 mb-[30px]">
            <h3 className="text-sm font-medium mb-3">Filtros</h3>
            <div className="flex flex-col gap-2">
              {filterItems.map(renderDrawerItem)}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* More Drawer */}
      <Drawer open={moreDrawerOpen} onOpenChange={setMoreDrawerOpen} direction="bottom">
        <DrawerContent className="max-h-[70vh]">
          <div className="py-3 px-4 mb-[0px]">
            <div className="flex flex-col gap-2">
              {moreItems.map(renderDrawerItem)}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Bottom Navigation Bar with enhanced active state styling and disabled state for Filter */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
        <div className="flex justify-around px-1 py-2">
          {mainNavItems.map((item, index) => (
            <button
              key={item.label}
              className={cn(
                "flex flex-col items-center justify-center w-1/5 py-1 text-xs",
                item.isActive 
                  ? "text-primary" 
                  : item.isDisabled
                    ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    : "text-muted-foreground"
              )}
              onClick={item.action}
              disabled={item.isDisabled}
            >
              {item.customRender ? (
                item.customRender()
              ) : (
                <>
                  <div className={cn(
                    "flex items-center justify-center mb-1 rounded-md w-8 h-8 transition-colors",
                    item.isActive 
                      ? "bg-primary/10 text-primary" 
                      : item.isDisabled
                        ? "text-gray-300 dark:text-gray-600"
                        : "text-muted-foreground"
                  )}>
                    <item.icon size={20} />
                  </div>
                  <span className={cn(
                    "text-[10px]",
                    item.isActive 
                      ? "font-medium text-primary" 
                      : item.isDisabled
                        ? "text-gray-300 dark:text-gray-600"
                        : "text-muted-foreground"
                  )}>
                    {item.label}
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Add padding at the bottom on mobile to compensate for the navigation */}
      <div className="h-16 md:hidden" />
    </>
  );
};

// Custom icon components
const Eye = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    width="16"
    height="16"
    {...props}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOff = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    width="16"
    height="16"
    {...props}
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const Badge = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    width="16"
    height="16"
    {...props}
  >
    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
  </svg>
);

const Pillar = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    width="16"
    height="16"
    {...props}
  >
    <rect x="4" y="6" width="16" height="16" rx="2" />
    <path d="M8 6V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export default MobileBottomNav;
