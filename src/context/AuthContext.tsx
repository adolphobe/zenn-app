
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types/user';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

// Type definitions for the auth context
interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  session: Session | null;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
  session: null,
});

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Map Supabase user to our app's user format
const mapSupabaseUser = (user: any, profileData?: any): User => {
  return {
    id: user.id,
    name: profileData?.full_name || user.user_metadata?.name || '',
    email: user.email || '',
    profileImage: profileData?.avatar_url || user.user_metadata?.avatar_url || '',
    lastLoginAt: new Date().toISOString(),
    createdAt: user.created_at || new Date().toISOString(),
    preferences: {
      darkMode: false,
      activeViewMode: 'power',
      sidebarOpen: true,
      viewModeSettings: {
        power: {
          showHiddenTasks: false,
          showPillars: true,
          showDates: true,
          showScores: true,
          sortOptions: {
            sortDirection: 'desc',
            noDateAtEnd: true
          }
        },
        chronological: {
          showHiddenTasks: false,
          showPillars: true,
          showDates: true,
          showScores: true,
          sortOptions: {
            sortDirection: 'asc',
            noDateAtEnd: true
          }
        }
      },
      dateDisplayOptions: {
        hideYear: false,
        hideTime: false,
        hideDate: false
      }
    },
    password: ''
  };
};

// Auth Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up auth state listener and check for existing session
  useEffect(() => {
    console.log("[AuthProvider] Initializing auth state");
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("[AuthProvider] Auth state changed:", event);
        
        setSession(newSession);
        
        if (newSession?.user) {
          // Load user profile data asynchronously
          setTimeout(async () => {
            try {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', newSession.user!.id)
                .maybeSingle();
                
              const mappedUser = mapSupabaseUser(newSession.user, profileData);
              console.log("[AuthProvider] User profile loaded:", mappedUser.email);
              setCurrentUser(mappedUser);
            } catch (error) {
              console.error("[AuthProvider] Error fetching user profile:", error);
              const mappedUser = mapSupabaseUser(newSession.user);
              setCurrentUser(mappedUser);
            } finally {
              setIsLoading(false);
            }
          }, 0);
        } else {
          setCurrentUser(null);
          setIsLoading(false);
        }
      }
    );
    
    // Check for existing session on component mount
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("[AuthProvider] Initial session check:", data.session ? "Session found" : "No session");
      } catch (error) {
        console.error("[AuthProvider] Error checking session:", error);
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Clean up subscription on unmount
    return () => {
      console.log("[AuthProvider] Cleaning up - unsubscribing from auth events");
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log("[AuthProvider] Attempting login with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("[AuthProvider] Login error:", error.message);
        
        // Show more user-friendly error messages
        let errorMessage = "Failed to log in. Please check your credentials.";
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "User not found or incorrect password. Please try again.";
        }
        
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive"
        });
        
        setIsLoading(false);
        return false;
      }
      
      console.log("[AuthProvider] Login successful:", data.user?.email);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      return true;
    } catch (error: any) {
      console.error("[AuthProvider] Login error:", error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
      return false;
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log("[AuthProvider] Attempting to create account with email:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        console.error("[AuthProvider] Signup error:", error.message);
        toast({
          title: "Account creation failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      if (data?.user?.identities?.length === 0) {
        console.error("[AuthProvider] User already exists");
        toast({
          title: "Account creation failed",
          description: "This email is already registered.",
          variant: "destructive"
        });
        return false;
      }
      
      // Check if email confirmation is required
      if (data?.user && data.session) {
        console.log("[AuthProvider] Account created and authenticated automatically");
        toast({
          title: "Account created successfully",
          description: "Your account has been created and you've been logged in automatically."
        });
      } else if (data?.user) {
        console.log("[AuthProvider] Email confirmation required");
        toast({
          title: "Account created successfully",
          description: "A confirmation email has been sent to " + email + ". Please check your inbox and confirm your email to log in.",
        });
      }
      
      return true;
    } catch (error: any) {
      console.error("[AuthProvider] Signup error:", error);
      toast({
        title: "Account creation failed",
        description: error.message || "An unexpected error occurred while creating your account",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async (): Promise<void> => {
    console.log("[AuthProvider] Logging out user");
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("[AuthProvider] Logout error:", error.message);
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setCurrentUser(null);
        setSession(null);
        console.log("[AuthProvider] User logged out successfully");
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
        });
      }
    } catch (error) {
      console.error("[AuthProvider] Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Context value
  const value = {
    currentUser,
    isAuthenticated: !!session?.user,
    isLoading,
    login,
    signup,
    logout,
    session
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
