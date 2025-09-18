import React, { useEffect, useState } from "react";
import axios from "axios";
// ChatPanel removed from practitioner dashboard; moved to Notifications & Care page
import NotificationsPanel from './NotificationsPanel';

const PractitionerHomePage = ({ user }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (user?._id) {
      axios
        .get(`http://localhost:5000/api/dashboard/practitioner/${user._id}`)
        .then((res) => setData(res.data))
        .catch((err) =>
          console.error("Error fetching practitioner dashboard:", err)
        );
    }
  }, [user]);

  if (!data) return <p>Loading practitioner dashboard...</p>;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-lg shadow text-white">
        <h2 className="text-xl font-semibold">
          Welcome back, Dr. {user?.name || "Practitioner"} 👋
        </h2>
        <p className="text-sm">You have {data.upcomingPatients.length} upcoming sessions.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-500">Total Patients</p>
          <p className="font-bold text-lg">{data.totalPatients}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-sm text-gray-500">Upcoming Sessions</p>
          <p className="font-bold text-lg">{data.upcomingPatients.length}</p>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-md font-semibold text-gray-700 mb-3">
          Upcoming Sessions
        </h3>
        <ul className="space-y-2">
          {data.upcomingPatients.map((session) => (
            <li
              key={session._id}
              className="border p-3 rounded-md flex justify-between"
            >
              <span>
                {session.date} - {session.time}
              </span>
              <span className="font-medium">
                Patient: {session.patient?.name || "Unknown"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {/* Notifications & Chat combined */}
          <NotificationsPanel userEmail={user?.email} currentUserId={user?._id} userType={user?.userType} />
        </div>
      </div>
    </div>
  );
};

export default PractitionerHomePage;

