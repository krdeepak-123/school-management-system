const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    examId: {
      type: String,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    className: {
      type: String,
      required: true,
      trim: true,
    },

    section: {
      type: String,
      trim: true,
    },

    subject: {
      type: String,
      default: "",
      trim: true,
    },

    examDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      default: "",
      trim: true,
    },

    totalMarks: {
      type: Number,
      default: 100,
    },

    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Exam", examSchema);
