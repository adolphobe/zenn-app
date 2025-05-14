
import { createContext, useContext } from 'react';
import { AppContextType } from './types';

// Create context
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook for using the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
