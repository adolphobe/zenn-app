
import { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types/user';
import { users } from '../mock/users';

// Tipo simplificado para o contexto de autenticação
interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Criar contexto com valores padrão
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => false,
  logout: () => {},
});

// Provider simplificado
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Verificar se há um usuário no localStorage
    const storedUser = localStorage.getItem('acto_user_data');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Login simplificado
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Lógica simplificada - apenas verifica se o email e a senha correspondem
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage || '',
          lastLoginAt: new Date().toISOString(),
          preferences: user.preferences
        };
        
        // Guardar no localStorage para persistência
        localStorage.setItem('acto_user_data', JSON.stringify(userData));
        localStorage.setItem('acto_is_logged_in', 'true');
        
        setCurrentUser(userData);
        return true;
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout simplificado
  const logout = () => {
    localStorage.removeItem('acto_user_data');
    localStorage.removeItem('acto_is_logged_in');
    setCurrentUser(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
