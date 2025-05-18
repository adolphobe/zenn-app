
import { User } from '../../types/user';
import { Session } from '@supabase/supabase-js';

// Type definitions for the auth context
export interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean, error?: any }>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  session: Session | null;
  sendPasswordResetEmail: (email: string) => Promise<{ success: boolean, error?: any }>;
}
