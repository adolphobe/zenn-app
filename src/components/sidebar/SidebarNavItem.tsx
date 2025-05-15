
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const isActive = propIsActive !== undefined ? propIsActive : location.pathname === path;
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(path);
    }
  };

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
      <Icon size={20} className="mr-2 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
};

export default SidebarNavItem;
