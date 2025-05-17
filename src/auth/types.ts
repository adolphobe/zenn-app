
import { User } from "../types/user";
import { AuthErrorType } from "./AuthContext";

export interface AuthStateHookResult {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  authError: AuthErrorType;
  setAuthError: React.Dispatch<React.SetStateAction<AuthErrorType>>;
  pendingLoginState: boolean;
  lastAuthCheck: Date;
  setLastAuthCheck: React.Dispatch<React.SetStateAction<Date>>;
  checkPendingLogin: () => boolean;
  clearPendingLogin: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  resumePendingLogin: () => Promise<boolean>;
  logout: () => void;
  clearAuthError: () => void;
  logAuth: (message: string, data?: any) => void;
}
