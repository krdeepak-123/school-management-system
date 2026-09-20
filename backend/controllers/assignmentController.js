const mongoose = require("mongoose");
const Assignment = require("../models/Assignment");
const Student = require("../models/Student");

// ==========================================
// GENERATE ASSIGNMENT ID
// ==========================================
const generateAssignmentId = async () => {
  const last = await Assignment.findOne().sort({ createdAt: -1 });
  if (!last || !last.assignmentId) return "ASG001";
  const lastNumber = parseInt(last.assignmentId.replace("ASG", ""), 10);
  return `ASG${String(lastNumber + 1).padStart(3, "0")}`;
};

// ==========================================
// CREATE ASSIGNMENT (Principal, Director, Admin, Teacher)
// ==========================================
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, className, section, subject, assignedBy, dueDate } =
      req.body;

    if (!title || !className || !subject || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Title, class, subject and due date are required",
      });
    }

    const assignmentId = await generateAssignmentId();

    const assignment = await Assignment.create({
      assignmentId,
      title,
      description: description || "",
      className,
      section: section || "",
      subject,
      assignedBy: assignedBy || req.user?.name || "",
      dueDate,
    });

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ==========================================
// GET ALL ASSIGNMENTS (staff)
// ==========================================
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ dueDate: -1 });
    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// MY ASSIGNMENTS (Students — only their class/section)
// ==========================================
exports.getMyAssignments = async (req, res) => {
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

    const assignments = await Assignment.find(query).sort({ dueDate: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// GET SINGLE ASSIGNMENT (staff)
// ==========================================
exports.getSingleAssignment = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid assignment id" });
    }

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });
    }

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// UPDATE ASSIGNMENT (Principal, Director, Admin, Teacher)
// ==========================================
exports.updateAssignment = async (req, res) => {
  try {
    const { title, description, className, section, subject, assignedBy, dueDate } =
      req.body;

    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(className && { className }),
        ...(section !== undefined && { section }),
        ...(subject && { subject }),
        ...(assignedBy !== undefined && { assignedBy }),
        ...(dueDate && { dueDate }),
      },
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Assignment updated successfully",
      data: assignment,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ==========================================
// DELETE ASSIGNMENT (Principal, Director, Admin, Teacher)
// ==========================================
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);

    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
