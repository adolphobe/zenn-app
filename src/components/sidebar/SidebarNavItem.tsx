
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
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ 
  icon: Icon, 
  label, 
  path, 
  isActive: propIsActive, 
  onClick 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen } = useSidebar();
  const isActive = propIsActive !== undefined ? propIsActive : location.pathname === path;
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (path !== '#') {
      navigate(path);
    }
  };

  // Adjust icon size when sidebar is collapsed
  const iconSize = isOpen ? 20 : 24;

  return (
    <button 
      className={cn(
        "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
        isActive 
          ? "bg-primary/10 text-primary font-medium" 
          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
      )}
      onClick={handleClick}
    >
      <Icon size={iconSize} className={cn("flex-shrink-0", isOpen ? "mr-2" : "mx-auto")} />
      {isOpen && <span className="truncate">{label}</span>}
    </button>
  );
};

export default SidebarNavItem;
