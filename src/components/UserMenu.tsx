
import React from 'react';
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { performLogout } from '@/utils/authUtils';

const UserMenu: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Log the logout attempt
      console.log("[UserMenu] Iniciando processo de logout");
      
      // Prevent any navigation while logout is in progress
      const inProgress = localStorage.getItem('logout_in_progress');
      if (inProgress === 'true') {
        console.log("[UserMenu] Logout já em andamento, ignorando nova solicitação");
        return;
      }
      
      // Set logout in progress flag before calling logout
      localStorage.setItem('logout_in_progress', 'true');
      
      // Centralized logout method
      await performLogout(navigate);
      
    } catch (error) {
      console.error("[UserMenu] Erro ao fazer logout:", error);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível fazer logout",
        variant: "destructive",
      });
      
      // Clear flag in case of error
      localStorage.removeItem('logout_in_progress');
    }
  };
  
  const goToSettings = () => {
    navigate('/settings');
  };

  if (!currentUser) return null;

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="flex items-center justify-between mb-2">
        <div 
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={goToSettings}
          title="Ir para configurações"
        >
          {currentUser.profileImage ? (
            <img
              src={currentUser.profileImage}
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <UserIcon size={16} className="text-gray-600 dark:text-gray-300" />
            </div>
          )}
          <div className="cursor-pointer">
            <p className="text-sm font-medium">{currentUser?.name || "Usuário"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.email || "usuario@exemplo.com"}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="p-1 h-auto"
          title="Logout"
        >
          <LogOut size={16} />
        </Button>
      </div>
    </div>
  );
};

export default UserMenu;
