import React from "react";
import { Leaf } from "lucide-react";

const PrecautionGuidelines = () => {
  const preTherapyGuidelines = [
    "Fast 2-3 hours before therapy",
    "Wear comfortable, loose clothing",
    "Avoid heavy meals on therapy days",
    "Stay hydrated with warm water",
    "Get adequate sleep the night before",
  ];

  const postTherapyGuidelines = [
    "Rest for at least 30 minutes after therapy",
    "Avoid cold foods and beverages",
    "Take warm showers only",
    "Follow prescribed dietary restrictions",
    "Avoid strenuous activities",
  ];

  return (
    <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-lg p-6 shadow-sm border border-amber-100">
      <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
        <div className="mr-2 w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
        <Leaf className="h-5 w-5 mr-2 text-amber-600" />
        General Panchakarma Guidelines
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 p-4 rounded-lg border border-amber-200">
          <h4 className="font-medium text-amber-800 mb-3 flex items-center">
            <div className="w-1 h-4 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full mr-2"></div>
            Pre-Therapy Care
          </h4>
          <ul className="text-sm text-amber-700 space-y-2">
            {preTherapyGuidelines.map((guideline, index) => (
              <li key={index} className="flex items-center">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></div>
                {guideline}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-amber-50/70 p-4 rounded-lg border border-orange-200">
          <h4 className="font-medium text-orange-800 mb-3 flex items-center">
            <div className="w-1 h-4 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full mr-2"></div>
            Post-Therapy Care
          </h4>
          <ul className="text-sm text-orange-700 space-y-2">
            {postTherapyGuidelines.map((guideline, index) => (
              <li key={index} className="flex items-center">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                {guideline}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrecautionGuidelines;
