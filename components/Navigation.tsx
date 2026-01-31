import React from 'react';
import { Home, ScanLine, History, CloudSun } from 'lucide-react';
import { TabItem } from '../types';

interface NavigationProps {
  activeTab: string;
  onTabChange: (id: any) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: TabItem[] = [
    { id: 'home', label: 'Home', labelTamil: 'முகப்பு', icon: Home },
    { id: 'scan', label: 'Scan', labelTamil: 'ஸ்கேன்', icon: ScanLine },
    { id: 'weather', label: 'Weather', labelTamil: 'வானிலை', icon: CloudSun },
    { id: 'history', label: 'History', labelTamil: 'வரலாறு', icon: History },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-50 pb-safe">
      <div className="flex justify-around items-center h-[4.5rem] max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="group relative flex flex-1 flex-col items-center justify-center h-full transition-all duration-300"
            >
              <div 
                className={`p-2 rounded-2xl transition-all duration-300 mb-1 ${
                  isActive 
                    ? 'bg-emerald-100 text-emerald-700 translate-y-[-2px]' 
                    : 'text-slate-400 group-hover:text-slate-600 group-active:scale-95'
                }`}
              >
                 <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span 
                className={`text-[10px] font-medium tracking-wide transition-colors duration-300 ${
                  isActive ? 'text-emerald-800' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;