
import React from 'react';
import { History } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import SidebarNavItem from './SidebarNavItem';

const HistoryNavItem = () => {
  const location = useLocation();
  const isActive = location.pathname.includes('/history');

  return (
    <SidebarNavItem
      icon={History}
      label="Histórico"
      path="/history"
      isActive={isActive}
    />
  );
};

export default HistoryNavItem;
