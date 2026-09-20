const mongoose = require("mongoose");
const Timetable = require("../models/Timetable");
const Student = require("../models/Student");

// ==========================================
// GENERATE TIMETABLE ID
// ==========================================
const generateTimetableId = async () => {
  const last = await Timetable.findOne().sort({ createdAt: -1 });
  if (!last || !last.timetableId) return "TT001";
  const lastNumber = parseInt(last.timetableId.replace("TT", ""), 10);
  return `TT${String(lastNumber + 1).padStart(3, "0")}`;
};

// ==========================================
// CREATE TIMETABLE (Principal, Director, Admin)
// ==========================================
exports.createTimetable = async (req, res) => {
  try {
    const { className, section, day, periods } = req.body;

    if (!className || !day) {
      return res
        .status(400)
        .json({ success: false, message: "Class and day are required" });
    }

    const timetableId = await generateTimetableId();

    const timetable = await Timetable.create({
      timetableId,
      className,
      section: section || "",
      day,
      periods: Array.isArray(periods) ? periods : [],
    });

    res.status(201).json({
      success: true,
      message: "Timetable created successfully",
      data: timetable,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ==========================================
// GET ALL TIMETABLE (staff)
// ==========================================
exports.getTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find().sort({ day: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: timetables.length,
      data: timetables,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// MY TIMETABLE (Students — only their class/section)
// ==========================================
exports.getMyTimetable = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const student = await Student.findById(req.user.linkedId);

    if (!student) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const query = { className: student.className };
    if (student.section) {
      query.$or = [
        { section: student.section },
        { section: "" },
        { section: null },
      ];
    }

    const timetables = await Timetable.find(query).sort({ day: 1 });

    res.status(200).json({
      success: true,
      count: timetables.length,
      data: timetables,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// GET SINGLE TIMETABLE (staff)
// ==========================================
exports.getSingleTimetable = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid timetable id" });
    }

    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      return res.status(404).json({ success: false, message: "Timetable not found" });
    }

    res.status(200).json({ success: true, data: timetable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// UPDATE TIMETABLE (Principal, Director, Admin)
// ==========================================
exports.updateTimetable = async (req, res) => {
  try {
    const { className, section, day, periods } = req.body;

    const timetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      {
        ...(className && { className }),
        ...(section !== undefined && { section }),
        ...(day && { day }),
        ...(Array.isArray(periods) && { periods }),
      },
      { new: true, runValidators: true }
    );

    if (!timetable) {
      return res.status(404).json({ success: false, message: "Timetable not found" });
    }

    res.status(200).json({
      success: true,
      message: "Timetable updated successfully",
      data: timetable,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ==========================================
// DELETE TIMETABLE (Principal, Director, Admin)
// ==========================================
exports.deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);

    if (!timetable) {
      return res.status(404).json({ success: false, message: "Timetable not found" });
    }

    res.status(200).json({ success: true, message: "Timetable deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
