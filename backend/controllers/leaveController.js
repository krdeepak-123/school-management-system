const mongoose = require("mongoose");
const Leave = require("../models/Leave");
const Student = require("../models/Student");

// ==========================================
// GENERATE LEAVE ID
// ==========================================
const generateLeaveId = async () => {
  const last = await Leave.findOne().sort({ createdAt: -1 });
  if (!last || !last.leaveId) return "LVE001";
  const lastNumber = parseInt(last.leaveId.replace("LVE", ""), 10);
  return `LVE${String(lastNumber + 1).padStart(3, "0")}`;
};

// ==========================================
// APPLY FOR LEAVE (Students AND Teachers)
// Ownership data is filled server-side from the
// linked record — never trusted from body.
// ==========================================
exports.applyLeave = async (req, res) => {
  try {
    const { fromDate, toDate, reason } = req.body;

    if (!fromDate || !toDate || !reason) {
      return res.status(400).json({
        success: false,
        message: "From date, to date and reason are required",
      });
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (isNaN(start) || isNaN(end)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid dates provided" });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "To date cannot be before from date",
      });
    }

    if (req.user.role !== "student" && req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Only students and teachers can apply for leave",
      });
    }

    const leaveId = await generateLeaveId();

    // Student application — link to the Student record
    if (req.user.role === "student") {
      const student = await Student.findById(req.user.linkedId);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "No student record is linked to your account",
        });
      }

      const leave = await Leave.create({
        leaveId,
        applicantRole: "student",
        student: student._id,
        studentName: student.name,
        admissionNo: student.admissionNo || "",
        className: student.className,
        section: student.section || "",
        rollNo: student.rollNo || "",
        fromDate: start,
        toDate: end,
        reason,
        status: "Pending",
      });

      return res.status(201).json({
        success: true,
        message: "Leave application submitted successfully",
        data: leave,
      });
    }

    // Teacher application — link to the Teacher record
    const Teacher = require("../models/Teacher");
    const teacher = await Teacher.findById(req.user.linkedId);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "No teacher record is linked to your account",
      });
    }

    const leave = await Leave.create({
      leaveId,
      applicantRole: "teacher",
      teacher: teacher._id,
      teacherId: teacher.teacherId || "",
      studentName: teacher.name,
      fromDate: start,
      toDate: end,
      reason,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Leave application submitted successfully",
      data: leave,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ==========================================
// MY LEAVE APPLICATIONS (Students AND Teachers —
// own records only, resolved from the linked account)
// ==========================================
exports.getMyLeaves = async (req, res) => {
  try {
    if (req.user.role === "student") {
      const leaves = await Leave.find({
        applicantRole: "student",
        student: req.user.linkedId,
      }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: leaves.length,
        data: leaves,
      });
    }

    if (req.user.role === "teacher") {
      const leaves = await Leave.find({
        applicantRole: "teacher",
        teacher: req.user.linkedId,
      }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: leaves.length,
        data: leaves,
      });
    }

    return res.status(403).json({ success: false, message: "Access denied" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// GET ALL LEAVE APPLICATIONS (staff)
// ==========================================
exports.getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// GET SINGLE LEAVE (staff)
// ==========================================
exports.getSingleLeave = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid leave id" });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave application not found" });
    }

    res.status(200).json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// UPDATE LEAVE STATUS (Principal, Director, Admin)
// Only status/reviewedBy can change — students
// cannot edit their applications after submit.
// ==========================================
exports.updateLeave = async (req, res) => {
  try {
    const { status } = req.body;

    if (status && !["Pending", "Approved", "Rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        ...(status && { status }),
        ...(status && { reviewedBy: req.user?.name || "" }),
      },
      { new: true, runValidators: true }
    );

    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave application not found" });
    }

    res.status(200).json({
      success: true,
      message: "Leave application updated successfully",
      data: leave,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ==========================================
// DELETE LEAVE (Principal, Director, Admin)
// ==========================================
exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);

    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave application not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Leave application deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
