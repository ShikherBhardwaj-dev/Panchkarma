import React, { useState, useEffect } from 'react';
import authFetch from '../utils/apiClient';

const ManageSessionModal = ({ open, onClose, session, onSaved }) => {
  const [status, setStatus] = useState(session?.status || 'scheduled');
  const [sessionNotes, setSessionNotes] = useState(session?.practitionerNotes?.sessionNotes || '');
  const [progressNote, setProgressNote] = useState(session?.practitionerNotes?.progress || '');
  const [recommendations, setRecommendations] = useState(session?.recommendations || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session) {
      setStatus(session.status || 'scheduled');
      setSessionNotes(session.practitionerNotes?.sessionNotes || '');
      setProgressNote(session.practitionerNotes?.progress || '');
      setRecommendations(session.recommendations || '');
    }
  }, [session]);

  if (!open || !session) return null;

  const save = async () => {
    try {
      setSaving(true);

      // Update practitioner notes via practitioner route
      const notesRes = await authFetch(`/api/practitioner/sessions/${session._id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: sessionNotes, recommendations })
      });

      if (!notesRes.ok) {
        const err = await notesRes.json().catch(() => ({ message: 'Failed to save notes' }));
        throw new Error(err.message || 'Failed to save notes');
      }

      // Update status via practitioner-only status endpoint
      const statusRes = await authFetch(`/api/sessions/${session._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!statusRes.ok) {
        const err = await statusRes.json().catch(() => ({ msg: 'Failed to update status' }));
        throw new Error(err.msg || 'Failed to update status');
      }

      // Optionally update practitionerNotes.progress on the session via notes endpoint shape
      // (we already saved sessionNotes and recommendations above)

      // Notify parent to refresh
      onSaved && onSaved();
      onClose();
    } catch (err) {
      console.error('Failed saving session edits', err);
      alert(err.message || 'Failed to save session');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">Edit Session</h3>

        <div className="mb-3">
          <label className="text-sm text-gray-600">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full mt-1 p-2 border rounded">
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="text-sm text-gray-600">Practitioner Notes</label>
          <textarea value={sessionNotes} onChange={(e) => setSessionNotes(e.target.value)} className="w-full mt-1 p-2 border rounded" rows={4} />
        </div>

        <div className="mb-3">
          <label className="text-sm text-gray-600">Progress Note</label>
          <input value={progressNote} onChange={(e) => setProgressNote(e.target.value)} className="w-full mt-1 p-2 border rounded" />
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-600">Recommendations</label>
          <textarea value={recommendations} onChange={(e) => setRecommendations(e.target.value)} className="w-full mt-1 p-2 border rounded" rows={3} />
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button onClick={save} disabled={saving} className="px-4 py-2 rounded bg-blue-600 text-white">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
};

export default ManageSessionModal;
