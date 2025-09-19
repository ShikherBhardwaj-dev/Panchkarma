import React, { useEffect, useState } from "react";
import axios from "axios";
import NotificationsPanel from "../NotificationsPanel";

// Import background patterns
const cornerMandala = "/patterns/corner-mandala.svg";
const lotusBackground = "/patterns/lotus-bg.svg";
const mandalaBackground = "/patterns/mandala-bg.svg";
const herbsBackground = "/patterns/herbs-bg.svg";

const PatientDashboard = ({ user, patientProgress, notifications }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(`http://localhost:5000/api/dashboard/patient/${user._id}`)
      .then((res) => {
        console.log("✅ Patient Dashboard Data:", res.data);
        setData(res.data);
      })
      .catch((err) => console.error("❌ Patient Dashboard Error:", err));
  }, [user]);

  return (
    <div className="min-h-screen bg-[#FDF7E9] w-full">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 py-4">
        {/* Background Decorations */}
        <div className="fixed top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
          <img src={cornerMandala} alt="" className="w-full h-full" />
        </div>
        <div className="fixed bottom-0 left-0 w-64 h-64 opacity-5 pointer-events-none">
          <img src={lotusBackground} alt="" className="w-full h-full" />
        </div>

        {/* Welcome Card */}
        <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl shadow-md border border-amber-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <img src={mandalaBackground} alt="" className="w-full h-full" />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-amber-900">
                Namaste, {user.name}
              </h2>
              <p className="text-amber-700 mt-2">
                Continue your path to wellness and balance. Your next healing
                session awaits in 2 days.
              </p>
            </div>
            <div className="text-right">
              <div className="relative">
                <span className="text-4xl font-bold text-amber-600">
                  {data?.progress || 0}%
                </span>
                <div className="absolute -top-3 -right-3 w-20 h-20 opacity-10">
                  <img src={herbsBackground} alt="" className="w-full h-full" />
                </div>
              </div>
              <p className="text-sm text-amber-700">Journey Progress</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl shadow-sm border border-amber-100 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity">
              <img src={mandalaBackground} alt="" className="w-full h-full" />
            </div>
            <p className="text-amber-800 mb-2 font-medium">
              Next Healing Session
            </p>
            <p className="text-xl font-semibold text-amber-900">
              {data?.nextSession || "Not Scheduled"}
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-md border border-amber-100 relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity">
              <img src={mandalaBackground} alt="" className="w-full h-full" />
            </div>
            <p className="text-amber-800 mb-2 font-medium">
              Sessions Completed
            </p>
            <p className="text-xl font-semibold text-amber-900">
              {data?.completed || 0}/{data?.total || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-md border border-amber-100 relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity">
              <img src={mandalaBackground} alt="" className="w-full h-full" />
            </div>
            <p className="text-amber-800 mb-2 font-medium">
              Messages & Updates
            </p>
            <p className="text-xl font-semibold text-amber-900">
              {data?.notifications?.length || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-md border border-amber-100 relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity">
              <img src={mandalaBackground} alt="" className="w-full h-full" />
            </div>
            <p className="text-amber-800 mb-2 font-medium">Wellness Score</p>
            <p className="text-xl font-semibold text-amber-900">
              {data?.wellnessScore || 0}/10
            </p>
          </div>
        </div>

        {/* Therapy Progress and Wellness */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-sm border border-amber-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <img src={lotusBackground} alt="" className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-6">
              Your Healing Journey
            </h3>
            <div className="w-full bg-amber-200/30 rounded-full h-4 mb-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-400 h-4 rounded-full transition-all duration-500"
                style={{ width: `${data?.progress || 0}%` }}
              ></div>
            </div>
            <p className="text-amber-800 mb-2">
              Overall Progress{" "}
              <span className="font-semibold text-amber-900">
                {data?.progress || 0}%
              </span>
            </p>
            <p className="text-amber-700">
              Next Milestone:{" "}
              <span className="font-medium">
                {data?.nextMilestone || "Not Set"}
              </span>
            </p>
          </div>

          {/* Dosha Balance & Wellness */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-xl shadow-md border border-amber-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <img src={herbsBackground} alt="" className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-6">
              Dosha Balance & Wellness
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-amber-800 font-medium">
                    Vata (Air & Space)
                  </p>
                  <span className="text-amber-900 font-semibold">Balanced</span>
                </div>
                <div className="w-full bg-amber-200/30 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-orange-400 h-3 rounded-full"
                    style={{ width: "90%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-amber-800 font-medium">
                    Pitta (Fire & Water)
                  </p>
                  <span className="text-amber-900 font-semibold">
                    Slightly High
                  </span>
                </div>
                <div className="w-full bg-amber-200/30 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-orange-400 h-3 rounded-full"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-amber-800 font-medium">
                    Kapha (Earth & Water)
                  </p>
                  <span className="text-amber-900 font-semibold">
                    In Balance
                  </span>
                </div>
                <div className="w-full bg-amber-200/30 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-orange-400 h-3 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications & Care */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-sm border border-amber-100 overflow-hidden">
            <div className="relative">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <img src={mandalaBackground} alt="" className="w-full h-full" />
              </div>
              <NotificationsPanel
                userEmail={user?.email}
                currentUserId={user?._id}
                userType={user?.userType}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
