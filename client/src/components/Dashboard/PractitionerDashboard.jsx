import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Bell,
  BookOpen,
  Users,
  Calendar,
  MessageCircle,
  Leaf,
} from "lucide-react";

// Import background patterns
const cornerMandala = "/patterns/corner-mandala.svg";
const lotusBackground = "/patterns/lotus-bg.svg";
const mandalaBackground = "/patterns/mandala-bg.svg";
const herbsBackground = "/patterns/herbs-bg.svg";

const PractitionerDashboard = ({ user }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(`http://localhost:5000/api/dashboard/practitioner/${user._id}`)
      .then((res) => {
        console.log("✅ Practitioner Dashboard Data:", res.data);
        setData(res.data);
      })
      .catch((err) => console.error("❌ Practitioner Dashboard Error:", err));
  }, [user]);

  return (
    <div className="min-h-screen bg-[#FDF7E9] w-full">
      {/* Background Decorations */}
      <div className="fixed top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
        <img src={cornerMandala} alt="" className="w-full h-full" />
      </div>
      <div className="fixed bottom-0 left-0 w-64 h-64 opacity-5 pointer-events-none">
        <img src={lotusBackground} alt="" className="w-full h-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 py-4">
        {/* Welcome Card */}
        <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl shadow-md border border-amber-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <img src={mandalaBackground} alt="" className="w-full h-full" />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center mb-2">
                <Leaf className="h-8 w-8 text-primary-600 mr-3" />
                <h2 className="text-2xl font-semibold text-amber-900">
                  Namaste, Dr. {user.name}
                </h2>
              </div>
              <p className="text-amber-700 mt-2">
                Manage your patients, schedule therapies, and track progress all
                in one place.
              </p>
            </div>
            <div className="text-right">
              <div className="relative">
                <span className="text-4xl font-bold text-amber-600">
                  {data?.patients?.length || 0}
                </span>
                <div className="absolute -top-3 -right-3 w-20 h-20 opacity-10">
                  <img src={herbsBackground} alt="" className="w-full h-full" />
                </div>
              </div>
              <p className="text-sm text-amber-700">Active Patients</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl shadow-sm border border-amber-100 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity">
              <img src={mandalaBackground} alt="" className="w-full h-full" />
            </div>
            <Calendar className="h-6 w-6 text-primary-600 mb-3" />
            <p className="text-amber-800 mb-2 font-medium">Appointments</p>
            <p className="text-xl font-semibold text-amber-900">
              {data?.appointments?.length || 0}
            </p>
            <p className="text-sm text-amber-700 mt-1">Scheduled Today</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl shadow-sm border border-amber-100 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity">
              <img src={mandalaBackground} alt="" className="w-full h-full" />
            </div>
            <Users className="h-6 w-6 text-primary-600 mb-3" />
            <p className="text-amber-800 mb-2 font-medium">My Patients</p>
            <p className="text-xl font-semibold text-amber-900">
              {data?.patients?.length || 0}
            </p>
            <p className="text-sm text-amber-700 mt-1">Total Active</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl shadow-sm border border-amber-100 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity">
              <img src={mandalaBackground} alt="" className="w-full h-full" />
            </div>
            <BookOpen className="h-6 w-6 text-primary-600 mb-3" />
            <p className="text-amber-800 mb-2 font-medium">Therapies</p>
            <p className="text-xl font-semibold text-amber-900">
              {data?.therapies || 0}
            </p>
            <p className="text-sm text-amber-700 mt-1">Active Programs</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl shadow-sm border border-amber-100 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity">
              <img src={mandalaBackground} alt="" className="w-full h-full" />
            </div>
            <MessageCircle className="h-6 w-6 text-primary-600 mb-3" />
            <p className="text-amber-800 mb-2 font-medium">Consultations</p>
            <p className="text-xl font-semibold text-amber-900">
              {data?.consultations || 0}
            </p>
            <p className="text-sm text-amber-700 mt-1">This Week</p>
          </div>
        </div>

        {/* Patient Activity & Recent Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-sm border border-amber-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <img src={lotusBackground} alt="" className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-6">
              Today's Schedule
            </h3>
            {data?.appointments?.length ? (
              <div className="space-y-4">
                {data.appointments.map((apt, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-amber-50/50 p-3 rounded-lg"
                  >
                    <Calendar className="h-5 w-5 text-primary-600 mr-3" />
                    <div>
                      <p className="text-amber-900 font-medium">
                        {apt.patientName}
                      </p>
                      <p className="text-sm text-amber-700">
                        {apt.time} - {apt.therapy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-amber-700">
                No appointments scheduled for today
              </p>
            )}
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-sm border border-amber-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <img src={herbsBackground} alt="" className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-6">
              Patient Progress Updates
            </h3>
            <div className="space-y-4">
              {/* Sample progress updates - replace with real data */}
              <div className="flex items-center bg-amber-50/50 p-3 rounded-lg">
                <Bell className="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <p className="text-amber-900 font-medium">
                    New feedback received
                  </p>
                  <p className="text-sm text-amber-700">
                    From Amit P. for Nasya therapy
                  </p>
                </div>
              </div>
              <div className="flex items-center bg-amber-50/50 p-3 rounded-lg">
                <Bell className="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <p className="text-amber-900 font-medium">
                    Wellness score updated
                  </p>
                  <p className="text-sm text-amber-700">
                    Priya M.'s score improved to 8.5
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PractitionerDashboard;
