const Attendance = require("../models/Attendance");

console.log("✅ ATTENDANCE CONTROLLER LOADED");

// ==========================================
// Generate Attendance ID
// ==========================================
const generateAttendanceId = async () => {
  const lastAttendance = await Attendance.findOne()
    .sort({ createdAt: -1 });

  // First Attendance
  if (!lastAttendance || !lastAttendance.attendanceId) {
    return "ATT001";
  }

  // Example: ATT001
  // Remove ATT
  const lastNumber = parseInt(
    lastAttendance.attendanceId.replace("ATT", ""),
    10
  );

  const nextNumber = lastNumber + 1;

  return `ATT${String(nextNumber).padStart(3, "0")}`;
};

// ==========================================
// CREATE ATTENDANCE
// ==========================================
exports.createAttendance = async (req, res) => {
  try {
    console.log("Attendance Body =", req.body);

    const attendanceData = {
      ...req.body,
    };

    // Backend automatically generates ID
    attendanceData.attendanceId =
      await generateAttendanceId();

    console.log(
      "Generated Attendance ID =",
      attendanceData.attendanceId
    );

    const attendance =
      await Attendance.create(attendanceData);

    res.status(201).json({
      success: true,
      message: "Attendance Added Successfully",
      data: attendance,
    });

  } catch (error) {
    console.error(
      "Create Attendance Error =",
      error.message
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL ATTENDANCE
// ==========================================
exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET SINGLE ATTENDANCE
// ==========================================
exports.getSingleAttendance = async (req, res) => {
  try {
    const attendance =
      await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: attendance,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE ATTENDANCE
// ==========================================
exports.updateAttendance = async (req, res) => {
  try {
    const attendanceData = {
      ...req.body,
    };

    // Don't allow Attendance ID to change
    delete attendanceData.attendanceId;

    const attendance =
      await Attendance.findByIdAndUpdate(
        req.params.id,
        attendanceData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance Updated Successfully",
      data: attendance,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE ATTENDANCE
// ==========================================
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance =
      await Attendance.findByIdAndDelete(
        req.params.id
      );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};