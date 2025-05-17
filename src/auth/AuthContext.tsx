
import { createContext } from 'react';
import { User } from '../types/user';

export type AuthErrorType = 
  | 'invalid_credentials' 
  | 'connection_lost' 
  | 'session_expired' 
  | null;

export interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: AuthErrorType;
  pendingLoginState: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearAuthError: () => void;
  resumePendingLogin: () => Promise<boolean>;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  authError: null,
  pendingLoginState: false,
  login: async () => false,
  logout: () => {},
  clearAuthError: () => {},
  resumePendingLogin: () => Promise.resolve(false),
});
