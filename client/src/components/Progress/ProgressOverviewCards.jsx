import React, { useEffect, useState } from "react";
import { BarChart3, Heart, TrendingUp, Droplets } from "lucide-react";

const ProgressOverviewCards = ({ sessionData }) => {
  const [metrics, setMetrics] = useState({
    completedSessions: 0,
    totalSessions: 0,
    wellnessScore: 0,
    wellnessChange: 0,
    recoveryRate: 0,
    recoveryTrend: "stable",
    attendanceRate: 0
  });

  useEffect(() => {
    if (sessionData && sessionData.length > 0) {
      const totalSessions = sessionData.length;
      const completedSessions = sessionData.filter(session => session.status === 'completed').length;

      // Calculate wellness score from recent sessions
      const recentSessions = sessionData.slice(-5);
      const currentWellness = recentSessions.reduce((acc, session) => 
        acc + (session.feedback?.wellness || 0), 0) / recentSessions.length;
      const previousWellness = sessionData
        .slice(-10, -5)
        .reduce((acc, session) => acc + (session.feedback?.wellness || 0), 0) / 5;

      // Calculate recovery rate based on session feedback
      const recoveryProgress = sessionData
        .filter(session => session.feedback)
        .map(session => session.feedback.wellness)
        .reduce((acc, score) => acc + score, 0) / completedSessions;

      const attendanceRate = (sessionData.filter(session => 
        session.status === 'completed' && !session.cancelled).length / totalSessions) * 100;

      setMetrics({
        completedSessions,
        totalSessions,
        wellnessScore: currentWellness.toFixed(1),
        wellnessChange: (currentWellness - previousWellness).toFixed(1),
        recoveryRate: Math.round(recoveryProgress * 10),
        recoveryTrend: currentWellness > previousWellness ? "improving" : "declining",
        attendanceRate: Math.round(attendanceRate)
      });
    }
  }, [sessionData]);

  const cards = [
    {
      title: "Sessions Completed",
      value: metrics.completedSessions,
      subtitle: `of ${metrics.totalSessions} total`,
      icon: BarChart3,
      gradient: "from-blue-500 to-blue-600",
      iconColor: "text-blue-200",
    },
    {
      title: "Wellness Score",
      value: metrics.wellnessScore,
      subtitle: `${metrics.wellnessChange >= 0 ? '+' : ''}${metrics.wellnessChange} from last week`,
      icon: Heart,
      gradient: "from-green-500 to-green-600",
      iconColor: "text-green-200",
    },
    {
      title: "Recovery Progress",
      value: `${metrics.recoveryRate}%`,
      subtitle: metrics.recoveryTrend === "improving" ? "Improving" : "Needs attention",
      icon: TrendingUp,
      gradient: "from-purple-500 to-purple-600",
      iconColor: "text-purple-200",
    },
    {
      title: "Attendance Rate",
      value: `${metrics.attendanceRate}%`,
      subtitle: metrics.attendanceRate >= 90 ? "Excellent" : "Room for improvement",
      icon: Droplets,
      gradient: "from-cyan-500 to-cyan-600",
      iconColor: "text-cyan-200",
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.gradient} rounded-lg p-6 text-white transition-transform hover:scale-[1.02] duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 font-medium">{card.title}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
                <p className="text-white/80 text-sm mt-1">
                  {card.subtitle}
                </p>
              </div>
              <IconComponent className={`h-12 w-12 ${card.iconColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressOverviewCards;
