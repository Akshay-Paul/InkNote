import React from 'react';
import { ListTodo, History } from 'lucide-react';

type Tab = 'today' | 'history';

interface TabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TabButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-blue-500';
  const inactiveClasses = 'text-zinc-500 hover:text-zinc-700';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 w-full pt-2 pb-1 transition-colors duration-200 ${
        isActive ? activeClasses : inactiveClasses
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon}
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
};

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <footer className="flex-shrink-0 grid grid-cols-2 bg-zinc-50/80 backdrop-blur-md border-t border-zinc-200">
      <TabButton
        label="Today"
        icon={<ListTodo size={24} />}
        isActive={activeTab === 'today'}
        onClick={() => onTabChange('today')}
      />
      <TabButton
        label="History"
        icon={<History size={24} />}
        // FIX: Corrected a typo from `active-tab` to `activeTab` to properly check the active tab's state.
        isActive={activeTab === 'history'}
        onClick={() => onTabChange('history')}
      />
    </footer>
  );
};
