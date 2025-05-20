
import React, { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";
import { useLocation } from "react-router-dom";
import { INITIAL_LOAD_COMPLETE_KEY } from "@/utils/authConstants";

interface LoadingOverlayProps {
  show: boolean;
  delay?: number;
  onComplete?: () => void;
}

export function LoadingOverlay({ 
  show, 
  delay = 1500, 
  onComplete 
}: LoadingOverlayProps) {
  const [visible, setVisible] = useState(show);
  const [fading, setFading] = useState(false);
  const location = useLocation();
  
  // Only show loading on dashboard
  const isDashboard = location.pathname === '/dashboard';
  const isLogoutInProgress = localStorage.getItem('logout_in_progress') === 'true';
  const isInitialLoad = localStorage.getItem(INITIAL_LOAD_COMPLETE_KEY) !== 'true';
  
  useEffect(() => {
    let fadeTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;

    // Don't show loading during logout
    if (isLogoutInProgress) {
      setVisible(false);
      return;
    }

    // Only show on dashboard
    if (!isDashboard) {
      setVisible(false);
      return;
    }

    if (show && isDashboard) {
      setVisible(true);
      setFading(false);
    } else if (visible) {
      // Start fade out animation
      setFading(true);
      
      // After animation completes, actually hide the component
      hideTimeout = setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, 400); // Match the fadeOut animation duration
    }

    // If we're showing and have a delay set, auto-hide after delay
    if (show && isDashboard && delay) {
      // Para navegações internas, usamos um tempo mais curto
      const actualDelay = isInitialLoad ? delay : Math.min(delay, 400);
      
      fadeTimeout = setTimeout(() => {
        setFading(true);
        
        hideTimeout = setTimeout(() => {
          setVisible(false);
          if (onComplete) onComplete();
        }, 400); // Match the fadeOut animation duration
      }, actualDelay);
    }

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(hideTimeout);
    };
  }, [show, delay, visible, onComplete, isDashboard, isLogoutInProgress, isInitialLoad]);

  // Don't render if not visible, not on dashboard, or during logout
  if (!visible || !isDashboard || isLogoutInProgress) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center",
        fading ? "animate-fade-out" : "animate-fade-in",
        isInitialLoad ? "opacity-100" : "bg-white/70 backdrop-blur-sm"
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <LoaderCircle className="h-12 w-12 text-blue-500 animate-spin" />
        <Skeleton className="w-24 h-2 bg-blue-200/50" />
      </div>
    </div>
  );
}
