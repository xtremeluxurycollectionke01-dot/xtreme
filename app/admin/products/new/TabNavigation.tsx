import React from "react";
import { LucideIcon } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}


interface TabNavigationProps {
  tabs: readonly Tab[]; 
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-800 pb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === tab.id 
              ? 'bg-yellow-500 text-black font-medium' 
              : 'bg-gray-900 text-gray-400 hover:text-white'
          }`}
        >
          <tab.icon className="h-4 w-4" />
          {tab.label}
        </button>
      ))}
    </div>
  );
};