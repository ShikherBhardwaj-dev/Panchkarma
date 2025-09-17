import React, { useState, useEffect } from "react";
import ProgressOverviewCards from "./Progress/ProgressOverviewCards";
import WellnessTrend from "./Progress/WellnessTrend";
import SessionFeedback from "./Progress/SessionFeedback";
import RecoveryMilestones from "./Progress/RecoveryMilestones";

const Progress = () => {
  const [sessionData, setSessionData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sessions data from your API
        const response = await fetch('/api/sessions/user');
        const data = await response.json();
        
        if (data.success) {
          setSessionData(data.sessions);
          
          // Transform session data into feedback format for the wellness trend
          const feedback = data.sessions
            .filter(session => session.feedback)
            .map(session => ({
              session: new Date(session.date).toLocaleDateString(),
              wellness: session.feedback.wellness || 0,
              energy: session.feedback.energy || 0,
              sleep: session.feedback.sleep || 0
            }));
            
          setFeedbackData(feedback);
        }
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Progress Tracking & Analytics
        </h2>
        <div className="flex items-center space-x-4">
          <select 
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="all"
          >
            <option value="all">All Time</option>
            <option value="month">Last Month</option>
            <option value="week">Last Week</option>
          </select>
        </div>
      </div>

      <ProgressOverviewCards sessionData={sessionData} />

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <WellnessTrend feedbackData={feedbackData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SessionFeedback feedbackData={feedbackData} />
        <RecoveryMilestones sessionData={sessionData} />
      </div>
    </div>
  );
};

export default Progress;
