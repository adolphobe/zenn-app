
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface InvalidTokenMessageProps {
  message: string;
}

export const InvalidTokenMessage: React.FC<InvalidTokenMessageProps> = ({ message }) => {
  return (
    <Alert variant="destructive" className="py-4 mb-6 animate-in fade-in slide-in-from-top-5 duration-300">
      <div className="flex items-center gap-3">
        <AlertCircle size={20} />
        <AlertDescription className="text-sm font-medium">
          {message}
        </AlertDescription>
      </div>
    </Alert>
  );
};
