
import React, { useEffect } from 'react';

interface SidebarMobileOverlayProps {
  isActive: boolean;
  onClose: () => void;
}

const SidebarMobileOverlay: React.FC<SidebarMobileOverlayProps> = ({ 
  isActive, 
  onClose 
}) => {
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
      
      // Create overlay
      const overlay = document.createElement('div');
      overlay.id = 'sidebar-overlay';
      overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-20';
      overlay.addEventListener('click', onClose);
      document.body.appendChild(overlay);
      
      return () => {
        document.body.style.overflow = '';
        const existingOverlay = document.getElementById('sidebar-overlay');
        if (existingOverlay) {
          existingOverlay.remove();
        }
      };
    }
  }, [isActive, onClose]);

  return null; // This component doesn't render any UI directly
};

export default SidebarMobileOverlay;
