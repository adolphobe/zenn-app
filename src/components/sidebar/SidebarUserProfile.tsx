
import React from 'react';
import { LogOut, User, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { toast } from '@/hooks/use-toast';
import { performLogout } from '@/utils/authUtils';

interface SidebarUserProfileProps {
  sidebarOpen: boolean;
}

const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      console.log("[SidebarUserProfile] Iniciando processo de logout");
      
      // Prevent any navigation while logout is in progress
      const inProgress = localStorage.getItem('logout_in_progress');
      if (inProgress === 'true') {
        console.log("[SidebarUserProfile] Logout já em andamento, ignorando nova solicitação");
        return;
      }
      
      // Método centralizado de logout
      await performLogout(navigate);
      
    } catch (error) {
      console.error("[SidebarUserProfile] Erro durante logout:", error);
      
      toast({
        title: "Erro ao sair",
        description: "Não foi possível fazer logout",
        variant: "destructive",
      });
    }
  };
  
  const goToSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="mt-auto">
      <Separator className="mb-4" />
      <div className={`px-4 pb-4 ${sidebarOpen ? 'space-y-2' : 'flex flex-col items-center'}`}>
        {/* User profile with online indicator */}
        <div 
          className={`flex ${sidebarOpen ? 'items-start gap-3' : 'justify-center'} cursor-pointer hover:opacity-80`}
          onClick={goToSettings}
          title="Ir para configurações"
        >
          <div className="relative">
            <Avatar className={`${sidebarOpen ? 'h-12 w-12' : 'h-10 w-10'} border-2 border-white shadow-sm`}>
              <AvatarImage src={currentUser?.profileImage} />
              <AvatarFallback className="bg-blue-100 text-blue-800">
                <User size={sidebarOpen ? 24 : 18} />
              </AvatarFallback>
            </Avatar>
            {/* Online status indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white" />
          </div>
          
          {sidebarOpen && (
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-gray-800 dark:text-gray-200 truncate">
                {currentUser?.name || "Usuário"}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentUser?.email || "usuario@exemplo.com"}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-2">
          {/* Settings button */}
          {sidebarOpen && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={goToSettings}
            >
              <Settings size={18} className="mr-1" />
              Configurar
            </Button>
          )}
          
          {/* Logout button */}
          <Button 
            variant="outline"
            size={sidebarOpen ? "sm" : "icon"}
            className={`${sidebarOpen ? 'flex-1' : 'w-full'} border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/20 dark:hover:text-red-300`}
            onClick={handleLogout}
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="ml-1">Sair</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarUserProfile;
