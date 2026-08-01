import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import type { TabType } from './BottomNav';

interface MobileLayoutProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  children: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ activeTab, onTabChange, children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased selection:bg-blue-500 selection:text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col pb-24 shadow-xl border-x border-slate-200/50 dark:border-slate-800/60 bg-white dark:bg-slate-950">
        <Header />
        <main className="flex-1 p-5 space-y-6">{children}</main>
        <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
      </div>
    </div>
  );
};
