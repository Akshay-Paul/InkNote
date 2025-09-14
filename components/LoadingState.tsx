
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Analyzing handwriting...",
  "Identifying tasks...",
  "Categorizing your to-dos...",
  "Almost there...",
  "Building your list...",
];

export const LoadingState: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 mt-4">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-zinc-600 font-medium transition-opacity duration-500">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};
