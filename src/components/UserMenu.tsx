
import React from 'react';
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const UserMenu: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
    navigate('/login');
  };

  if (!currentUser) return null;

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
            <p className="text-sm font-medium">{currentUser.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.email}</p>
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
