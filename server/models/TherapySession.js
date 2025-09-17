const mongoose = require("mongoose");

const TherapySessionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  practitioner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  therapyType: { type: String, required: true },
  phase: { type: String, required: true },
  sessionName: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, default: "10:00" },
  status: { 
    type: String, 
    enum: ['scheduled', 'completed', 'cancelled', 'in-progress'],
    default: "scheduled" 
  },
  notes: { type: String },
  practitionerNotes: {
    progress: { type: String },
    sessionNotes: { type: String },
    followUp: { type: String }
  },
  feedback: {
    wellness: { type: Number, min: 0, max: 10 },
    energy: { type: Number, min: 0, max: 10 },
    sleep: { type: Number, min: 0, max: 10 },
    symptoms: [String],
    comments: { type: String }
  },
  recommendations: { type: String },
  precautions: [String],
  metrics: {
    bloodPressure: String,
    pulse: Number,
    weight: Number,
    temperature: Number
  },
  cancelled: { type: Boolean, default: false },
  cancelledReason: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model("TherapySession", TherapySessionSchema);



