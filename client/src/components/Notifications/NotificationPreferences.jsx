import React from "react";
import { Bell, Smartphone, MessageSquare, Mail } from "lucide-react";

const NotificationPreferences = () => {
  const preferences = [
    {
      icon: Smartphone,
      title: "In-App Notifications",
      description: "Real-time alerts",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200",
      checked: true,
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Alerts",
      description: "WhatsApp messages",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      checked: true,
    },
    {
      icon: Mail,
      title: "Email Reminders",
      description: "Daily summaries",
      bgColor: "bg-gradient-to-br from-amber-50/80 to-orange-50/80",
      iconColor: "text-amber-700",
      borderColor: "border-amber-200",
      checked: false,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-lg p-6 shadow-sm border border-amber-100">
      <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
        <div className="mr-2 w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
        <Bell className="h-5 w-5 mr-2 text-orange-600" />
        Notification Preferences
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {preferences.map((pref, index) => {
          const IconComponent = pref.icon;
          return (
            <div
              key={index}
              className={`flex items-center space-x-3 p-4 ${pref.bgColor} rounded-lg border ${pref.borderColor}`}
            >
              <IconComponent
                className={`h-6 w-6 ${pref.iconColor} drop-shadow-sm`}
              />
              <div>
                <p className="font-medium text-amber-900">{pref.title}</p>
                <p className="text-sm text-amber-700">{pref.description}</p>
              </div>
              <input
                type="checkbox"
                className="ml-auto h-5 w-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                defaultChecked={pref.checked}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationPreferences;
