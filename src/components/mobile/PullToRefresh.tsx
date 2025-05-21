
import React from 'react';
import ReactPullToRefresh from 'react-pull-to-refresh';
import { Loader2 } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

interface PullToRefreshProps {
  children: React.ReactNode;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ children }) => {
  const { isRefreshing, handleRefresh } = usePullToRefresh();
  
  return (
    <ReactPullToRefresh
      onRefresh={handleRefresh}
      style={{ 
        textAlign: 'center',
        overflow: 'visible'
      }}
      pullDownThreshold={70}
      resistance={2.5}
      refreshingContent={
        <div className="flex items-center justify-center py-2 text-primary">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span>Sincronizando...</span>
        </div>
      }
      pullingContent={
        <div className="flex items-center justify-center py-2 text-muted-foreground">
          <span>Puxe para atualizar</span>
        </div>
      }
    >
      {children}
    </ReactPullToRefresh>
  );
};

export default PullToRefresh;
