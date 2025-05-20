
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Power, Clock, Filter, MoreHorizontal, History, Calendar, Moon, Sun, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/auth';
import { 
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer';

type NavigationItem = {
  icon: React.ElementType;
  label: string;
  action?: () => void;
  path?: string;
};

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
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

  // Navigation handlers
  const handlePowerMode = () => {
    setViewMode('power');
    setFilterDrawerOpen(false); // Close filter drawer when changing modes
    navigate('/dashboard');
  };

  const handleChronologicalMode = () => {
    setViewMode('chronological');
    setFilterDrawerOpen(false); // Close filter drawer when changing modes
    navigate('/dashboard');
  };
  
  const handleLogout = async () => {
    await logout();
    setMoreDrawerOpen(false);
    navigate('/login');
  };
  
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
    },
    { 
      icon: Badge, 
      label: showScores ? 'Esconder pontuação' : 'Mostrar pontuação',
      action: toggleShowScores 
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
      icon: History, 
      label: 'Histórico', 
      path: '/task-history-new' 
    },
    { 
      icon: Calendar, 
      label: 'Análise Estratégica', 
      path: '/strategic-review' 
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

  // Main navigation items
  const mainNavItems = [
    { 
      icon: Power, 
      label: 'Potência', 
      isActive: viewMode === 'power',
      action: handlePowerMode 
    },
    { 
      icon: Clock, 
      label: 'Cronologia',
      isActive: viewMode === 'chronological',
      action: handleChronologicalMode 
    },
    { 
      icon: Filter, 
      label: 'Filtros',
      isActive: filterDrawerOpen,
      action: () => setFilterDrawerOpen(!filterDrawerOpen)
    },
    { 
      icon: MoreHorizontal, 
      label: 'Mais',
      isActive: moreDrawerOpen,
      action: () => setMoreDrawerOpen(!moreDrawerOpen)
    }
  ];

  // Drawer menu item renderer
  const renderDrawerItem = (item: NavigationItem) => (
    <button 
      key={item.label}
      className="flex items-center gap-2 w-full p-2 hover:bg-muted rounded-md"
      onClick={() => {
        if (item.action) {
          item.action();
        } else if (item.path) {
          navigate(item.path);
          setFilterDrawerOpen(false);
          setMoreDrawerOpen(false);
        }
      }}
    >
      <item.icon size={16} /> {/* Reduced icon size from 18 to 16 */}
      <span className="text-sm">{item.label}</span>
    </button>
  );

  return (
    <>
      {/* Filter Drawer */}
      <Drawer open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen} direction="bottom">
        <DrawerContent className="max-h-[70vh]">
          <div className="py-3 px-4">
            <h3 className="text-lg font-medium mb-3">Filtros</h3>
            <div className="flex flex-col gap-1">
              {filterItems.map(renderDrawerItem)}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* More Drawer */}
      <Drawer open={moreDrawerOpen} onOpenChange={setMoreDrawerOpen} direction="bottom">
        <DrawerContent className="max-h-[70vh]">
          <div className="py-3 px-4">
            <div className="flex flex-col gap-1">
              {moreItems.map(renderDrawerItem)}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
        <div className="flex justify-around px-1 py-2">
          {mainNavItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "flex flex-col items-center justify-center w-1/4 py-1 text-xs",
                item.isActive ? "text-primary" : "text-muted-foreground"
              )}
              onClick={item.action}
            >
              <item.icon size={20} className="mb-1" /> {/* Keep icon size at 20 for main nav */}
              <span className="text-[10px]">{item.label}</span>
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
    {...props}
  >
    <rect x="4" y="6" width="16" height="16" rx="2" />
    <path d="M8 6V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export default MobileBottomNav;
