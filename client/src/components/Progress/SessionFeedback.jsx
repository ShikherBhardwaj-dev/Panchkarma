import React from "react";
import {
  Activity,
  Sun,
  Moon,
  ThumbsUp,
  MessageCircle,
  Clock,
} from "lucide-react";

const SessionFeedback = ({ feedbackData }) => {
  const recentSessions = feedbackData.slice(-3).reverse();
  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)} weeks ago`;
  };

  const getMetricColor = (value) => {
    if (value >= 8) return "text-amber-600";
    if (value >= 6) return "text-amber-700";
    return "text-orange-600";
  };

  const getMetricBg = (value) => {
    if (value >= 8) return "bg-gradient-to-br from-amber-50 to-orange-50";
    if (value >= 6) return "bg-gradient-to-br from-orange-50 to-amber-50";
    return "bg-gradient-to-br from-orange-100 to-amber-50";
  };

  return (
    <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-lg p-6 shadow-sm border border-amber-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-amber-900 flex items-center">
          <div className="mr-2 w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
          Recent Session Feedback
        </h3>
        <span className="text-sm text-amber-700 bg-white/60 px-3 py-1 rounded-full border border-amber-200">
          Last 3 sessions
        </span>
      </div>

      <div className="space-y-6">
        {recentSessions.map((session, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              index === 0
                ? "border-amber-200 bg-gradient-to-br from-amber-50/40 to-orange-50/40"
                : "border-amber-100 bg-white/40"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{session.session}</span>
              </div>
              <span className="text-sm text-gray-500">
                {index === 0 ? "Latest" : getTimeAgo(session.session)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div
                className={`p-3 rounded-lg ${getMetricBg(session.wellness)}`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Wellness</span>
                </div>
                <div
                  className={`font-semibold ${getMetricColor(
                    session.wellness
                  )}`}
                >
                  {session.wellness}/10
                </div>
              </div>

              <div className={`p-3 rounded-lg ${getMetricBg(session.energy)}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Sun className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Energy</span>
                </div>
                <div
                  className={`font-semibold ${getMetricColor(session.energy)}`}
                >
                  {session.energy}/10
                </div>
              </div>

              <div className={`p-3 rounded-lg ${getMetricBg(session.sleep)}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Moon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Sleep</span>
                </div>
                <div
                  className={`font-semibold ${getMetricColor(session.sleep)}`}
                >
                  {session.sleep}/10
                </div>
              </div>
            </div>

            {session.comments && (
              <div className="mt-4 p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                <div className="flex items-center space-x-2 text-amber-800 mb-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Comments</span>
                </div>
                <p className="text-sm text-amber-700">{session.comments}</p>
              </div>
            )}

            {index === 0 && session.recommendation && (
              <div className="mt-4 p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                <div className="flex items-center space-x-2 text-orange-700 mb-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Practitioner's Recommendation
                  </span>
                </div>
                <p className="text-sm text-orange-700">
                  {session.recommendation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionFeedback;
