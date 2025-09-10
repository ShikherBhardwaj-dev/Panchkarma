import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TherapyScheduling = ({ userRole, user }) => {
  const [date, setDate] = useState(new Date());
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const timeOptions = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const fetchAvailableSlots = async () => {
    try {
      const res = await axios.get("http://localhost:5000/therapy/available");
      setAvailableSlots(res.data);
    } catch (err) {
      console.error("Error fetching available slots:", err);
    }
  };

  const fetchMySlots = async () => {
    if (!user?.email) return;

    try {
      if (userRole === "patient") {
        const res = await axios.get(
          `http://localhost:5000/therapy/my-slots/${user.email}`
        );
        setMySlots(res.data);
      } else {
        const res = await axios.get(
          `http://localhost:5000/therapy/practitioner-slots/${user.email}`
        );
        setMySlots(res.data);
      }
    } catch (err) {
      console.error("Error fetching my slots:", err);
    }
  };

  useEffect(() => {
    if (userRole === "patient") {
      fetchAvailableSlots();
      fetchMySlots();
    } else if (userRole === "practitioner") {
      fetchMySlots();
    }
  }, [userRole, user]);

  const handleCreateSlots = async () => {
    if (selectedTimes.length === 0) {
      alert("Please select at least one time slot");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/therapy/create", {
        practitioner: user.email,
        date: date.toISOString().split("T")[0],
        times: selectedTimes,
      });

      alert("Slots created successfully");
      setSelectedTimes([]);
      fetchMySlots();
    } catch (err) {
      console.error("Error creating slots:", err);
      alert("Error creating slots");
    }
    setLoading(false);
  };

  const handleBookSlot = async (slotId) => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:5000/therapy/book/${slotId}`, {
        patientEmail: user.email,
      });

      alert("Slot booked successfully");
      fetchAvailableSlots();
      fetchMySlots();
    } catch (err) {
      console.error("Error booking slot:", err);
      alert("Error booking slot");
    }
    setLoading(false);
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/therapy/delete/${slotId}`);
      alert("Slot deleted successfully");
      fetchMySlots();
    } catch (err) {
      console.error("Error deleting slot:", err);
      alert("Error deleting slot");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {userRole === "practitioner" && (
        <>
          <h2 className="text-xl font-semibold mb-4">Create Therapy Slots</h2>
          <div className="flex flex-col space-y-4">
            <DatePicker
              selected={date}
              onChange={(d) => setDate(d)}
              dateFormat="yyyy-MM-dd"
              className="border p-2 rounded w-full"
            />

            <div className="grid grid-cols-2 gap-2">
              {timeOptions.map((time) => (
                <label key={time} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={time}
                    checked={selectedTimes.includes(time)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTimes([...selectedTimes, time]);
                      } else {
                        setSelectedTimes(
                          selectedTimes.filter((t) => t !== time)
                        );
                      }
                    }}
                  />
                  <span>{time}</span>
                </label>
              ))}
            </div>

            <button
              onClick={handleCreateSlots}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Creating..." : "Add Slots"}
            </button>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">My Slots</h2>
          <ul className="space-y-2">
            {mySlots.map((slot) => (
              <li
                key={slot._id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <span>
                  {slot.date} - {slot.time}{" "}
                  {slot.isBooked
                    ? `(Booked by ${slot.patient?.name || slot.patient?.email || "Unknown"})`
                    : "(Available)"}
                </span>
                {!slot.isBooked && (
                  <button
                    onClick={() => handleDeleteSlot(slot._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {userRole === "patient" && (
        <>
          <h2 className="text-xl font-semibold mb-4">Available Slots</h2>
          <ul className="space-y-2">
            {availableSlots.map((slot) => (
              <li
                key={slot._id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <span>
                  {slot.date} - {slot.time} with{" "}
                  {slot.practitioner?.name || slot.practitioner?.email || "Unknown"}
                </span>
                <button
                  onClick={() => handleBookSlot(slot._id)}
                  disabled={loading}
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Book
                </button>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">My Booked Slots</h2>
          <ul className="space-y-2">
            {mySlots.map((slot) => (
              <li
                key={slot._id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <span>
                  {slot.date} - {slot.time} with{" "}
                  {slot.practitioner?.name || slot.practitioner?.email || "Unknown"}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TherapyScheduling;
