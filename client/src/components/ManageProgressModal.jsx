import React, { useState, useEffect } from 'react';
import authFetch from '../utils/apiClient';
import { useToast } from '../contexts/ToastContext.jsx';

const TREATMENT_STAGES = [
  'Initial Assessment',
  'Purvakarma (Pre-treatment)',
  'Treatment Phase',
  'Post-treatment Care',
  'Follow-up'
];

const ManageProgressModal = ({ open, onClose, patient, onSaved }) => {
  const toast = useToast();
  const [progress, setProgress] = useState(patient?.progress || 0);
  const [milestones, setMilestones] = useState('');
  const [notes, setNotes] = useState('');
  const [practitionerNotes, setPractitionerNotes] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [currentStage, setCurrentStage] = useState('Initial Assessment');
  const [nextAppointment, setNextAppointment] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (patient) {
      setProgress(patient.progress || 0);
      setRecommendations(patient.recommendations || '');
      setNotes(patient.notes || '');
      setPractitionerNotes(patient.practitionerNotes || '');
      setCurrentStage(patient.currentStage || 'Initial Assessment');
      setNextAppointment(patient.nextAppointment || '');
      setMilestones(patient.milestones || '');
    }
  }, [patient]);

  if (!open) return null;

  const save = async () => {
    try {
      if (progress < 0 || progress > 100) {
        toast.show({
          title: 'Invalid Progress',
          message: 'Progress must be between 0 and 100',
          type: 'error'
        });
        return;
      }

      setSaving(true);
      const res = await authFetch(`/api/practitioner/patients/${patient._id}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progress,
          milestones,
          notes,
          practitionerNotes,
          recommendations,
          currentStage,
          nextAppointment
        })
      });
      
      const data = await res.json().catch(() => null);
      if (res.ok && data && data.success) {
        toast.show({
          title: 'Success',
          message: 'Progress updated successfully',
          type: 'success'
        });
        onSaved && onSaved(data.patient);
        onClose();
      } else {
        const txt = data && data.message ? data.message : 'Failed to save progress';
        toast.show({
          title: 'Error',
          message: txt,
          type: 'error'
        });
      }
    } catch (err) {
      console.error('Save progress failed', err);
      toast.show({
        title: 'Error',
        message: 'Failed to save progress. Please try again.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Manage Patient Progress</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            {/* Progress Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Overall Progress (%)</label>
              <div className="relative mt-1">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="block w-full pl-3 pr-12 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
            </div>

            {/* Treatment Stage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Treatment Stage</label>
              <select
                value={currentStage}
                onChange={(e) => setCurrentStage(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                {TREATMENT_STAGES.map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            {/* Next Appointment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Appointment</label>
              <input
                type="datetime-local"
                value={nextAppointment}
                onChange={(e) => setNextAppointment(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            {/* Milestones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Milestones</label>
              <textarea
                value={milestones}
                onChange={(e) => setMilestones(e.target.value)}
                rows={3}
                className="shadow-sm focus:ring-green-500 focus:border-green-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                placeholder="List key treatment milestones..."
              />
            </div>

            {/* Notes for Patient */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes for Patient</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="shadow-sm focus:ring-green-500 focus:border-green-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                placeholder="Notes visible to patient..."
              />
            </div>
          </div>
        </div>

        {/* Full Width Sections */}
        <div className="mt-4 space-y-4">
          {/* Private Practitioner Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Private Practitioner Notes
              <span className="text-xs text-gray-500 ml-2">(Not visible to patient)</span>
            </label>
            <textarea
              value={practitionerNotes}
              onChange={(e) => setPractitionerNotes(e.target.value)}
              rows={3}
              className="shadow-sm focus:ring-green-500 focus:border-green-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="Private notes for practitioner reference..."
            />
          </div>

          {/* Recommendations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Recommendations</label>
            <textarea
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              rows={3}
              className="shadow-sm focus:ring-green-500 focus:border-green-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="Treatment recommendations and guidelines..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${saving ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageProgressModal;
