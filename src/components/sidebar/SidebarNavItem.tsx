
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/context/hooks/useSidebar';
import { logInfo } from '@/utils/logUtils';

interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  isFilter?: boolean;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ 
  icon: Icon, 
  label, 
  path, 
  isActive: propIsActive, 
  onClick,
  disabled = false,
  isFilter = false
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen } = useSidebar();
  
  // Compare only the actual path, ignoring hash parts to prevent double paths
  const currentPath = location.pathname;
  const targetPath = path.split('#')[0];
  const isActive = propIsActive !== undefined ? propIsActive : currentPath === targetPath;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled) return;
    
    if (onClick) {
      onClick();
    } else if (path !== '#') {
      // Log navigation for debugging
      logInfo('SidebarNavItem', `Navegando para: ${path}`);
      
      // Clean up path to prevent duplicated segments
      const cleanPath = path.replace(/\/([^/]+)#\/\1/, '/$1');
      navigate(cleanPath);
    }
  };
  
  // Adjust icon size when sidebar is collapsed
  const iconSize = isOpen ? 20 : 24;
  
  return (
    <div className="mb-1">
      <button 
        className={cn(
          "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
          isFilter
            ? isActive 
              ? "bg-[#f5f5f5] dark:bg-gray-700 text-gray-600 dark:text-gray-200 font-medium"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700"
            : isActive 
              ? "bg-primary/10 text-primary font-medium" 
              : "hover:bg-muted/50 text-gray-500 hover:text-gray-700",
          disabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
        )}
        onClick={handleClick}
        disabled={disabled}
      >
        <Icon size={iconSize} className={cn("flex-shrink-0", isOpen ? "mr-2" : "mx-auto")} />
        {isOpen && <span className="truncate">{label}</span>}
      </button>
    </div>
  );
};

export default SidebarNavItem;
