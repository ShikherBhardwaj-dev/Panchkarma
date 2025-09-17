import React, { useEffect, useRef } from "react";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

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
    const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
    const firstTwo = average(lastFour.slice(0, 2).map(d => d.wellness));
    const lastTwo = average(lastFour.slice(-2).map(d => d.wellness));
    return lastTwo > firstTwo ? "Improving" : lastTwo < firstTwo ? "Declining" : "Stable";
  };

  const trend = calculateTrend(feedbackData);
  const trendColor = {
    'Improving': 'text-green-600',
    'Stable': 'text-blue-600',
    'Declining': 'text-orange-600'
  }[trend];

  const chartData = {
    labels: feedbackData.map(d => d.session),
    datasets: [
      {
        label: 'Wellness',
        data: feedbackData.map(d => d.wellness),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      },
      {
        label: 'Energy',
        data: feedbackData.map(d => d.energy),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4
      },
      {
        label: 'Sleep',
        data: feedbackData.map(d => d.sleep),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Wellness Metrics Over Time</h3>
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-2">Trend:</span>
          <span className={`text-sm font-medium ${trendColor}`}>
            {trend === 'Improving' ? '↗' : trend === 'Declining' ? '↘' : '→'} {trend}
          </span>
        </div>
      </div>
      
      <div className="h-[300px]">
        <Line data={chartData} options={options} />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {['Wellness', 'Energy', 'Sleep'].map((metric, index) => {
          const latestValue = feedbackData[feedbackData.length - 1]?.[metric.toLowerCase()];
          const previousValue = feedbackData[feedbackData.length - 2]?.[metric.toLowerCase()];
          const change = latestValue - previousValue;
          
          return (
            <div key={metric} className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm text-gray-600">{metric}</h4>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-semibold">{latestValue}/10</span>
                {change !== 0 && (
                  <span className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {change > 0 ? '+' : ''}{change}
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
