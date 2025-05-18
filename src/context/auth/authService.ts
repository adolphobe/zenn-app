
import { User } from '../../types/user';
import { Session } from '@supabase/supabase-js';

export interface AuthServiceResult {
  user: User | null;
  session: Session | null;
  error: any | null;
}

// Re-export all the individual service functions
export { fetchUserProfile } from './userProfileService';
export { checkAuthSession } from './sessionService';
export { sendPasswordResetEmail } from './passwordService';
export { login } from './loginService';
export { signup } from './signupService';
