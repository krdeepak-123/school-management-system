const mongoose = require("mongoose");

const periodSchema = new mongoose.Schema(
  {
    period: {
      type: Number,
      required: true,
    },

    subject: {
      type: String,
      default: "",
      trim: true,
    },

    teacher: {
      type: String,
      default: "",
      trim: true,
    },

    startTime: {
      type: String,
      default: "",
      trim: true,
    },

    endTime: {
      type: String,
      default: "",
      trim: true,
    },

    room: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const timetableSchema = new mongoose.Schema(
  {
    timetableId: {
      type: String,
      unique: true,
      trim: true,
    },

    className: {
      type: String,
      required: true,
      trim: true,
    },

    section: {
      type: String,
      default: "",
      trim: true,
    },

    day: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },

    periods: {
      type: [periodSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Timetable", timetableSchema);
