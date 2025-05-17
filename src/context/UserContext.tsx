
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
import { ToastContext } from "@/hooks/use-toast-context";

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
  const toastContext = useContext(ToastContext);
  const addToast = toastContext?.addToast;

  // Initialize user from localStorage on component mount with improved handling
  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        console.log("UserContext: Checking logged in user state...");
        const userId = localStorage.getItem('acto_user_id');
        const isLoggedIn = localStorage.getItem('acto_is_logged_in') === 'true';
        
        console.log("UserContext: userId from localStorage:", userId);
        console.log("UserContext: isLoggedIn from localStorage:", isLoggedIn);
        
        if (userId && isLoggedIn) {
          const user = getUserById(userId);
          
          if (user) {
            console.log("UserContext: Found valid user, setting as current user");
            setCurrentUser(user);
            
            // Apply user preferences
            applyUserPreferences(user.preferences);
          } else {
            console.log("UserContext: Invalid user ID stored, clearing localStorage");
            // Invalid user ID stored, clear it
            localStorage.removeItem('acto_user_id');
            localStorage.removeItem('acto_is_logged_in');
          }
        } else {
          console.log("UserContext: No user logged in");
        }
      } catch (error) {
        console.error('Error checking logged in user:', error);
      } finally {
        console.log("UserContext: Finished loading, setting isLoading to false");
        setIsLoading(false);
      }
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
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = getUserByCredentials(email, password);
      
      if (user) {
        console.log("UserContext: Login successful, setting user and localStorage");
        setCurrentUser(user);
        localStorage.setItem('acto_user_id', user.id);
        localStorage.setItem('acto_is_logged_in', 'true');
        
        // Apply user preferences
        applyUserPreferences(user.preferences);
        
        // Update last login time
        updateUserPreferences(user.id, {});
        
        if (addToast) {
          addToast({
            title: "Bem-vindo de volta!",
            description: "Login realizado com sucesso",
          });
        }
        
        return true;
      }
      
      if (addToast) {
        addToast({
          variant: "destructive",
          title: "Erro de login",
          description: "Email ou senha incorretos",
        });
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    try {
      if (currentUser) {
        // Save current preferences before logout
        saveUserPreferences(currentUser.id);
      }
      
      localStorage.removeItem('acto_user_id');
      localStorage.removeItem('acto_is_logged_in');
      setCurrentUser(null);
      
      if (addToast) {
        addToast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso."
        });
      }
      
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
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
