import React from "react";
import { Layout, Calendar, Bell, TrendingUp } from "lucide-react";

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Layout },
    { id: "scheduling", label: "Therapy Scheduling", icon: Calendar },
    { id: "notifications", label: "Notifications & Care", icon: Bell },
    { id: "progress", label: "Progress Tracking", icon: TrendingUp },
  ];

  return (
    <nav className="w-full bg-[#FDF7E9] py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap gap-2 sm:gap-4 p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
              flex items-center px-4 py-2.5 rounded-lg font-medium text-sm transition-all
              hover:bg-amber-100/60 relative group
              ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md transform -translate-y-0.5"
                  : "text-amber-800 hover:text-amber-900"
              }
            `}
              >
                <Icon
                  className={`w-4 h-4 mr-2 ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-amber-700 group-hover:text-amber-800"
                  }`}
                />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute inset-0 bg-white opacity-10 rounded-lg animate-pulse"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
