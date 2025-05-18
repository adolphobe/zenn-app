
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface AvatarSelectorProps {
  avatars: string[];
  selectedAvatar?: string;
  onSelect: (avatar: string) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  avatars,
  selectedAvatar,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
      {avatars.map((avatar, index) => (
        <div 
          key={index} 
          className={cn(
            "cursor-pointer relative flex flex-col items-center rounded-md p-2 transition-all",
            selectedAvatar === avatar 
              ? "bg-primary/10 ring-2 ring-primary" 
              : "hover:bg-muted"
          )}
          onClick={() => onSelect(avatar)}
        >
          <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
            <AvatarImage src={avatar} alt={`Avatar option ${index + 1}`} />
            <AvatarFallback className="bg-blue-100 text-blue-800">
              <User size={24} />
            </AvatarFallback>
          </Avatar>
          {selectedAvatar === avatar && (
            <div className="absolute top-0 right-0 bg-primary text-white rounded-full p-1 transform translate-x-1/3 -translate-y-1/3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AvatarSelector;
