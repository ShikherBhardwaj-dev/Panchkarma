import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PractitionerProgress = ({ practitionerId, patients = [] }) => {
  const [patientList, setPatientList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

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
      const res = await axios.get(`http://localhost:5000/sessions?userId=${encodeURIComponent(patient.email)}`);
      setSessions(res.data || []);
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
      await axios.put(`http://localhost:5000/sessions/${session._id}`, { status: newStatus, userType: 'practitioner' });
      // refresh
      fetchSessions(selectedPatient);
    } catch (err) {
      console.error('Failed updating session status', err);
      alert('Failed updating session. See console for details.');
    }
  };

  const sessionsArr = Array.isArray(sessions) ? sessions : [];
  const completedCount = sessionsArr.filter(s => (String(s.status || '').toLowerCase() === 'completed')).length;
  const totalCount = sessionsArr.length;
  const progressPct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
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
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default PractitionerProgress;
