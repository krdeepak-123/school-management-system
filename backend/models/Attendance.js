const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    // ==============================
    // Attendance ID
    // ==============================
    attendanceId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    // ==============================
    // Student Name
    // ==============================
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    // ==============================
    // Class
    // ==============================
    className: {
      type: String,
      required: true,
      trim: true,
    },

    // ==============================
    // Section
    // ==============================
    section: {
      type: String,
      required: true,
      trim: true,
    },

    // ==============================
    // Roll Number
    // ==============================
    rollNo: {
      type: String,
      required: true,
      trim: true,
    },

    // ==============================
    // Date
    // ==============================
    date: {
      type: Date,
      required: true,
    },

    // ==============================
    // Status
    // ==============================
    status: {
      type: String,
      enum: ["Present", "Absent", "Late"],
      default: "Present",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);