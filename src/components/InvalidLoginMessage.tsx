
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface InvalidLoginMessageProps {
  message: string;
  suggestion?: string | null;
}

export const InvalidLoginMessage: React.FC<InvalidLoginMessageProps> = ({ message, suggestion }) => {
  return (
    <Alert variant="destructive" className="py-2 animate-in fade-in slide-in-from-top-5 duration-300">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <AlertCircle size={16} />
          <AlertDescription className="text-sm font-medium">
            {message}
          </AlertDescription>
        </div>
        {suggestion && (
          <AlertDescription className="text-xs ml-6">
            {suggestion}
          </AlertDescription>
        )}
      </div>
    </Alert>
  );
};
