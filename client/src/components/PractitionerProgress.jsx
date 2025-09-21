import React, { useEffect, useState } from 'react';
import ManageProgressModal from './ManageProgressModal';
import ManageSessionModal from './ManageSessionModal';
import authFetch from '../utils/apiClient';
import { useToast } from '../contexts/ToastContext.jsx';

const PractitionerProgress = ({ practitionerId, patients = [] }) => {
  const toast = useToast();
  const [patientList, setPatientList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  useEffect(() => {
    // Build unique patient list from provided patients (which may be session objects)
    const unique = [];
    const ids = new Set();
    (patients || []).forEach(p => {
      const pat = p.patient || p; // sometimes passed as session wrapper
      if (pat && pat._id && !ids.has(pat._id)) {
        ids.add(pat._id);
        unique.push(pat);
      }
    });
    setPatientList(unique);
  }, [patients]);

  useEffect(() => {
    if (selectedPatient) fetchSessions(selectedPatient);
  }, [selectedPatient]);

  const fetchSessions = async (patient) => {
    try {
      setLoading(true);
      // Use existing sessions API which accepts userId as patient email
      const res = await authFetch(`/api/sessions?userId=${encodeURIComponent(patient.email)}`);
      const data = await res.json();
      setSessions(data || []);
    } catch (err) {
      console.error('Failed fetching patient sessions', err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (session) => {
    try {
      const newStatus = session.status === 'completed' ? 'scheduled' : 'completed';

      // Optimistic UI update: update local sessions array immediately for instant feedback
      setSessions(prev => prev.map(s => s._id === session._id ? { ...s, status: newStatus } : s));

      const res = await authFetch(`/api/sessions/${session._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ msg: 'Unknown error' }));
        throw new Error(err.msg || 'Failed to update session status');
      }
      // refresh sessions and patient progress
      await fetchSessions(selectedPatient);
      // refresh patient object from server
      const pRes = await authFetch(`/api/practitioner/patients/${selectedPatient._id}`);
      if (pRes.ok) {
        const pData = await pRes.json();
        if (pData && pData.patient) onSaved(pData.patient);
      }
      // Show success toast
      toast.show({ title: 'Session updated', message: `Session marked ${newStatus}`, duration: 3000 });
    } catch (err) {
      console.error('Failed updating session status', err);
      // Revert optimistic update on failure
      setSessions(prev => prev.map(s => s._id === session._id ? { ...s, status: session.status } : s));
      toast.show({ title: 'Update failed', message: 'Could not update session status. See console for details.', duration: 5000 });
    }
  };

  const onSaved = (updatedPatient) => {
    // Update patient in the local patient list and selectedPatient if needed
    setPatientList(prev => prev.map(p => (p._id === updatedPatient._id ? updatedPatient : p)));
    if (selectedPatient && selectedPatient._id === updatedPatient._id) {
      setSelectedPatient(updatedPatient);
    }
  };

  const sessionsArr = Array.isArray(sessions) ? sessions : [];
  const completedCount = sessionsArr.filter(s => (String(s.status || '').toLowerCase() === 'completed')).length;
  const totalCount = sessionsArr.length;
  const progressPct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <>
    <div className="bg-white p-4 rounded-lg shadow border">

      <h3 className="text-md font-semibold text-gray-700 mb-3">Progress Tracking</h3>

      <div className="mb-4">
        <label className="text-sm text-gray-600">Select patient</label>
        <select
          value={selectedPatient?._id || ''}
          onChange={(e) => {
            const id = e.target.value;
            const p = patientList.find(x => x._id === id);
            setSelectedPatient(p || null);
            setSessions([]);
          }}
          className="mt-1 block w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none"
        >
          <option value="">-- choose patient --</option>
          {patientList.map(p => (
            <option key={p._id} value={p._id}>{p.name} — {p.email}</option>
          ))}
        </select>
      </div>

      {selectedPatient && (
        <>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm text-gray-500">Progress</div>
                <div className="text-lg font-semibold">{progressPct}%</div>
              </div>
              <div style={{ width: 120 }}>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-green-500 h-4 rounded-full" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500">{completedCount} of {totalCount} sessions completed</div>
          </div>

          <div className="mb-4">
            <button onClick={() => setModalOpen(true)} className="px-3 py-2 bg-primary-600 text-white rounded-md">Manage Progress</button>
          </div>

          <div className="mb-2">
            <h4 className="text-sm font-medium text-gray-700">Sessions</h4>
            {loading && <div className="text-sm text-gray-500">Loading sessions...</div>}
            {!loading && sessionsArr.length === 0 && <div className="text-xs text-gray-500">No sessions found for this patient.</div>}
            <ul className="space-y-2 mt-2">
              {sessionsArr.map(s => (
                <li key={s._id} className="border p-2 rounded-md flex items-center justify-between">
                  <div>
                    <div className="font-medium">{s.sessionName}</div>
                    <div className="text-xs text-gray-500">{new Date(s.date).toLocaleDateString()} {s.startTime || ''}</div>
                  </div>
                    <div className="flex items-center space-x-3">
                    <div className={`px-2 py-1 rounded-full text-xs ${String(s.status||'').toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>{s.status}</div>
                    <button onClick={() => toggleComplete(s)} className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm">{String(s.status||'').toLowerCase() === 'completed' ? 'Mark Incomplete' : 'Mark Completed'}</button>
                    <button onClick={() => { setEditingSession(s); setSessionModalOpen(true); }} className="px-3 py-1 border rounded-md text-sm">Edit</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  {/* Manage progress modal */}
  <ManageProgressModal open={modalOpen} onClose={() => setModalOpen(false)} patient={selectedPatient} onSaved={onSaved} />
  <ManageSessionModal open={sessionModalOpen} onClose={() => setSessionModalOpen(false)} session={editingSession} onSaved={async () => { await fetchSessions(selectedPatient); setSessionModalOpen(false); }} />
    </>
  );
};

export default PractitionerProgress;
