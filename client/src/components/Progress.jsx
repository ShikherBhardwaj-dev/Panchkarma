
import React, { useState, useEffect } from "react";
import { TrendingUp, Calendar, User, CheckCircle, Clock, AlertCircle, FileText, Star } from "lucide-react";
import { useToast } from '../contexts/ToastContext.jsx';
import authFetch from '../utils/apiClient.js';

const Progress = ({ user }) => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [previousProgress, setPreviousProgress] = useState(null);
  const { show } = useToast();

  useEffect(() => {
    if (user?.userType === 'patient') {
      fetchMyProgress();
      
      // Auto-refresh every 10 seconds for better responsiveness
      const interval = setInterval(() => {
        fetchMyProgress();
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchMyProgress = async () => {
    try {
      setLoading(true);
      const response = await authFetch('http://localhost:5000/api/progress/my-progress', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Check if progress has been updated
        if (previousProgress && data.patient.progress !== previousProgress.progress) {
          show({ title: 'Progress Updated!', message: `Now at ${data.patient.progress}%` });
        }
        setPreviousProgress(progressData);
        setProgressData(data.patient);
        setLastUpdated(new Date());
      } else {
        const errorText = await response.text();
        show({ title: 'Failed to fetch progress', message: `Server returned status ${response.status}` });
      }
    } catch (error) {
      show({ title: 'Error', message: `Error fetching progress data: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };


  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'pending': 'text-yellow-600',
      'in-progress': 'text-blue-600',
      'improving': 'text-green-600',
      'stable': 'text-gray-600',
      'completed': 'text-green-800'
    };
    return statusMap[status] || 'text-gray-600';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWellnessColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-blue-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ayurveda-chandana/20 via-ayurveda-haldi/10 to-ayurveda-kumkum/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-ayurveda-kumkum/20">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ayurveda-kumkum"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ayurveda-chandana/20 via-ayurveda-haldi/10 to-ayurveda-kumkum/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-ayurveda-kumkum/20">
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Progress Data</h3>
              <p className="text-gray-500">Your progress will be updated by your assigned practitioner.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ayurveda-chandana/20 via-ayurveda-haldi/10 to-ayurveda-kumkum/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-ayurveda-kumkum/20 mb-6">
          <h1 className="text-3xl font-display text-dosha-kapha mb-6 flex items-center">
            <TrendingUp className="w-8 h-8 mr-3" />
            My Progress Tracking
          </h1>
          
          {/* Practitioner Info */}
          {progressData.assignedPractitioner && (
            <div className="bg-gradient-to-r from-ayurveda-kumkum/10 to-ayurveda-haldi/10 p-4 rounded-lg border border-ayurveda-kumkum/20">
              <div className="flex items-center">
                <User className="w-5 h-5 text-ayurveda-kumkum mr-2" />
                <span className="text-sm font-medium text-gray-700">Your Practitioner:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  Dr. {progressData.assignedPractitioner.name}
                </span>
              </div>
              {progressData.assignedPractitioner.practiceAreas && progressData.assignedPractitioner.practiceAreas.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-gray-600">Specializations: </span>
                  <span className="text-sm font-medium text-gray-800">
                    {progressData.assignedPractitioner.practiceAreas.join(', ')}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-ayurveda-kumkum/20">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Current Progress
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Progress Percentage */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-ayurveda-kumkum mb-2">
                    {progressData.progress}%
                  </div>
                  <div className="text-sm text-gray-600">Overall Progress</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-ayurveda-kumkum to-ayurveda-haldi h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressData.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Current Stage */}
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-800 mb-2">
                    {progressData.currentStage}
                  </div>
                  <div className="text-sm text-gray-600">Current Stage</div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(progressData.status)}`}>
                    {getStatusIcon(progressData.status)}
                    <span className="ml-1 capitalize">{progressData.status.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wellness Score */}
            {progressData.wellnessScore > 0 && (
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-ayurveda-kumkum/20">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Wellness Score
                </h2>
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${getWellnessColor(progressData.wellnessScore)}`}>
                    {progressData.wellnessScore}/10
                  </div>
                  <div className="text-sm text-gray-600">Overall Wellness</div>
                  <div className="flex justify-center mt-2">
                    {[...Array(10)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < progressData.wellnessScore 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Next Session */}
            {progressData.nextSessionDate && (
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-ayurveda-kumkum/20">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Next Session
                </h2>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-800">
                    {new Date(progressData.nextSessionDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress History */}
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-ayurveda-kumkum/20">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Progress History
              </h2>
              
              {progressData.progressHistory && progressData.progressHistory.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {progressData.progressHistory.slice().reverse().map((entry, index) => (
                    <div key={index} className="border-l-4 border-ayurveda-kumkum pl-4 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900">{entry.stage}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className={`font-medium ${getProgressColor(entry.progress)}`}>
                          {entry.progress}% Complete
                        </span>
                        <span className={`${getStatusColor(entry.status)}`}>
                          {entry.status.replace('-', ' ')}
                        </span>
                      </div>
                      {entry.notes && (
                        <div className="text-sm text-gray-600 mt-2 italic">
                          "{entry.notes}"
                        </div>
                      )}
                      {entry.recommendations && (
                        <div className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded">
                          <strong>Recommendations:</strong> {entry.recommendations}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        Updated by {entry.updatedByName}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No progress history yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Progress;