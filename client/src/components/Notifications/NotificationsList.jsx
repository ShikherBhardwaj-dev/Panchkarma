import React from "react";
import { AlertCircle, CheckCircle, Eye } from "lucide-react";

const NotificationsList = ({ notifications, setNotifications }) => {
  return (
    <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-lg p-6 shadow-sm border border-amber-100">
      <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
        <div className="mr-2 w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
        Recent Notifications
      </h3>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border-l-4 ${
              notification.type === "pre"
                ? "border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50/70"
                : "border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50/70"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {notification.type === "pre" ? (
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-1 drop-shadow-sm" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-amber-600 mt-1 drop-shadow-sm" />
                )}
                <div>
                  <h4 className="font-medium text-amber-900">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-amber-600/70 mt-2">
                    {notification.time}
                  </p>
                </div>
              </div>
              <button className="text-amber-500 hover:text-amber-700 transition-colors">
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsList;
