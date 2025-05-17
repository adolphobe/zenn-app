import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/auth';
import { Settings, LogOut, ChevronDown, User, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarUserProfileProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({ toggleTheme, isDarkMode }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 w-full px-2 border-0 justify-between font-normal data-[state=open]:bg-secondary data-[state=open]:text-muted-foreground">
          <div className="flex items-center gap-2">
            {currentUser.profileImage ? (
              <img
                src={currentUser.profileImage}
                alt="Avatar"
                className="w-7 h-7 rounded-full"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User size={14} className="text-gray-600 dark:text-gray-300" />
              </div>
            )}
            <span>{currentUser.name}</span>
          </div>
          <ChevronDown className="size-4 opacity-50 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleTheme}>
            {isDarkMode ? (
              <>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SidebarUserProfile;
