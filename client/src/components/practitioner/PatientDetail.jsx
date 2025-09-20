import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit3, Save, AlertCircle } from 'lucide-react';
import WellnessTrend from '../Progress/WellnessTrend';
import RecoveryMilestones from '../Progress/RecoveryMilestones';
import authFetch from '../../utils/apiClient';

const PatientDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState('');
  const [recommendations, setRecommendations] = useState('');

  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);

  const fetchPatientDetails = async () => {
    try {
      let response;
      try {
        response = await authFetch(`/api/practitioner/patients/${patientId}`);
      } catch (err) {
        console.error('authFetch failed', err);
        response = null;
      }

      if (!response || response.status === 401 || response.status === 403) {
        // try public fallback
        const fb = await fetch(`/auth/patients/${patientId}`).catch(() => null);
        const data = fb ? await fb.json().catch(() => null) : null;
        if (data) {
          setPatient(data.patient || data);
          setSessions(data.sessions || []);
          setNotes((data.patient && data.patient.practitionerNotes) || '');
          setRecommendations((data.patient && data.patient.recommendations) || '');
        }
      } else {
        const data = await response.json();
        if (data.success) {
          setPatient(data.patient);
          setSessions(data.sessions);
          setNotes(data.patient.practitionerNotes || '');
          setRecommendations(data.patient.recommendations || '');
        }
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveUpdates = async () => {
    try {
      let response;
      try {
        response = await authFetch(`/api/practitioner/patients/${patientId}/progress`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            notes,
            recommendations
          }),
        });
      } catch (err) {
        console.error('authFetch failed', err);
        response = null;
      }

      if (!response || response.status === 401 || response.status === 403) {
        // try public fallback
        try {
          response = await fetch(`/auth/patients/${patientId}/progress`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notes, recommendations })
          });
        } catch (err) {
          console.error('Fallback update failed', err);
          response = null;
        }
      }

      if (response && response.ok) {
        setIsEditing(false);
        fetchPatientDetails(); // Refresh data
      } else {
        const err = response ? await response.text().catch(() => 'Failed') : 'No response';
        console.error('Save error:', err);
      }
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/practitioner/patients')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Patient List
        </button>
        <button
          onClick={() => isEditing ? saveUpdates() : setIsEditing(true)}
          className={`flex items-center px-4 py-2 rounded-lg ${
            isEditing 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isEditing ? (
            <>
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit3 className="h-5 w-5 mr-2" />
              Edit Patient Details
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl font-medium text-gray-600">
                {patient?.name?.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{patient?.name}</h2>
              <p className="text-gray-500">{patient?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Current Stage</h3>
              <p className="mt-1 text-gray-900">{patient?.currentStage || 'Initial Assessment'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Treatment Start Date</h3>
              <p className="mt-1 text-gray-900">
                {new Date(patient?.treatmentStartDate || Date.now()).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p className="mt-1 text-gray-900">{patient?.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Treatment Progress</h3>
            <WellnessTrend feedbackData={sessions.map(s => ({
              session: new Date(s.date).toLocaleDateString(),
              wellness: s.feedback?.wellness || 0,
              energy: s.feedback?.energy || 0,
              sleep: s.feedback?.sleep || 0
            }))} />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Practitioner Notes</h3>
            {isEditing ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add your notes about the patient's progress..."
              />
            ) : (
              <p className="text-gray-600">
                {notes || 'No notes added yet.'}
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recommendations</h3>
              <div className="flex items-center text-yellow-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">Will be visible to patient</span>
              </div>
            </div>
            {isEditing ? (
              <textarea
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add recommendations for the patient..."
              />
            ) : (
              <p className="text-gray-600">
                {recommendations || 'No recommendations added yet.'}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <RecoveryMilestones sessionData={sessions} />
      </div>
    </div>
  );
};

export default PatientDetail;