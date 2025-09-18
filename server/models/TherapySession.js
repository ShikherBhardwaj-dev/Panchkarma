const mongoose = require("mongoose");

const TherapySessionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // Practitioner may be assigned later; make optional to allow partial documents
  practitioner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  therapyType: { type: String, required: true },
  phase: { type: String, required: true },
  sessionName: { type: String, required: true },
  date: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(v) {
        // Skip date validation for cancelled sessions
        if (this.status === 'cancelled') {
          return true;
        }
        return v >= new Date(new Date().setHours(0, 0, 0, 0));
      },
      message: 'Session date cannot be in the past'
    }
  },
  startTime: { 
    type: String, 
    default: "10:00",
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Invalid time format. Use HH:MM format'
    }
  },
  status: { 
    type: String, 
    enum: {
      values: ['scheduled', 'completed', 'cancelled', 'in-progress'],
      message: props => `'${props.value}' is not a valid status. Must be one of: scheduled, completed, cancelled, in-progress`
    },
    default: 'scheduled',
    set: function(v) {
      if (typeof v !== 'string') {
        throw new Error('Status must be a string');
      }
      // Force lowercase and trim any whitespace
      const normalized = v.toLowerCase().trim();
      if (!['scheduled', 'completed', 'cancelled', 'in-progress'].includes(normalized)) {
        throw new Error(`'${v}' is not a valid status. Must be one of: scheduled, completed, cancelled, in-progress`);
      }
      return normalized;
    },
    get: function(v) {
      // Always return lowercase
      return v ? v.toLowerCase() : 'scheduled';
    }
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
  cancelledReason: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model("TherapySession", TherapySessionSchema);



