const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: function () {
        try {
          const email = this && this.email ? String(this.email) : "";
          if (email) {
            const local = email.split("@")[0] || "user";
            return local
              .replace(/[._-]+/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());
          }
        } catch (e) {}
        return "User";
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Password required only if not OAuth user
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
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
      ref: "User",
      // Make this optional to allow patient signup without assigning a practitioner immediately
    },
    status: {
      type: String,
      enum: ["active", "completed", "pending", "inactive"],
      default: "pending",
    },
    currentStage: {
      type: String,
      enum: [
        "Initial Assessment",
        "Treatment Phase",
        "Mid-therapy Assessment",
        "Advanced Treatment",
        "Final Assessment",
      ],
      default: "Initial Assessment",
    },
    treatmentStartDate: {
      type: Date,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    wellnessScore: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    nextSessionDate: {
      type: Date,
    },
    progressHistory: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        progress: {
          type: Number,
          min: 0,
          max: 100,
        },
        stage: String,
        status: String,
        notes: String,
        recommendations: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        updatedByName: String,
      },
    ],
    practitionerNotes: {
      type: String,
    },
    recommendations: {
      type: String,
    },
    medicalHistory: {
      conditions: [String],
      medications: [String],
      allergies: [String],
      previousTreatments: [String],
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: "India",
      },
    },
    caregiverPhone: {
      type: String,
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    personalDetails: {
      dateOfBirth: Date,
      gender: {
        type: String,
        enum: ["male", "female", "other", "prefer_not_to_say"],
      },
      bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"],
      },
    },
    // Practitioner-specific fields
    licenseNumber: {
      type: String,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    verificationRequest: {
      submittedAt: Date,
      licenseNumber: String,
      additionalDocuments: String,
      adminNotes: String,
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      reviewedAt: Date,
    },
    // Practitioner location and availability
    practiceLocation: {
      address: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: "India",
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    practiceAreas: [String], // e.g., ['Vamana', 'Virechana', 'Basti']
    consultationFee: {
      type: Number,
      default: 0,
    },
    availableForNewPatients: {
      type: Boolean,
      default: true,
    },
    bio: String,
    experience: {
      type: Number, // years of experience
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Safety net: ensure `name` is always set before validation
UserSchema.pre("validate", function (next) {
  try {
    if (!this.name || String(this.name).trim().length === 0) {
      const email = this.email || "";
      let derived = "";
      if (email) {
        const local = String(email).split("@")[0] || "user";
        derived = local
          .replace(/[._-]+/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }
      this.name = derived || "User";
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", UserSchema);
