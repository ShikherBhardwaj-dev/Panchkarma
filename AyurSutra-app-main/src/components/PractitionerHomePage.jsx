import React from "react";
import { Calendar, Users, ClipboardList, Stethoscope } from "lucide-react";

const PractitionerHomePage = ({ user }) => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, Dr. {user?.name || "Practitioner"} 👋
        </h1>
        <p className="text-white/90">
          Manage your patients, schedule therapies, and track progress all in one place.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <Calendar className="h-8 w-8 text-green-600 mb-3" />
          <h2 className="text-lg font-semibold">Appointments</h2>
          <p className="text-gray-500 text-sm">View and manage your schedule</p>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <Users className="h-8 w-8 text-blue-600 mb-3" />
          <h2 className="text-lg font-semibold">My Patients</h2>
          <p className="text-gray-500 text-sm">Track patient progress & feedback</p>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <ClipboardList className="h-8 w-8 text-purple-600 mb-3" />
          <h2 className="text-lg font-semibold">Therapies</h2>
          <p className="text-gray-500 text-sm">Create and assign therapies</p>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <Stethoscope className="h-8 w-8 text-red-600 mb-3" />
          <h2 className="text-lg font-semibold">Consultations</h2>
          <p className="text-gray-500 text-sm">Provide online consultations</p>
        </div>
      </div>
    </div>
  );
};

export default PractitionerHomePage;
