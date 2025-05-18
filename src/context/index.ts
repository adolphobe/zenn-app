
// This file exports all context-related components and hooks for easier imports

// Export context and provider
export { AppContext, useAppContext } from './AppContext';
export { AppProvider } from './AppProvider';
export { AuthContext, useAuth, AuthProvider } from './AuthContext';

// Export types
export type { AppState, AppContextType, AppDispatch, Action } from './types';

// Export actions
export * as taskActions from './tasks/taskActions';
export * as uiActions from './ui/uiActions';
