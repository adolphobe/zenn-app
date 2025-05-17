
import React from 'react';
import { LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface SidebarUserProfileProps {
  sidebarOpen: boolean;
}

const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  // Mock user data for demo purposes
  const mockUser = {
    name: "Usuário Demo",
    email: "usuario@exemplo.com",
    profileImage: ""
  };

  const handleLogout = () => {
    // Demonstrative only - just navigate to login
    toast({
      title: "Logout demonstrativo",
      description: "Esta é uma demonstração de logout (sem autenticação real)",
    });
    navigate('/login');
  };

  return (
    <div className="mt-auto">
      <Separator className="mb-4" />
      <div className={`px-4 pb-4 ${sidebarOpen ? 'space-y-2' : 'flex flex-col items-center'}`}>
        {/* Perfil do usuário com indicador online */}
        <div className={`flex ${sidebarOpen ? 'items-start gap-3' : 'justify-center'}`}>
          <div className="relative">
            <Avatar className={`${sidebarOpen ? 'h-12 w-12' : 'h-10 w-10'} border-2 border-white shadow-sm`}>
              <AvatarImage src={mockUser.profileImage} />
              <AvatarFallback className="bg-blue-100 text-blue-800">
                <User size={sidebarOpen ? 24 : 18} />
              </AvatarFallback>
            </Avatar>
            {/* Indicador de status online */}
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white" />
          </div>
          
          {sidebarOpen && (
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{mockUser.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{mockUser.email}</span>
            </div>
          )}
        </div>
        
        {/* Botão de logout */}
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
