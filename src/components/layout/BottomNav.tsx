import React from 'react';
import { Home, Calendar, User, Settings } from 'lucide-react';

export type TabType = 'home' | 'calendar' | 'profile' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Início', icon: <Home className="h-5 w-5" /> },
    { id: 'calendar', label: 'Calendário', icon: <Calendar className="h-5 w-5" /> },
    { id: 'profile', label: 'Perfil', icon: <User className="h-5 w-5" /> },
    { id: 'settings', label: 'Ajustes', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md border-t border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 px-3 py-2 pb-safe">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center rounded-2xl px-4 py-1.5 transition-all duration-200 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <div
                className={`rounded-xl p-1 transition-colors ${
                  isActive ? 'bg-blue-50 dark:bg-blue-950/60' : ''
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
