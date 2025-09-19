import React, { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WellnessTrend = ({ feedbackData }) => {
  const calculateTrend = (data) => {
    const lastFour = data.slice(-4);
    const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const firstTwo = average(lastFour.slice(0, 2).map((d) => d.wellness));
    const lastTwo = average(lastFour.slice(-2).map((d) => d.wellness));
    return lastTwo > firstTwo
      ? "Improving"
      : lastTwo < firstTwo
      ? "Declining"
      : "Stable";
  };

  const trend = calculateTrend(feedbackData);
  const trendColor = {
    Improving: "text-amber-600",
    Stable: "text-amber-700",
    Declining: "text-orange-600",
  }[trend];

  const chartData = {
    labels: feedbackData.map((d) => d.session),
    datasets: [
      {
        label: "Wellness",
        data: feedbackData.map((d) => d.wellness),
        borderColor: "rgb(217, 119, 6)", // amber-600
        backgroundColor: "rgba(217, 119, 6, 0.15)",
        tension: 0.4,
      },
      {
        label: "Energy",
        data: feedbackData.map((d) => d.energy),
        borderColor: "rgb(234, 88, 12)", // orange-600
        backgroundColor: "rgba(234, 88, 12, 0.15)",
        tension: 0.4,
      },
      {
        label: "Sleep",
        data: feedbackData.map((d) => d.sleep),
        borderColor: "rgb(180, 83, 9)", // amber-700
        backgroundColor: "rgba(180, 83, 9, 0.15)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-lg p-6 shadow-sm border border-amber-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-amber-900 flex items-center">
          <div className="mr-2 w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
          Wellness Metrics Over Time
        </h3>
        <div className="flex items-center bg-white/60 px-3 py-1 rounded-full border border-amber-200">
          <span className="text-sm text-amber-800 mr-2">Trend:</span>
          <span className={`text-sm font-medium ${trendColor}`}>
            {trend === "Improving" ? "↗" : trend === "Declining" ? "↘" : "→"}{" "}
            {trend}
          </span>
        </div>
      </div>

      <div className="h-[300px]">
        <Line data={chartData} options={options} />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {["Wellness", "Energy", "Sleep"].map((metric, index) => {
          const latestValue =
            feedbackData[feedbackData.length - 1]?.[metric.toLowerCase()];
          const previousValue =
            feedbackData[feedbackData.length - 2]?.[metric.toLowerCase()];
          const change = latestValue - previousValue;
          const gradients = [
            "from-amber-100 to-orange-50",
            "from-orange-100 to-amber-50",
            "from-amber-100 to-orange-100",
          ];

          return (
            <div
              key={metric}
              className={`bg-gradient-to-br ${gradients[index]} rounded-lg p-4 border border-amber-200`}
            >
              <h4 className="text-sm text-amber-900 font-medium">{metric}</h4>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-semibold text-amber-800">
                  {latestValue}/10
                </span>
                {change !== 0 && (
                  <span
                    className={`text-sm font-medium ${
                      change > 0 ? "text-amber-600" : "text-orange-600"
                    }`}
                  >
                    {change > 0 ? "+" : ""}
                    {change}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WellnessTrend;
