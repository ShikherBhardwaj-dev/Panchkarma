import React, { useState } from 'react';
import { Star, Activity, Moon } from 'lucide-react';

const FeedbackForm = ({ sessionId, onSubmit, onClose }) => {
  const [feedback, setFeedback] = useState({
    wellness: 5,
    energy: 5,
    sleep: 5,
    symptoms: '',
    improvements: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(feedback);
  };

  const RatingInput = ({ name, value, icon: Icon, label }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 flex items-center">
        <Icon className="w-4 h-4 mr-2" />
        {label}
      </label>
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
          <button
            key={rating}
            type="button"
            className={`w-8 h-8 rounded-full ${
              rating <= feedback[name]
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-400'
            } flex items-center justify-center hover:bg-green-400 transition-colors`}
            onClick={() => setFeedback(prev => ({ ...prev, [name]: rating }))}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Session Feedback</h3>
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
              onChange={(e) => setFeedback(prev => ({ ...prev, symptoms: e.target.value }))}
              className="w-full h-24 p-2 border rounded-lg resize-none"
              placeholder="Describe any symptoms or discomfort you experienced..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Noticed Improvements
            </label>
            <textarea
              value={feedback.improvements}
              onChange={(e) => setFeedback(prev => ({ ...prev, improvements: e.target.value }))}
              className="w-full h-24 p-2 border rounded-lg resize-none"
              placeholder="Describe any improvements you've noticed..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg"
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