
import { useState } from 'react';

interface TabOption {
  id: string;
  label: string;
}

/**
 * Custom hook for managing tab navigation
 */
export const useTabNavigation = (defaultTab: string) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return {
    activeTab,
    setActiveTab: handleTabChange
  };
};
