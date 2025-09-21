import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Bell,
  BookOpen,
  Users,
  Calendar,
  MessageCircle,
  Leaf,
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Phone,
  MapPin,
} from "lucide-react";

// Import background patterns
const cornerMandala = "/patterns/corner-mandala.svg";
const lotusBackground = "/patterns/lotus-bg.svg";
const mandalaBackground = "/patterns/mandala-bg.svg";
const herbsBackground = "/patterns/herbs-bg.svg";

const PractitionerDashboard = ({ user }) => {
  const [data, setData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    // Fetch dashboard data
    axios
      .get(`http://localhost:5000/api/dashboard/practitioner/${user._id}`)
      .then((res) => {
        console.log("✅ Practitioner Dashboard Data:", res.data);
        setData(res.data);
      })
      .catch((err) => console.error("❌ Practitioner Dashboard Error:", err));

    // Fetch verification status
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/verification/status', {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setVerificationStatus(data);
        }
      })
      .catch(err => console.error('Error fetching verification status:', err));
    }
  }, [user]);

  const getVerificationIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  const getVerificationColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
                {verificationStatus && (
                  <div className={`ml-4 flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getVerificationColor(verificationStatus.verificationStatus)}`}>
                    {getVerificationIcon(verificationStatus.verificationStatus)}
                    <span className="capitalize">{verificationStatus.verificationStatus}</span>
                  </div>
                )}
              </div>
              <p className="text-amber-700 mt-2">
                {data?.hasAssignedPatients 
                  ? `You have ${data.totalPatients} assigned patients. Manage their care and track progress.`
                  : "No patients assigned yet. Patients will appear here once they assign themselves to you."
                }
              </p>
            </div>
            <div className="text-right">
              <div className="relative">
                <span className="text-4xl font-bold text-amber-600">
                  {data?.totalPatients || 0}
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
              {data?.upcomingSessions?.length || 0}
            </p>
            <p className="text-sm text-amber-700 mt-1">Upcoming Sessions</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl shadow-sm border border-amber-100 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity">
              <img src={mandalaBackground} alt="" className="w-full h-full" />
            </div>
            <Users className="h-6 w-6 text-primary-600 mb-3" />
            <p className="text-amber-800 mb-2 font-medium">My Patients</p>
            <p className="text-xl font-semibold text-amber-900">
              {data?.totalPatients || 0}
            </p>
            <p className="text-sm text-amber-700 mt-1">Assigned Patients</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl shadow-sm border border-amber-100 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity">
              <img src={mandalaBackground} alt="" className="w-full h-full" />
            </div>
            <BookOpen className="h-6 w-6 text-primary-600 mb-3" />
            <p className="text-amber-800 mb-2 font-medium">Therapies</p>
            <p className="text-xl font-semibold text-amber-900">
              {data?.totalSessions || 0}
            </p>
            <p className="text-sm text-amber-700 mt-1">Total Sessions</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl shadow-sm border border-amber-100 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity">
              <img src={mandalaBackground} alt="" className="w-full h-full" />
            </div>
            <MessageCircle className="h-6 w-6 text-primary-600 mb-3" />
            <p className="text-amber-800 mb-2 font-medium">Consultations</p>
            <p className="text-xl font-semibold text-amber-900">
              {data?.completionRate || 0}%
            </p>
            <p className="text-sm text-amber-700 mt-1">Completion Rate</p>
          </div>
        </div>

        {/* Assigned Patients Section */}
        {data?.hasAssignedPatients && data?.assignedPatients && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-sm border border-amber-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <img src={lotusBackground} alt="" className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-6 flex items-center">
              <Users className="h-6 w-6 mr-2" />
              Your Assigned Patients ({data.assignedPatients.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.assignedPatients.map((patient, index) => (
                <div key={patient._id} className="bg-white/70 p-4 rounded-lg border border-amber-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-900">{patient.name}</h4>
                      <p className="text-sm text-amber-700">{patient.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    {patient.phone && (
                      <div className="flex items-center text-amber-700">
                        <Phone className="h-4 w-4 mr-2" />
                        {patient.phone}
                      </div>
                    )}
                    {patient.address?.city && (
                      <div className="flex items-center text-amber-700">
                        <MapPin className="h-4 w-4 mr-2" />
                        {patient.address.city}, {patient.address.state}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-amber-700">Progress:</span>
                      <span className="font-semibold text-amber-900">{patient.progress || 0}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-700">Stage:</span>
                      <span className="font-semibold text-amber-900">{patient.currentStage || 'Initial Assessment'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!data?.hasAssignedPatients && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-md border border-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <img src={mandalaBackground} alt="" className="w-full h-full" />
            </div>
            <div className="flex items-center justify-center text-center">
              <div>
                <Users className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-blue-900 mb-2">No Patients Assigned Yet</h3>
                <p className="text-blue-700 mb-4">
                  Patients will appear here once they assign themselves to you through the practitioner search.
                </p>
                <p className="text-sm text-blue-600">
                  Make sure your profile is complete and you're verified to attract patients.
                </p>
              </div>
            </div>
          </div>
        )}

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
