
import * as React from "react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  direction?: "bottom" | "top" | "left" | "right";
  className?: string;
}

const Drawer = ({ 
  children, 
  open, 
  onOpenChange, 
  direction = "bottom", 
  className 
}: DrawerProps) => {
  // Handle backdrop click
  const handleBackdropClick = () => {
    onOpenChange(false);
  };

  // Prevent events from bubbling up to backdrop
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!open) return null;

  return (
    <div className={cn("fixed inset-0 z-[100] bg-black/30", className)} onClick={handleBackdropClick}>
      <div 
        className={cn(
          "fixed bg-background p-4 shadow-lg transition-all duration-300 ease-in-out z-[101]",
          direction === "bottom" && "bottom-0 left-0 right-0 rounded-t-xl",
          direction === "top" && "top-0 left-0 right-0 rounded-b-xl",
          direction === "left" && "top-0 bottom-0 left-0 rounded-r-xl",
          direction === "right" && "top-0 bottom-0 right-0 rounded-l-xl"
        )}
        onClick={handleContentClick}
      >
        {children}
      </div>
    </div>
  );
};

const DrawerTrigger = ({ 
  children, 
  className, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button 
      className={cn("inline-flex items-center justify-center", className)} 
      {...props}
    >
      {children}
    </button>
  );
};

const DrawerContent = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => {
  return (
    <div className={cn("overflow-auto", className)}>
      {children}
    </div>
  );
};

export { Drawer, DrawerTrigger, DrawerContent };
