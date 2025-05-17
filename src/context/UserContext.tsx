import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserPreferences } from '../types/user';
import { 
  getUserByCredentials, 
  getUserById, 
  updateUserPreferences, 
  saveUserPreferences, 
  loadUserPreferences 
} from '../mock/users';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize user from localStorage on component mount
  useEffect(() => {
    const checkLoggedInUser = () => {
      const userId = localStorage.getItem('acto_user_id');
      
      if (userId) {
        const user = getUserById(userId);
        if (user) {
          setCurrentUser(user);
          
          // Apply user preferences
          applyUserPreferences(user.preferences);
        } else {
          // Invalid user ID stored, clear it
          localStorage.removeItem('acto_user_id');
          localStorage.removeItem('acto_is_logged_in');
        }
      }
      
      setIsLoading(false);
    };
    
    checkLoggedInUser();
  }, []);

  // Apply user preferences to the app
  const applyUserPreferences = (preferences: UserPreferences) => {
    // Handle dark mode
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Other preferences will be applied through the AppContext
    // This is a placeholder for future implementation
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = getUserByCredentials(email, password);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('acto_user_id', user.id);
      localStorage.setItem('acto_is_logged_in', 'true');
      
      // Apply user preferences
      applyUserPreferences(user.preferences);
      
      // Update last login time
      updateUserPreferences(user.id, {});
      
      toast({
        title: "Bem-vindo de volta!",
        description: "Login realizado com sucesso",
      });
      
      setIsLoading(false);
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Erro de login",
      description: "Email ou senha incorretos",
    });
    
    setIsLoading(false);
    return false;
  };

  // Logout function
  const logout = () => {
    if (currentUser) {
      // Save current preferences before logout
      saveUserPreferences(currentUser.id);
    }
    
    localStorage.removeItem('acto_user_id');
    localStorage.removeItem('acto_is_logged_in');
    setCurrentUser(null);
    
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso."
    });
    
    navigate('/');
  };

  // Update user preferences
  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    if (!currentUser) return;
    
    const updatedUser = updateUserPreferences(currentUser.id, preferences);
    if (updatedUser) {
      setCurrentUser(updatedUser);
      
      // Apply updated preferences
      applyUserPreferences(updatedUser.preferences);
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, isLoading, login, logout, updatePreferences }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};
