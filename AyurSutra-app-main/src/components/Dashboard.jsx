import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = ({ user }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    if (user?.userType === "patient") {
      axios
        .get(`http://localhost:5000/api/dashboard/patient/${user._id}`)
        .then((res) => {
          console.log("✅ Patient Dashboard Data:", res.data);
          setData(res.data);
        })
        .catch((err) => console.error("❌ Patient Dashboard Error:", err));
    }

    if (user?.userType === "practitioner") {
      axios
        .get(`http://localhost:5000/api/dashboard/practitioner/${user._id}`)
        .then((res) => {
          console.log("✅ Practitioner Dashboard Data:", res.data);
          setData(res.data);
        })
        .catch((err) => console.error("❌ Practitioner Dashboard Error:", err));
    }
  }, [user]);

  if (!data) return <p className="text-center mt-10">Loading dashboard...</p>;

  // -------------------- PATIENT DASHBOARD --------------------
  if (user?.userType === "patient") {
    return (
      <div className="space-y-6 p-6">
        {/* Welcome Card */}
        <div className="bg-green-50 p-6 rounded-lg shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Welcome back, {user.name}
            </h2>
            <p className="text-sm text-gray-600">
              Your wellness journey continues. Next session in 2 days.
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-green-600">
              {data?.progress || 0}%
            </span>
            <p className="text-sm text-gray-500">Overall Progress</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">Next Session</p>
            <p className="font-semibold">{data?.nextSession || "N/A"}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="font-semibold">
              {data?.completed || 0}/{data?.total || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">Notifications</p>
            <p className="font-semibold">{data?.notifications?.length || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">Wellness Score</p>
            <p className="font-semibold">{data?.wellnessScore || 0}/10</p>
          </div>
        </div>

        {/* Therapy Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-md font-semibold text-gray-700 mb-2">
              Therapy Progress
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full"
                style={{ width: `${data?.progress || 0}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              Overall Progress{" "}
              <span className="font-semibold">{data?.progress || 0}%</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Next Milestone: {data?.nextMilestone || "N/A"}
            </p>
          </div>

          {/* Recent Wellness Metrics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-md font-semibold text-gray-700 mb-4">
              Recent Wellness Metrics
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Sleep Quality</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "90%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">9/10</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Energy Level</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "80%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">8/10</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Overall Wellness</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">8.5/10</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------- PRACTITIONER DASHBOARD --------------------
  if (user?.userType === "practitioner") {
    return (
      <div className="space-y-6 p-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 rounded-lg shadow-sm text-white">
          <h2 className="text-lg font-semibold">
            Welcome back, Dr. {user.name} 👋
          </h2>
          <p className="text-sm opacity-90">
            Manage your patients, schedule therapies, and track progress all in
            one place.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold">Appointments</h3>
            <p className="text-sm text-gray-500">View and manage your schedule</p>
            <p className="mt-2 text-green-600 font-bold">
              {data?.appointments?.length || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold">My Patients</h3>
            <p className="text-sm text-gray-500">
              Track patient progress & feedback
            </p>
            <p className="mt-2 text-green-600 font-bold">
              {data?.patients?.length || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold">Therapies</h3>
            <p className="text-sm text-gray-500">Create and assign therapies</p>
            <p className="mt-2 text-green-600 font-bold">
              {data?.therapies || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold">Consultations</h3>
            <p className="text-sm text-gray-500">Provide online consultations</p>
            <p className="mt-2 text-green-600 font-bold">
              {data?.consultations || 0}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <p className="text-center mt-10">Unknown role</p>;
};

export default Dashboard;
