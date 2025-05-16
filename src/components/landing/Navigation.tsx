
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  loaded: boolean;
  onNavigate: (path: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ loaded, onNavigate }) => {
  return (
    <nav className={`w-full flex justify-between items-center py-6 px-8 md:px-16 z-10 transition-all duration-1000 ease-out ${loaded ? 'opacity-100' : 'opacity-0 transform translate-y-4'}`}>
      <div className="text-2xl font-medium text-primary">Zenn</div>
      <Button 
        variant="ghost" 
        className="font-medium text-gray-600 hover:text-primary transition-all duration-300"
        onClick={() => onNavigate('/login')}
      >
        Login
      </Button>
    </nav>
  );
};

export default Navigation;
