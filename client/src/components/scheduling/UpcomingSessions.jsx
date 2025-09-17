import React, { useState } from "react";
import { Clock, Edit3, Droplets } from "lucide-react";

import React, { useState } from "react";
import { Clock, Edit3, Droplets } from "lucide-react";

const UpcomingSessions = ({ therapySessions, userType, userId, onSessionUpdated }) => {
  const upcomingSessions = therapySessions.filter(
    (session) => session.status !== "completed"
  );
  const [editSession, setEditSession] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEditClick = (session) => {
    setEditSession(session);
    setEditDate(session.date);
    setEditTime(session.startTime || session.time);
    setError("");
  };

  const handleEditSave = async () => {
    if (!editDate || !editTime) {
      setError("Please select date and time");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/sessions/edit/${editSession._id || editSession.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            date: editDate, 
            startTime: editTime,
            userId,
            userType
          })
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.msg || "Failed to update session");
      } else {
        alert("Session rescheduled successfully!");
        setEditSession(null);
        if (onSessionUpdated) onSessionUpdated();
      }
    } catch (err) {
      setError("Server error");
    }
  };

  const handleDeleteClick = (session) => {
    setEditSession(session);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/sessions/delete/${editSession._id || editSession.id}?userId=${userId}&userType=${userType}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.msg || "Failed to delete session");
      } else {
        alert("Session cancelled successfully!");
        setShowDeleteConfirm(false);
        setEditSession(null);
        if (onSessionUpdated) onSessionUpdated();
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Clock className="h-5 w-5 mr-2 text-blue-600" />
        Upcoming Sessions
      </h3>
      <div className="space-y-4">
        {upcomingSessions.map((session) => (
          <div
            key={session._id || session.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Droplets className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{session.sessionName || session.name}</h4>
                <p className="text-sm text-gray-600">
                  {session.date} at {session.startTime || session.time}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Progress</p>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-blue-500 h-1 rounded-full"
                      style={{ width: `${session.progress || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">
                    {session.progress || 0}%
                  </span>
                </div>
              </div>
              {(userType === "practitioner" || userType === "patient") && (
                <div className="flex items-center space-x-2">
                  <button
                    className="p-2 text-gray-400 hover:text-blue-600"
                    onClick={() => handleEditClick(session)}
                    title="Reschedule session"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-red-600"
                    onClick={() => handleDeleteClick(session)}
                    title="Cancel session"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editSession && !showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h4 className="text-lg font-semibold mb-2">Reschedule Session</h4>
            <div className="mb-2">
              <label className="block text-sm mb-1">Date</label>
              <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="w-full border rounded px-2 py-1" />
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">Time</label>
              <input type="time" value={editTime} onChange={e => setEditTime(e.target.value)} className="w-full border rounded px-2 py-1" />
            </div>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <div className="flex justify-end space-x-2 mt-4">
              <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setEditSession(null)}>Cancel</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={handleEditSave}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h4 className="text-lg font-semibold mb-2">Cancel Session</h4>
            <p className="text-gray-600 mb-4">Are you sure you want to cancel this session?</p>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <div className="flex justify-end space-x-2">
              <button 
                className="px-3 py-1 bg-gray-200 rounded" 
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setEditSession(null);
                }}
              >
                No, Keep
              </button>
              <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={handleDeleteConfirm}>
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ...existing code...
