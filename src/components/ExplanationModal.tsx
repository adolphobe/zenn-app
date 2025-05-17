
import * as React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlwaysVisibleScrollArea } from '@/components/ui/always-visible-scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

const ExplanationModal: React.FC<ExplanationModalProps> = ({
  isOpen,
  onClose,
  title,
  content
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`bg-white dark:bg-gray-800 rounded-xl ${isMobile ? 'w-full max-w-lg' : 'w-full max-w-2xl'}`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background hover:opacity-100" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        
        <div className="overflow-hidden" style={{ maxHeight: isMobile ? '60vh' : '70vh' }}>
          <AlwaysVisibleScrollArea className="h-full">
            <div className="p-4">
              <div className="prose dark:prose-invert max-w-none">
                {content}
              </div>
            </div>
          </AlwaysVisibleScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExplanationModal;
