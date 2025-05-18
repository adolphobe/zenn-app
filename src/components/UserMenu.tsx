
import React from 'react';
import { useAuth } from '@/context/AuthContext'; // Direct import
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const UserMenu: React.FC = () => {
  // Create instance ID for better tracking
  const instanceId = Math.random().toString(36).substring(2, 7);
  const { currentUser, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      // Log the logout attempt
      console.log(`[UserMenu:${instanceId}] Iniciando processo de logout em ${new Date().toISOString()}`);
      
      // Force clear local storage first
      localStorage.removeItem('sb-wbvxnapruffchikhrqrs-auth-token');
      localStorage.removeItem('supabase.auth.token');
      
      // Call the AuthContext logout function
      await logout();
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso. Redirecionamento automático desativado.",
      });
      
      console.log(`[UserMenu:${instanceId}] Logout realizado com sucesso - ${new Date().toISOString()}`);
      
      // No automatic redirect
    } catch (error) {
      console.error(`[UserMenu:${instanceId}] Erro ao fazer logout:`, error);
      
      toast({
        title: "Erro ao sair",
        description: "Não foi possível fazer logout",
        variant: "destructive",
      });
    }
  };

  if (!currentUser) {
    console.log(`[UserMenu:${instanceId}] UserMenu não renderizado - usuário não encontrado`);
    return null;
  }

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
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
          <div>
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
