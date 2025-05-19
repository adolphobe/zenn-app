
import React, { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";
import { useLocation } from "react-router-dom";

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
  
  // Não mostrar o loading na página inicial
  const isLandingPage = location.pathname === '/';
  
  useEffect(() => {
    let fadeTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;

    // Se estiver na página inicial, não mostrar o loading
    if (isLandingPage) {
      setVisible(false);
      return;
    }

    if (show) {
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
    if (show && delay) {
      fadeTimeout = setTimeout(() => {
        setFading(true);
        
        hideTimeout = setTimeout(() => {
          setVisible(false);
          if (onComplete) onComplete();
        }, 400); // Match the fadeOut animation duration
      }, delay);
    }

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(hideTimeout);
    };
  }, [show, delay, visible, onComplete, isLandingPage]);

  // Não renderizar nada se estivermos na página inicial ou se não for visível
  if (!visible || isLandingPage) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 bg-white dark:bg-gray-950 z-50 flex flex-col items-center justify-center",
        fading ? "animate-fade-out" : "animate-fade-in"
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <LoaderCircle className="h-12 w-12 text-blue-500 animate-spin" />
        <Skeleton className="w-24 h-2 bg-blue-200/50 dark:bg-blue-800/30" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Carregando seu painel Zenn</p>
      </div>
    </div>
  );
}
