
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
  isFilter?: boolean; // New prop to identify filter items
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ 
  icon: Icon, 
  label, 
  path, 
  isActive: propIsActive, 
  onClick,
  disabled = false,
  isFilter = false // Default to false
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen } = useSidebar();
  const isActive = propIsActive !== undefined ? propIsActive : location.pathname === path;
  
  const handleClick = () => {
    if (disabled) return; // Don't do anything if disabled
    if (onClick) {
      onClick();
    } else if (path !== '#') {
      navigate(path);
    }
  };
  
  // Adjust icon size when sidebar is collapsed
  const iconSize = isOpen ? 20 : 24;
  
  return (
  <div className="mb-1">
    <button 
      className={cn(
        "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
        // Use different styles for filters vs regular nav items
        isFilter
          ? isActive 
            ? "bg-[#f5f5f5] dark:bg-gray-700 text-gray-600 dark:text-gray-200 font-medium" // Mudei text-gray-800 para text-gray-600
            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700" // Mudei text-muted-foreground para text-gray-500
          : isActive 
            ? "bg-primary/10 text-primary font-medium" 
            : "hover:bg-muted/50 text-gray-500 hover:text-gray-700", // Mudei text-muted-foreground para text-gray-500
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
