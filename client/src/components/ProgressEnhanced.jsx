import React, { useState, useEffect } from "react";
import ProgressOverviewCards from "./Progress/ProgressOverviewCards";
import WellnessTrend from "./Progress/WellnessTrend";
import SessionFeedback from "./Progress/SessionFeedback";
import RecoveryMilestones from "./Progress/RecoveryMilestones";
import authFetch from '../utils/apiClient';

// Enhanced Progress component with practitioner editing functionality
const ProgressEnhanced = ({ patientProgress = [], feedbackData = [], user = null }) => {
  const [sessionData, setSessionData] = useState([]);
  const [localFeedback, setLocalFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  // Practitioner-only: list of patients
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingProgress, setEditingProgress] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [practitionerNotes, setPractitionerNotes] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [currentStage, setCurrentStage] = useState('Initial Assessment');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        // If user is a practitioner, fetch their patients
        if (user?.userType === 'practitioner') {
          console.log('Progress: User is practitioner, fetching patients');
          console.log('Progress: User data:', user);

          // Try the protected practitioner endpoint first using authFetch
          let res;
          try {
            res = await authFetch('/api/practitioner/patients');
            const responseData = await res.clone().json().catch(() => null);
            console.log('Progress: Patient fetch response:', {
              status: res.status,
              data: responseData
            });
          } catch (err) {
            console.error('authFetch error', err);
            res = null;
          }

          // If not authorized or no response, fall back to public list
          if (!res || res.status === 401 || res.status === 403) {
            try {
              const fbRes = await fetch('/auth/patients');
              const fallback = await fbRes.json();
              setPatients(Array.isArray(fallback) ? fallback : []);
            } catch (err) {
              console.error('Fallback patients fetch failed', err);
              setPatients([]);
            }
          } else {
            const data = await res.json().catch(() => null);
            if (data && data.success) setPatients(Array.isArray(data.patients) ? data.patients : []);
            else if (Array.isArray(data)) setPatients(data);
            else setPatients([]);
          }
        } else {
          // For patients, load own sessions
          const res = await fetch('/api/sessions/user');
          const data = await res.json();
          if (data.success) {
            setSessionData(data.sessions || []);
            setLocalFeedback(data.sessions
              .filter(s => s.feedback)
              .map(s => ({ session: new Date(s.date).toLocaleDateString(), wellness: s.feedback.wellness || 0, energy: s.feedback.energy || 0, sleep: s.feedback.sleep || 0 }))
            );
          }
        }
      } catch (err) {
        console.error('Progress init error', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user]);

  useEffect(() => {
    // when a practitioner selects a patient, fetch detailed patient info (sessions + progress)
    if (!selectedPatientId) {
      setSelectedPatient(null);
      setSessionData([]);
      setLocalFeedback([]);
      setProgressValue(0);
      setPractitionerNotes('');
      setRecommendations('');
      setCurrentStage('Initial Assessment');
      return;
    }

    const fetchPatient = async () => {
      try {
        setLoading(true);
        let res;
        try {
          res = await authFetch(`/api/practitioner/patients/${selectedPatientId}`);
        } catch (err) {
          console.error('authFetch failed', err);
          res = null;
        }

        if (!res || res.status === 401 || res.status === 403) {
          // fallback to public endpoint
          try {
            const fb = await fetch(`/auth/patients/${selectedPatientId}`);
            const data = await fb.json().catch(() => null);
            if (data) {
              setSelectedPatient(data.patient || data);
              setSessionData(data.sessions || []);
              setLocalFeedback((data.sessions || []).filter(s => s.feedback).map(s => ({ session: new Date(s.date).toLocaleDateString(), wellness: s.feedback.wellness || 0, energy: s.feedback.energy || 0, sleep: s.feedback.sleep || 0 })));
              setProgressValue((data.patient && data.patient.progress) || 0);
              setPractitionerNotes((data.patient && data.patient.practitionerNotes) || '');
              setRecommendations((data.patient && data.patient.recommendations) || '');
              setCurrentStage((data.patient && data.patient.currentStage) || 'Initial Assessment');
            } else {
              setSelectedPatient(null);
              setSessionData([]);
              setLocalFeedback([]);
            }
          } catch (err) {
            console.error('Fallback fetch patient failed', err);
            setSelectedPatient(null);
            setSessionData([]);
            setLocalFeedback([]);
          }
        } else {
          const data = await res.json().catch(() => null);
          if (data && data.success) {
            setSelectedPatient(data.patient);
            setSessionData(data.sessions || []);
            setLocalFeedback((data.sessions || []).filter(s => s.feedback).map(s => ({ session: new Date(s.date).toLocaleDateString(), wellness: s.feedback.wellness || 0, energy: s.feedback.energy || 0, sleep: s.feedback.sleep || 0 })));
            setProgressValue(data.patient.progress || 0);
            setPractitionerNotes(data.patient.practitionerNotes || '');
            setRecommendations(data.patient.recommendations || '');
            setCurrentStage(data.patient.currentStage || 'Initial Assessment');
          } else {
            setSelectedPatient(null);
            setSessionData([]);
            setLocalFeedback([]);
          }
        }
      } catch (err) {
        console.error('Failed loading patient details', err);
        setSelectedPatient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [selectedPatientId]);

  const saveProgress = async () => {
    if (!selectedPatientId) return;
    const value = Number(progressValue);
    if (isNaN(value) || value < 0 || value > 100) {
      alert('Progress must be a number between 0 and 100');
      return;
    }
    try {
      setSaving(true);
      let res;
      try {
        res = await authFetch(`/api/practitioner/patients/${selectedPatientId}/progress`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            progress: value,
            practitionerNotes,
            recommendations,
            currentStage
          })
        });
      } catch (err) {
        console.error('authFetch save failed', err);
        res = null;
      }

      if (!res || res.status === 401 || res.status === 403) {
        // try fallback
        try {
          res = await fetch(`/auth/patients/${selectedPatientId}/progress`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              progress: value,
              practitionerNotes,
              recommendations,
              currentStage
            })
          });
        } catch (err) {
          console.error('Fallback save failed', err);
          res = null;
        }
      }

      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.success) {
          setSelectedPatient(data.patient || (data.session ? data.session.patient : null));
          setEditingProgress(false);
          // re-fetch patient details to get saved progress (simpler)
          setSelectedPatientId(selectedPatientId);
        }
      } else {
        const txt = res ? await res.text().catch(() => null) : 'No response';
        console.error('Save progress failed', txt);
        alert('Failed saving progress');
      }
    } catch (err) {
      console.error('Save progress error', err);
      alert('Error saving progress');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Progress Tracking & Analytics</h2>
        <div className="flex items-center space-x-4">
          {/* For practitioners we show a patient selector instead of timeframe */}
          {user?.userType === 'practitioner' ? (
            <div className="flex items-center space-x-3">
              <select
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
              >
                <option value="">-- Select patient --</option>
                {Array.isArray(patients) && patients.map(p => (
                  <option key={p._id} value={p._id}>{p.name} — {p.email}</option>
                ))}
              </select>
              <div className="text-xs text-gray-500">{Array.isArray(patients) ? patients.length : 0} patients</div>
            </div>
          ) : (
            <select className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="all">
              <option value="all">All Time</option>
              <option value="month">Last Month</option>
              <option value="week">Last Week</option>
            </select>
          )}
        </div>
      </div>

      {/* Top overview cards (patient or aggregate) */}
      <ProgressOverviewCards sessionData={sessionData.length ? sessionData : patientProgress} />

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <WellnessTrend feedbackData={localFeedback.length ? localFeedback : feedbackData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SessionFeedback feedbackData={localFeedback.length ? localFeedback : feedbackData} />
        <RecoveryMilestones sessionData={sessionData.length ? sessionData : patientProgress} />
      </div>

      {/* Practitioner editing panel */}
      {user?.userType === 'practitioner' && selectedPatientId && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Edit Patient Progress
            </h3>
            <button
              onClick={() => setEditingProgress(!editingProgress)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {editingProgress ? 'Cancel' : 'Edit Progress'}
            </button>
          </div>

          {editingProgress && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress Percentage (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={progressValue}
                  onChange={(e) => setProgressValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Stage
                </label>
                <select
                  value={currentStage}
                  onChange={(e) => setCurrentStage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Initial Assessment">Initial Assessment</option>
                  <option value="Treatment Phase">Treatment Phase</option>
                  <option value="Mid-therapy Assessment">Mid-therapy Assessment</option>
                  <option value="Advanced Treatment">Advanced Treatment</option>
                  <option value="Final Assessment">Final Assessment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Practitioner Notes
                </label>
                <textarea
                  value={practitionerNotes}
                  onChange={(e) => setPractitionerNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add notes about patient progress..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recommendations
                </label>
                <textarea
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add treatment recommendations..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditingProgress(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProgress}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Progress'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressEnhanced;
