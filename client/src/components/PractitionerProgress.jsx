import React, { useState, useEffect, useRef } from 'react';
import { User, Edit3, Save, X, Calendar, TrendingUp, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext.jsx';

const PractitionerProgress = ({ user }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const hasFetched = useRef(false);
  const { showToast } = useToast();

  // Form state for editing patient progress
  const [formData, setFormData] = useState({
    progress: 0,
    currentStage: 'Initial Assessment',
    status: 'pending',
    notes: '',
    recommendations: '',
    nextSessionDate: '',
    wellnessScore: 0
  });

  const stages = [
    'Initial Assessment',
    'Pre-Therapy Preparation',
    'Therapy Phase 1',
    'Therapy Phase 2',
    'Therapy Phase 3',
    'Post-Therapy Recovery',
    'Maintenance Phase',
    'Completed'
  ];

  const statuses = [
    { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
    { value: 'in-progress', label: 'In Progress', color: 'text-blue-600' },
    { value: 'improving', label: 'Improving', color: 'text-green-600' },
    { value: 'stable', label: 'Stable', color: 'text-gray-600' },
    { value: 'completed', label: 'Completed', color: 'text-green-800' }
  ];

  useEffect(() => {
    if (user?.userType === 'practitioner') {
      // Always fetch patients when component mounts or user changes
      setSelectedPatient(null);
      setEditingPatient(null);
      hasFetched.current = false; // Reset fetch flag
      fetchPatients();
    }
  }, [user]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        showToast('Please login again', 'error');
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/progress/patients', {
        method: 'GET',
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPatients(data.patients || []);
        hasFetched.current = true; // Mark as fetched
      } else {
        const errorText = await response.text();
        showToast(`Failed to fetch patients: ${response.status}`, 'error');
        setPatients([]);
      }
    } catch (error) {
      showToast(`Error fetching patients: ${error.message}`, 'error');
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientDetails = async (patientId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/progress/patient/${patientId}`, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedPatient(data.patient);
        setFormData({
          progress: data.patient.progress || 0,
          currentStage: data.patient.currentStage || 'Initial Assessment',
          status: data.patient.status || 'pending',
          notes: '',
          recommendations: '',
          nextSessionDate: '',
          wellnessScore: data.patient.wellnessScore || 0
        });
      } else {
        showToast('Failed to fetch patient details', 'error');
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
      showToast('Error fetching patient details', 'error');
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    fetchPatientDetails(patient._id);
  };

  const handleSave = async () => {
    if (!editingPatient) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/progress/patient/${editingPatient._id}`, {
        method: 'PUT',
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showToast('Progress updated successfully', 'success');
        setEditingPatient(null);
        setSelectedPatient(null);
        fetchPatients(); // Refresh the list
      } else {
        showToast('Failed to update progress', 'error');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      showToast('Error updating progress', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingPatient(null);
    setSelectedPatient(null);
    setFormData({
      progress: 0,
      currentStage: 'Initial Assessment',
      status: 'pending',
      notes: '',
      recommendations: '',
      nextSessionDate: '',
      wellnessScore: 0
    });
  };


  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj ? statusObj.color : 'text-gray-600';
  };

  // If we have a practitioner user but no patients data and not loading, fetch it
  if (user?.userType === 'practitioner' && patients.length === 0 && !loading && !hasFetched.current) {
    fetchPatients();
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-ayurveda-chandana/20 via-ayurveda-haldi/10 to-ayurveda-kumkum/20 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-ayurveda-kumkum/20">
          <h1 className="text-3xl font-display text-dosha-kapha mb-6 flex items-center">
            <TrendingUp className="w-8 h-8 mr-3" />
            Patient Progress Management
          </h1>

          {patients.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Patients Assigned</h3>
              <p className="text-gray-500">Patients will appear here once they assign themselves to you.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patients List */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Patients</h2>
                {patients.map((patient) => (
                  <div
                    key={patient._id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPatient?._id === patient._id
                        ? 'border-ayurveda-kumkum bg-ayurveda-kumkum/10'
                        : 'border-gray-200 hover:border-ayurveda-kumkum/50'
                    }`}
                    onClick={() => fetchPatientDetails(patient._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-500" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                          <p className="text-sm text-gray-600">{patient.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(patient);
                        }}
                        className="p-2 text-ayurveda-kumkum hover:bg-ayurveda-kumkum/10 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className={`text-sm font-medium ${getStatusColor(patient.status)}`}>
                          {getStatusIcon(patient.status)}
                          <span className="ml-1">{statuses.find(s => s.value === patient.status)?.label}</span>
                        </span>
                        <span className="text-sm text-gray-600">
                          {patient.progress}% Complete
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {patient.currentStage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Patient Details & Edit Form */}
              <div className="space-y-4">
                {selectedPatient ? (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      {editingPatient ? 'Edit Progress' : 'Patient Details'}
                    </h2>
                    
                    {editingPatient ? (
                      <div className="space-y-4">
                        {/* Progress Percentage */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Progress Percentage
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={formData.progress}
                            onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-600 mt-1">
                            <span>0%</span>
                            <span className="font-semibold">{formData.progress}%</span>
                            <span>100%</span>
                          </div>
                        </div>

                        {/* Current Stage */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Stage
                          </label>
                          <select
                            value={formData.currentStage}
                            onChange={(e) => setFormData({ ...formData, currentStage: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-kumkum focus:border-transparent"
                          >
                            {stages.map((stage) => (
                              <option key={stage} value={stage}>{stage}</option>
                            ))}
                          </select>
                        </div>

                        {/* Status */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                          </label>
        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-kumkum focus:border-transparent"
                          >
                            {statuses.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
          ))}
        </select>
      </div>

                        {/* Wellness Score */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Wellness Score (1-10)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={formData.wellnessScore}
                            onChange={(e) => setFormData({ ...formData, wellnessScore: parseInt(e.target.value) })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-kumkum focus:border-transparent"
                          />
                        </div>

                        {/* Next Session Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Next Session Date
                          </label>
                          <input
                            type="date"
                            value={formData.nextSessionDate}
                            onChange={(e) => setFormData({ ...formData, nextSessionDate: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-kumkum focus:border-transparent"
                          />
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes
                          </label>
                          <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-kumkum focus:border-transparent"
                            placeholder="Add notes about the patient's progress..."
                          />
                        </div>

                        {/* Recommendations */}
              <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Recommendations
                          </label>
                          <textarea
                            value={formData.recommendations}
                            onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayurveda-kumkum focus:border-transparent"
                            placeholder="Add recommendations for the patient..."
                          />
              </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-4">
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center px-4 py-2 bg-ayurveda-kumkum text-white rounded-lg hover:bg-ayurveda-kumkum/90 disabled:opacity-50 transition-colors"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? 'Saving...' : 'Save Progress'}
                          </button>
                          <button
                            onClick={handleCancel}
                            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </button>
                </div>
              </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-gray-900 mb-2">Current Status</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Progress:</span>
                              <span className="font-semibold">{selectedPatient.progress}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Stage:</span>
                              <span className="font-semibold">{selectedPatient.currentStage}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <span className={`font-semibold ${getStatusColor(selectedPatient.status)}`}>
                                {statuses.find(s => s.value === selectedPatient.status)?.label}
                              </span>
                            </div>
                            {selectedPatient.wellnessScore && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Wellness Score:</span>
                                <span className="font-semibold">{selectedPatient.wellnessScore}/10</span>
                              </div>
                            )}
            </div>
          </div>

                        {selectedPatient.progressHistory && selectedPatient.progressHistory.length > 0 && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-2">Progress History</h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {selectedPatient.progressHistory.slice(-5).reverse().map((entry, index) => (
                                <div key={index} className="text-sm border-l-2 border-ayurveda-kumkum pl-3">
                                  <div className="font-medium">{entry.stage}</div>
                                  <div className="text-gray-600">
                                    {entry.progress}% - {statuses.find(s => s.value === entry.status)?.label}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(entry.date).toLocaleDateString()} by {entry.updatedByName}
                                  </div>
                                  {entry.notes && (
                                    <div className="text-xs text-gray-600 mt-1">{entry.notes}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Patient</h3>
                    <p className="text-gray-500">Choose a patient from the list to view and edit their progress.</p>
                  </div>
                )}
              </div>
          </div>
      )}

        </div>
      </div>
    </div>
  );
};

export default PractitionerProgress;