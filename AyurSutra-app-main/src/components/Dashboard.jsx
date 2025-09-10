import React from "react";

const Dashboard = ({ userRole, patientProgress, notifications, user }) => {
  // Fallback values
  const completedSessions = patientProgress?.completed || 8;
  const totalSessions = patientProgress?.total || 12;
  const overallProgress = patientProgress?.progress || 65;
  const wellnessScore = patientProgress?.score || 8.2;
  const nextSession = patientProgress?.nextSession || "Sep 8, 10:00 AM";
  const nextMilestone = patientProgress?.nextMilestone || "Mid-therapy Assessment";

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-green-50 p-6 rounded-lg shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Welcome back, {user?.name || "Guest"}
          </h2>
          <p className="text-sm text-gray-600">
            Your wellness journey continues. Next session in 2 days.
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-green-600">
            {overallProgress}%
          </span>
          <p className="text-sm text-gray-500">Overall Progress</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Next Session</p>
          <p className="font-semibold">{nextSession}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="font-semibold">
            {completedSessions}/{totalSessions}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Notifications</p>
          <p className="font-semibold">{notifications?.length || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Wellness Score</p>
          <p className="font-semibold">{wellnessScore}/10</p>
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
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            Overall Progress <span className="font-semibold">{overallProgress}%</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Next Milestone: {nextMilestone}
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
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "90%" }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">9/10</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Energy Level</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "80%" }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">8/10</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Overall Wellness</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">8.5/10</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

