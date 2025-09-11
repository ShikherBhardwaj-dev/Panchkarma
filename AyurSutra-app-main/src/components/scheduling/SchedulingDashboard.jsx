import React, { useEffect, useState } from "react";
import axios from "axios";
import ProgressOverview from "../Dashboard/ProgressOverview";
import QuickStats from "../Dashboard/QuickStats";
import WellnessMetrics from "../Dashboard/WellnessMetrics";

const Dashboard = ({ user }) => {
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.userType === "patient") {
      axios
        .get(`http://localhost:5000/api/dashboard/patient/${user._id}`)
        .then((res) => setPatientData(res.data))
        .catch((err) => {
          console.error("Error fetching patient dashboard:", err);
          setError("Failed to load patient data");
        });
    }
  }, [user]);

  if (!user) return <p>Loading user...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      {user.userType === "patient" ? (
        <div className="space-y-6">
          <QuickStats user={user} data={patientData} />
          <ProgressOverview user={user} data={patientData} />
          <WellnessMetrics user={user} data={patientData} />
        </div>
      ) : user.userType === "practitioner" ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-lg shadow-md text-white">
            <h2 className="text-xl font-semibold">
              Welcome back, Dr. {user?.name || "Practitioner"} 👋
            </h2>
            <p className="text-sm opacity-90">
              Manage your patients, schedule therapies, and track progress all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">Appointments</div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">My Patients</div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">Therapies</div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">Consultations</div>
          </div>
        </div>
      ) : (
        <p>Unknown user type: {user.userType}</p>
      )}
    </div>
  );
};

export default Dashboard;


