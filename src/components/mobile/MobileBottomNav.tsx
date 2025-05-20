
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HomeIcon, List, BarChartBig, History } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  
  const linkItems = [
    {
      title: 'Potência',
      path: '/mobile/power',
      icon: <HomeIcon className="w-5 h-5" />
    },
    {
      title: 'Lista',
      path: '/mobile/chronological',
      icon: <List className="w-5 h-5" />
    },
    {
      title: 'Histórico',
      path: '/task-history-mobile',
      icon: <History className="w-5 h-5" />
    },
    {
      title: 'Insights',
      path: '/strategic-review',
      icon: <BarChartBig className="w-5 h-5" />
    }
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-gray-200 dark:border-gray-800 flex justify-around">
      {linkItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center py-3 flex-1 text-xs text-center",
            isActive 
              ? "text-primary font-medium" 
              : "text-muted-foreground"
          )}
          end
        >
          <div className="mb-1">{item.icon}</div>
          <span>{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileBottomNav;
