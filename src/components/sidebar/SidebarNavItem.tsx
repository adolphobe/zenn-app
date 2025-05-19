
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
  
  // Determina se o item está ativo verificando o caminho
  const currentPath = location.pathname;
  
  // Remove o hash do caminho atual para comparação
  const cleanCurrentPath = currentPath.split('#')[0];
  
  // Verifica se o caminho do item corresponde ao caminho atual
  const isActive = propIsActive !== undefined 
    ? propIsActive 
    : (path !== '#' && (
        cleanCurrentPath === path || 
        cleanCurrentPath.endsWith(`/${path.replace(/^\//, '')}`)
      ));
  
  // Navegação aprimorada para evitar duplicação de rotas
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    
    // Evita comportamento padrão para controlar a navegação
    e.preventDefault();
    
    if (onClick) {
      onClick();
    } else if (path !== '#') {
      // Limpa o caminho para garantir que não haja duplicação
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      
      // Usa replace se já estiver no mesmo caminho para evitar duplicações no histórico
      navigate(cleanPath, { replace: location.pathname === cleanPath });
    }
  };
  
  // Ajusta tamanho do ícone para sidebar compacta
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
