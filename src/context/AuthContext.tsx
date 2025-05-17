
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types/user';
import { users } from '../mock/users';

// Tipo para o contexto de autenticação
interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Criar contexto
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => false,
  logout: () => {},
});

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para carregar usuário do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('acto_user_data');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Garantir que o usuário tenha todos os campos necessários
        const user = users.find(u => u.id === userData.id);
        if (user) {
          setCurrentUser({
            ...user,
            lastLoginAt: userData.lastLoginAt || new Date().toISOString()
          });
        } else {
          // Limpar localStorage se o usuário não for encontrado
          localStorage.removeItem('acto_user_data');
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        localStorage.removeItem('acto_user_data');
      }
    }
    setIsLoading(false);
  }, []);

  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Lógica simplificada - apenas verifica se o email e a senha correspondem
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Criar um objeto simplificado para armazenar no localStorage
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage || '',
          lastLoginAt: new Date().toISOString(),
          preferences: user.preferences,
          createdAt: user.createdAt,
          password: user.password // Incluindo password para satisfazer o tipo User
        };
        
        // Guardar no localStorage
        localStorage.setItem('acto_user_data', JSON.stringify(userData));
        
        setCurrentUser(userData);
        return true;
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout
  const logout = () => {
    localStorage.removeItem('acto_user_data');
    setCurrentUser(null);
  };
  
  // Valor do contexto
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
