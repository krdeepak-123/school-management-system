const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    noticeId: {
      type: String,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },

    audience: {
      type: String,
      enum: ["All", "Students", "Teachers"],
      default: "All",
    },

    postedBy: {
      type: String,
      default: "Administration",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notice", noticeSchema);
