
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

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
      className={`sidebar-item ${isActive ? 'active' : ''} w-full`}
      onClick={handleClick}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
};

export default SidebarNavItem;
