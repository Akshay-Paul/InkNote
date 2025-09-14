import React from 'react';
import { RefreshCcw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  hasContent: boolean;
  activeTab: 'today' | 'history';
}

export const Header: React.FC<HeaderProps> = ({ onReset, hasContent, activeTab }) => {
  return (
    <header className="flex-shrink-0 bg-zinc-50/80 backdrop-blur-md border-b border-zinc-200 px-4 pt-6 pb-3 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-900 capitalize">{activeTab}</h1>
        {hasContent && activeTab === 'today' && (
            <button
            onClick={onReset}
            className="text-blue-500 font-semibold text-lg flex items-center gap-1.5 active:bg-blue-100 rounded-lg p-2 -m-2 transition-colors duration-150"
            >
             <RefreshCcw size={20} /> New Scan
            </button>
        )}
      </div>
    </header>
  );
};