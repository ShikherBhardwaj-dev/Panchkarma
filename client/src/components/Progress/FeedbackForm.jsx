import React, { useState } from "react";
import { Star, Activity, Moon } from "lucide-react";

const FeedbackForm = ({ sessionId, onSubmit, onClose }) => {
  const [feedback, setFeedback] = useState({
    wellness: 5,
    energy: 5,
    sleep: 5,
    symptoms: "",
    improvements: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(feedback);
  };

  const RatingInput = ({ name, value, icon: Icon, label }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-amber-800 flex items-center">
        <Icon className="w-4 h-4 mr-2 text-amber-700" />
        {label}
      </label>
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
          <button
            key={rating}
            type="button"
            className={`w-8 h-8 rounded-full ${
              rating <= feedback[name]
                ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md"
                : "bg-white border border-amber-200 text-amber-600"
            } flex items-center justify-center hover:bg-gradient-to-br hover:from-amber-400 hover:to-orange-400 hover:text-white transition-all`}
            onClick={() => setFeedback((prev) => ({ ...prev, [name]: rating }))}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-amber-950/50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto border border-amber-200 shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-amber-900 flex items-center">
          <div className="mr-2 w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
          Session Feedback
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <RatingInput
            name="wellness"
            value={feedback.wellness}
            icon={Star}
            label="Overall Wellness"
          />
          <RatingInput
            name="energy"
            value={feedback.energy}
            icon={Activity}
            label="Energy Level"
          />
          <RatingInput
            name="sleep"
            value={feedback.sleep}
            icon={Moon}
            label="Sleep Quality"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Any symptoms or discomfort?
            </label>
            <textarea
              value={feedback.symptoms}
              onChange={(e) =>
                setFeedback((prev) => ({ ...prev, symptoms: e.target.value }))
              }
              className="w-full h-24 p-3 border border-amber-200 rounded-lg resize-none bg-white/80 text-amber-900 placeholder-amber-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              placeholder="Describe any symptoms or discomfort you experienced..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-amber-800">
              Noticed Improvements
            </label>
            <textarea
              value={feedback.improvements}
              onChange={(e) =>
                setFeedback((prev) => ({
                  ...prev,
                  improvements: e.target.value,
                }))
              }
              className="w-full h-24 p-3 border border-amber-200 rounded-lg resize-none bg-white/80 text-amber-900 placeholder-amber-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              placeholder="Describe any improvements you've noticed..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-amber-700 hover:bg-amber-50 rounded-lg border border-amber-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500 hover:to-orange-500 rounded-lg shadow-md transition-all hover:shadow-lg"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
