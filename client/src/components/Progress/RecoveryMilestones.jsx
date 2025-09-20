import React from "react";
import {
  Check,
  Clock,
  CalendarClock,
  XCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const RecoveryMilestones = ({ sessionData }) => {
  const calculateMilestones = (sessions) => {
    const sessionsArr = Array.isArray(sessions) ? sessions : [];
    if (sessionsArr.length === 0) return [];

    const totalSessions = sessionsArr.length;
    const completedSessions = sessionsArr.filter(
      (s) => s.status === "completed"
    ).length;
    const progress = (completedSessions / totalSessions) * 100;

    const now = new Date();
  const firstSession = new Date(sessionsArr[0]?.date);
  const lastSession = new Date(sessionsArr[sessionsArr.length - 1]?.date);

    const getMilestoneStatus = (threshold) => {
      if (progress >= threshold) return "completed";
      if (progress >= threshold - 20) return "current";
      return "upcoming";
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    return [
      {
        title: "Initial Assessment",
        subtitle: `Started on ${formatDate(firstSession)}`,
        status: "completed",
        icon: Check,
        description: "Initial health evaluation and treatment plan creation",
      },
      {
        title: "Treatment Initiation",
        subtitle: progress >= 25 ? `Completed` : "In progress",
        status: getMilestoneStatus(25),
        icon: progress >= 25 ? CheckCircle2 : Clock,
        description: "First phase of treatments and monitoring response",
      },
      {
        title: "Mid-therapy Assessment",
        subtitle: progress >= 50 ? `Reached on ${formatDate(now)}` : "Upcoming",
        status: getMilestoneStatus(50),
        icon: progress >= 50 ? Check : CalendarClock,
        description: "Evaluation of progress and treatment adjustments",
      },
      {
        title: "Treatment Optimization",
        subtitle: progress >= 75 ? "Completed" : "Pending",
        status: getMilestoneStatus(75),
        icon: progress >= 75 ? CheckCircle2 : AlertCircle,
        description: "Fine-tuning treatments based on response",
      },
      {
        title: "Final Assessment",
        subtitle: `Scheduled for ${formatDate(lastSession)}`,
        status: getMilestoneStatus(100),
        icon: progress >= 100 ? Check : CalendarClock,
        description: "Comprehensive evaluation of treatment outcomes",
      },
    ];
  };

  const milestones = calculateMilestones(sessionData);

  const getStatusStyles = (status) => {
    switch (status) {
      case "completed":
        return {
          icon: "text-amber-600",
          border: "border-amber-200",
          bg: "bg-gradient-to-br from-amber-50 to-orange-50",
          progress: "bg-amber-600",
        };
      case "current":
        return {
          icon: "text-orange-600",
          border: "border-orange-200",
          bg: "bg-gradient-to-br from-orange-50 to-amber-50",
          progress: "bg-orange-600 animate-pulse",
        };
      default:
        return {
          icon: "text-gray-400",
          border: "border-gray-200",
          bg: "bg-gradient-to-br from-gray-50 to-gray-100",
          progress: "bg-gray-300",
        };
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-lg p-6 shadow-sm border border-amber-100">
      <h3 className="text-lg font-semibold text-amber-900 mb-6 flex items-center">
        <div className="mr-2 w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
        Recovery Milestones
      </h3>
      <div className="space-y-6">
        {milestones.map((milestone, index) => {
          const styles = getStatusStyles(milestone.status);
          const IconComponent = milestone.icon;

          return (
            <div
              key={index}
              className={`relative p-4 rounded-lg border ${styles.border} ${styles.bg} transition-all duration-300`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${styles.bg}`}>
                  <IconComponent className={`h-5 w-5 ${styles.icon}`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {milestone.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {milestone.subtitle}
                      </p>
                    </div>
                    {milestone.status === "completed" && (
                      <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {milestone.description}
                  </p>
                </div>
              </div>

              {index < milestones.length - 1 && (
                <div className="absolute left-7 top-16 bottom-0 w-px bg-gray-200" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecoveryMilestones;
