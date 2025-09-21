import React, { useEffect, useState } from "react";
import { BarChart3, Heart, TrendingUp, Droplets } from "lucide-react";
import cornerMandala from "/patterns/corner-mandala.svg";
import mandalaSmall from "/patterns/mandala-small.svg";

const ProgressOverviewCards = ({ sessionData }) => {
  const [metrics, setMetrics] = useState({
    completedSessions: 0,
    totalSessions: 0,
    wellnessScore: 0,
    wellnessChange: 0,
    recoveryRate: 0,
    recoveryTrend: "stable",
    attendanceRate: 0,
  });

  useEffect(() => {
    if (sessionData && sessionData.length > 0) {
      const totalSessions = sessionData.length;
      const completedSessions = sessionData.filter(
        (session) => session.status === "completed"
      ).length;

      // Calculate wellness score from recent sessions
      const recentSessions = sessionData.slice(-5);
      const currentWellness =
        recentSessions.reduce(
          (acc, session) => acc + (session.feedback?.wellness || 0),
          0
        ) / recentSessions.length;
      const previousWellness =
        sessionData
          .slice(-10, -5)
          .reduce(
            (acc, session) => acc + (session.feedback?.wellness || 0),
            0
          ) / 5;

      // Calculate recovery rate based on session feedback
      const recoveryProgress =
        sessionData
          .filter((session) => session.feedback)
          .map((session) => session.feedback.wellness)
          .reduce((acc, score) => acc + score, 0) / completedSessions;

      const attendanceRate =
        (sessionData.filter(
          (session) => session.status === "completed" && !session.cancelled
        ).length /
          totalSessions) *
        100;

      setMetrics({
        completedSessions,
        totalSessions,
        wellnessScore: currentWellness.toFixed(1),
        wellnessChange: (currentWellness - previousWellness).toFixed(1),
        recoveryRate: Math.round(recoveryProgress * 10),
        recoveryTrend:
          currentWellness > previousWellness ? "improving" : "declining",
        attendanceRate: Math.round(attendanceRate),
      });
    }
  }, [sessionData]);

  const cards = [
    {
      title: "Sessions Completed",
      value: metrics.completedSessions,
      subtitle: `of ${metrics.totalSessions} total`,
      icon: BarChart3,
      gradient: "from-amber-600 to-amber-700",
      iconColor: "text-amber-100",
      pattern: "mandala",
    },
    {
      title: "Wellness Score",
      value: metrics.wellnessScore,
      subtitle: `${metrics.wellnessChange >= 0 ? "+" : ""}${
        metrics.wellnessChange
      } from last week`,
      icon: Heart,
      gradient: "from-orange-600 to-orange-700",
      iconColor: "text-orange-100",
      pattern: "corner",
    },
    {
      title: "Recovery Progress",
      value: `${metrics.recoveryRate}%`,
      subtitle:
        metrics.recoveryTrend === "improving" ? "Improving" : "Needs attention",
      icon: TrendingUp,
      gradient: "from-amber-700 to-orange-800",
      iconColor: "text-amber-100",
      pattern: "mandala",
    },
    {
      title: "Attendance Rate",
      value: `${metrics.attendanceRate}%`,
      subtitle:
        metrics.attendanceRate >= 90 ? "Excellent" : "Room for improvement",
      icon: Droplets,
      gradient: "from-orange-700 to-amber-800",
      iconColor: "text-orange-100",
      pattern: "corner",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.gradient} rounded-lg p-6 text-white transition-transform hover:scale-[1.02] duration-300 overflow-hidden relative`}
          >
            <img
              src={card.pattern === "mandala" ? mandalaSmall : cornerMandala}
              className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4"
              alt=""
              style={{ width: "150px", height: "150px" }}
            />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-white/90 font-medium tracking-wide">
                  {card.title}
                </p>
                <p className="text-3xl font-bold mt-2 drop-shadow-sm">
                  {card.value}
                </p>
                <p className="text-white/90 text-sm mt-1">{card.subtitle}</p>
              </div>
              <IconComponent
                className={`h-12 w-12 ${card.iconColor} drop-shadow-lg`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressOverviewCards;
