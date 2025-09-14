
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg my-4" role="alert">
      <div className="flex">
        <div className="py-1">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
        </div>
        <div>
          <p className="font-bold text-red-800">Error</p>
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );
};
