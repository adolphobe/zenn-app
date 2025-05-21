
import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { motion } from 'framer-motion';

interface PullToRefreshProps {
  children: React.ReactNode;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ children }) => {
  const { isRefreshing, handleRefresh } = usePullToRefresh();
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const pullThreshold = 70; // Distance needed to trigger refresh
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleTouchStart = (e: TouchEvent) => {
      // Only enable pull to refresh when at the top of the page
      if (window.scrollY <= 0) {
        touchStartY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return;
      
      const touchY = e.touches[0].clientY;
      const distance = touchY - touchStartY.current;
      
      // Only pull down, not up, and only when at top of page
      if (distance > 0 && window.scrollY <= 0) {
        // Apply resistance to make pulling feel natural
        const pullWithResistance = Math.min(distance / 2.5, pullThreshold * 1.5);
        setPullDistance(pullWithResistance);
        
        // Prevent default browser behavior when pulling
        e.preventDefault();
      }
    };
    
    const handleTouchEnd = () => {
      if (pullDistance >= pullThreshold && !isRefreshing) {
        // Trigger refresh if pulled enough
        handleRefresh();
      }
      
      // Reset pull distance with animation
      setPullDistance(0);
      setIsPulling(false);
    };
    
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, handleRefresh, isRefreshing]);
  
  const indicatorHeight = Math.max(pullDistance, isRefreshing ? 50 : 0);
  
  return (
    <div ref={containerRef} className="overflow-hidden">
      <motion.div
        className="flex items-center justify-center text-muted-foreground"
        style={{ 
          height: indicatorHeight,
          marginTop: -10,
          marginBottom: indicatorHeight > 0 ? 10 : 0
        }}
        animate={{ height: indicatorHeight }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {isRefreshing ? (
          <div className="flex items-center justify-center py-2 text-primary">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span>Sincronizando...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center py-2">
            <span>Puxe para atualizar</span>
          </div>
        )}
      </motion.div>
      
      <motion.div
        style={{ transform: `translateY(${isPulling || isRefreshing ? indicatorHeight : 0}px)` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PullToRefresh;
