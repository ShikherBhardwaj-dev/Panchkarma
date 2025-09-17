import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Clock, Calendar, AlertCircle, CheckCircle, XCircle } from "lucide-react";

const TherapyScheduling = ({ userRole, user }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [therapyType, setTherapyType] = useState("Virechana");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const therapyOptions = ["Virechana", "Vamana"];

  // -------------------- Fetch User's Sessions --------------------
  const fetchSessions = async () => {
    if (!user || !user.email) return;
    try {
      const res = await axios.get("http://localhost:5000/sessions", {
        params: { userId: user.email, role: userRole },
      });
      setSessions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setSessions([]);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  // -------------------- Generate Therapy Schedule --------------------
  const handleGenerateSchedule = async () => {
    if (!therapyType || !startDate) {
      alert("Please select therapy type and start date");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/sessions", {
        patientId: user.email,
        therapyType,
        startDate: startDate.toISOString().split("T")[0],
      });
      alert("Therapy schedule generated successfully!");
      fetchSessions();
    } catch (err) {
      console.error("Error generating schedule:", err);
      alert("Failed to generate schedule");
    }
    setLoading(false);
  };

  // -------------------- Render --------------------
  if (!user || !user.email) {
    return <div className="p-6 text-gray-600">Loading user info...</div>;
  }

  const safeSessions = Array.isArray(sessions) ? sessions : [];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* -------------------- Generate Schedule -------------------- */}
      {userRole === "patient" && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Generate Panchakarma Schedule</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select
              value={therapyType}
              onChange={(e) => setTherapyType(e.target.value)}
              className="border rounded p-2 w-full"
            >
              {therapyOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <DatePicker
              selected={startDate}
              onChange={(d) => setStartDate(d)}
              dateFormat="yyyy-MM-dd"
              className="border rounded p-2 w-full"
            />

            <button
              onClick={handleGenerateSchedule}
              disabled={loading}
              className="bg-green-600 text-white rounded p-2 w-full hover:bg-green-700"
            >
              {loading ? "Generating..." : "Generate Schedule"}
            </button>
          </div>
        </div>
      )}

      {/* -------------------- My Sessions -------------------- */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">My Therapy Sessions</h2>
      {safeSessions.length === 0 ? (
        <p className="text-gray-600">No sessions scheduled yet.</p>
      ) : (
        <ul className="space-y-3">
          {safeSessions.map((s) => (
            <li
              key={s._id}
              className="border p-4 rounded shadow flex flex-col md:flex-row md:justify-between md:items-center"
            >
              <div>
                <span className="font-semibold text-gray-800">{s.sessionName}</span>{" "}
                <span className="text-sm text-gray-500">({s.phase})</span>
                <div className="text-gray-600 text-sm">
                  Date: {s.date} | Time: {s.startTime} | Status: {s.status}
                  {s.notes && ` | Notes: ${s.notes}`}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TherapyScheduling;

