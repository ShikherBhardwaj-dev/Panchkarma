const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  userType: {
    type: String,
    enum: ["patient", "practitioner"],
    default: "patient",
  },
  assignedPractitioner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.userType === 'patient';
    }
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'pending', 'inactive'],
    default: 'pending'
  },
  currentStage: {
    type: String,
    enum: ['Initial Assessment', 'Treatment Phase', 'Mid-therapy Assessment', 'Advanced Treatment', 'Final Assessment'],
    default: 'Initial Assessment'
  },
  treatmentStartDate: {
    type: Date,
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  practitionerNotes: {
    type: String
  },
  recommendations: {
    type: String
  },
  medicalHistory: {
    conditions: [String],
    medications: [String],
    allergies: [String],
    previousTreatments: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", UserSchema);

