const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    leaveId: {
      type: String,
      unique: true,
      trim: true,
    },

    // Ownership: who applied. Students link to their
    // Student record; teachers link to their Teacher record.
    applicantRole: {
      type: String,
      enum: ["student", "teacher"],
      default: "student",
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },

    teacherId: {
      type: String,
      default: "",
      trim: true,
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    admissionNo: {
      type: String,
      default: "",
      trim: true,
    },

    // Class applies to student leaves. Teachers have
    // no class — the apply controller leaves it empty
    // for teacher applications.
    className: {
      type: String,
      default: "",
      trim: true,
    },

    section: {
      type: String,
      trim: true,
    },

    rollNo: {
      type: String,
      default: "",
      trim: true,
    },

    fromDate: {
      type: Date,
      required: true,
    },

    toDate: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    reviewedBy: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Leave", leaveSchema);
