
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/context/hooks/useSidebar';

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
  
  // Compare only the actual path part for HashRouter
  const currentPath = location.pathname;
  // Normalize path, ensuring it has a leading slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Handle custom active state or compute from current path
  const isActive = propIsActive !== undefined 
    ? propIsActive 
    : currentPath === normalizedPath || currentPath.replace(/^\/+/, '') === normalizedPath.replace(/^\/+/, '');
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled) return;
    
    if (onClick) {
      onClick();
    } else if (path !== '#') {
      // Ensure path is properly formatted with leading slash if needed
      const formattedPath = path.startsWith('/') ? path : `/${path}`;
      
      // Navigate to the path directly
      navigate(formattedPath);
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
              ? "filter-item-enabled" 
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700"
            : isActive 
              ? "menu-item-active" 
              : "menu-item hover:bg-muted/50 text-gray-500 hover:text-gray-700",
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
