const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    classId: {
    type: String,
    required: true,
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
      required: true,
      trim: true,
    },

    classTeacher: {
      type: String,
      default: "",
      trim: true,
    },

    roomNo: {
      type: String,
      default: "",
      trim: true,
    },

    capacity: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Class", classSchema);