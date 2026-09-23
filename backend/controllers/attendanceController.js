const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
// Teachers may only mark attendance for the
// classes assigned to them (verified server-side).
// ==========================================
exports.createAttendance = async (req, res) => {
  try {
    const attendanceData = {
      ...req.body,
    };

    // Teacher class-scope enforcement
    if (req.user.role === "teacher") {
      const { getTeacherAccess, isClassAssigned } = require("../utils/teacherAccess");
      const access = await getTeacherAccess(req.user);

      if (!access) {
        return res.status(403).json({
          success: false,
          message: "No teacher record is linked to your account",
        });
      }

      if (!isClassAssigned(access.classes, attendanceData.className, attendanceData.section)) {
        return res.status(403).json({
          success: false,
          message: "You can only mark attendance for your assigned classes",
        });
      }
    }

    // Backend automatically generates ID
    attendanceData.attendanceId =
      await generateAttendanceId();

    // ==========================================
    // Duplicate guard: one record per student per
    // class/date. Re-marking the same day updates
    // the existing record instead of creating a
    // duplicate row.
    // ==========================================
    const recordDate = new Date(attendanceData.date);
    if (isNaN(recordDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date provided",
      });
    }

    const dayStart = new Date(recordDate);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

    const existingRecord = await Attendance.findOne({
      className: new RegExp(`^${escapeRegex(attendanceData.className)}$`, "i"),
      section: new RegExp(`^${escapeRegex(attendanceData.section || "")}$`, "i"),
      rollNo: attendanceData.rollNo,
      date: { $gte: dayStart, $lt: dayEnd },
    });

    if (existingRecord) {
      existingRecord.studentName =
        attendanceData.studentName || existingRecord.studentName;
      existingRecord.status = attendanceData.status || existingRecord.status;
      await existingRecord.save();

      return res.status(200).json({
        success: true,
        message: "Attendance updated successfully (a record for this date already existed)",
        data: existingRecord,
      });
    }

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
// MY ATTENDANCE RECORDS (Teachers — only records
// of the classes assigned to them)
// ==========================================
exports.getMyTeacherAttendance = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { getTeacherAccess } = require("../utils/teacherAccess");
    const access = await getTeacherAccess(req.user);

    if (!access) {
      return res.status(404).json({
        success: false,
        message: "No teacher record is linked to your account",
      });
    }

    const classFilters = access.classes.map((c) => {
      const filter = {
        className: new RegExp(`^${c.className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
      };
      if (c.section) {
        filter.section = new RegExp(`^${c.section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
      }
      return filter;
    });

    if (classFilters.length === 0) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const records = await Attendance.find({ $or: classFilters }).sort({
      date: -1,
    });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// MY ATTENDANCE (role-aware: students get their own
// records, teachers get their classes' records,
// other staff get everything)
// ==========================================
exports.getMyAttendance = async (req, res) => {
  try {
    if (req.user.role === "student") {
      const student = await Student.findById(req.user.linkedId);

      if (!student) {
        return res.status(200).json({ success: true, count: 0, data: [] });
      }

      const records = await Attendance.find({
        className: student.className,
        section: student.section,
        rollNo: student.rollNo,
      }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: records.length,
        data: records,
      });
    }

    if (req.user.role === "teacher") {
      const { getTeacherAccess } = require("../utils/teacherAccess");
      const access = await getTeacherAccess(req.user);

      if (!access || access.classes.length === 0) {
        return res.status(200).json({ success: true, count: 0, data: [] });
      }

      const classFilters = access.classes.map((c) => {
        const filter = {
          className: new RegExp(`^${c.className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
        };
        if (c.section) {
          filter.section = new RegExp(`^${c.section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
        }
        return filter;
      });

      const records = await Attendance.find({ $or: classFilters }).sort({
        date: -1,
      });

      return res.status(200).json({
        success: true,
        count: records.length,
        data: records,
      });
    }

    const attendance = await Attendance.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
// Teachers may only update attendance of their
// assigned classes (existing or new class values).
// ==========================================
exports.updateAttendance = async (req, res) => {
  try {
    const attendanceData = {
      ...req.body,
    };

    // Don't allow Attendance ID to change
    delete attendanceData.attendanceId;

    // Teacher class-scope enforcement
    if (req.user.role === "teacher") {
      const { getTeacherAccess, isClassAssigned } = require("../utils/teacherAccess");
      const access = await getTeacherAccess(req.user);

      if (!access) {
        return res.status(403).json({
          success: false,
          message: "No teacher record is linked to your account",
        });
      }

      const existing = await Attendance.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Attendance Not Found",
        });
      }

      const className = attendanceData.className || existing.className;
      const section = attendanceData.section !== undefined ? attendanceData.section : existing.section;

      if (!isClassAssigned(access.classes, className, section)) {
        return res.status(403).json({
          success: false,
          message: "You can only update attendance for your assigned classes",
        });
      }
    }

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
      await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance Not Found",
      });
    }

    // Teacher class-scope enforcement
    if (req.user.role === "teacher") {
      const { getTeacherAccess, isClassAssigned } = require("../utils/teacherAccess");
      const access = await getTeacherAccess(req.user);

      if (!access) {
        return res.status(403).json({
          success: false,
          message: "No teacher record is linked to your account",
        });
      }

      if (!isClassAssigned(access.classes, attendance.className, attendance.section)) {
        return res.status(403).json({
          success: false,
          message: "You can only delete attendance for your assigned classes",
        });
      }
    }

    await attendance.deleteOne();

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