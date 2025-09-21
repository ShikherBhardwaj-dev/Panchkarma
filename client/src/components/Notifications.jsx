import React from "react";
import NotificationPreferences from "./notifications/NotificationPreferences";
import NotificationsList from "./notifications/NotificationsList";
import PrecautionGuidelines from "./notifications/PrecautionGuidelines";
import ErrorBoundary from './ErrorBoundary';
import ChatPanel from './ChatPanel';

const Notifications = ({ notifications = [], setNotifications, currentUserId, currentUserEmail, userType }) => {
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Notifications & Precautions</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm">All</button>
            <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm">Pre-Care</button>
            <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm">Post-Care</button>
          </div>
        </div>

        <NotificationPreferences />
        <NotificationsList notifications={notifications} setNotifications={setNotifications} />
        <PrecautionGuidelines />

        {/* Chat moved into Notifications & Care page */}
        <div className="bg-white p-4 rounded shadow border">
          <h3 className="text-lg font-semibold mb-2">Care Chat</h3>
          <ChatPanel currentUserId={currentUserId} currentUserEmail={currentUserEmail} userType={userType} />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Notifications;
