
import React from 'react';
import { LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface SidebarUserProfileProps {
  sidebarOpen: boolean;
}

const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      console.log("[SidebarUserProfile] Iniciando processo completo de logout");
      
      // Prevent any navigation while logout is in progress
      const inProgress = localStorage.getItem('logout_in_progress');
      if (inProgress === 'true') {
        console.log("[SidebarUserProfile] Logout já em andamento, ignorando nova solicitação");
        return;
      }

      // Set logout flag
      localStorage.setItem('logout_in_progress', 'true');
      
      // Force clear local storage first
      localStorage.removeItem('sb-wbvxnapruffchikhrqrs-auth-token');
      localStorage.removeItem('supabase.auth.token');
      
      toast({
        title: "Logout em andamento",
        description: "Encerrando sua sessão...",
      });
      
      // Call the AuthContext logout function
      await logout();
      
      // Clear logout flag
      localStorage.removeItem('logout_in_progress');
      
      console.log("[SidebarUserProfile] DETALHES EM PORTUGUÊS: Logout realizado com sucesso, redirecionando para página de login");
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
      
      // Navigate to login page after a small delay to ensure logout is complete
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            loggedOut: true,
            timestamp: new Date().getTime() // Add timestamp to prevent caching issues
          } 
        });
      }, 500);
    } catch (error) {
      // Clear logout flag on error
      localStorage.removeItem('logout_in_progress');
      
      console.error("[SidebarUserProfile] Erro durante logout:", error);
      console.error("[SidebarUserProfile] DETALHES EM PORTUGUÊS: Ocorreu um erro ao tentar deslogar do sistema");
      
      toast({
        title: "Erro ao sair",
        description: "Não foi possível fazer logout",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-auto">
      <Separator className="mb-4" />
      <div className={`px-4 pb-4 ${sidebarOpen ? 'space-y-2' : 'flex flex-col items-center'}`}>
        {/* User profile with online indicator */}
        <div className={`flex ${sidebarOpen ? 'items-start gap-3' : 'justify-center'}`}>
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
        
        {/* Logout button */}
        <Button 
          variant="outline"
          size={sidebarOpen ? "default" : "icon"}
          className={`mt-2 w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/20 dark:hover:text-red-300`}
          onClick={handleLogout}
        >
          <LogOut size={18} />
          {sidebarOpen && <span className="ml-2">Sair</span>}
        </Button>
      </div>
    </div>
  );
};

export default SidebarUserProfile;
