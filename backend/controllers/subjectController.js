const mongoose = require("mongoose");
const Subject = require("../models/Subject");
const Student = require("../models/Student");

// ==========================================
// GENERATE SUBJECT ID
// ==========================================
const generateSubjectId = async () => {
  const last = await Subject.findOne().sort({ createdAt: -1 });
  if (!last || !last.subjectId) return "SUB001";
  const lastNumber = parseInt(last.subjectId.replace("SUB", ""), 10);
  return `SUB${String(lastNumber + 1).padStart(3, "0")}`;
};

// ==========================================
// CREATE SUBJECT (Principal, Director, Admin)
// ==========================================
exports.createSubject = async (req, res) => {
  try {
    const { name, className, section, teacher } = req.body;

    if (!name || !className) {
      return res
        .status(400)
        .json({ success: false, message: "Subject name and class are required" });
    }

    const subjectId = await generateSubjectId();

    const subject = await Subject.create({
      subjectId,
      name,
      className,
      section: section || "",
      teacher: teacher || "",
    });

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: subject,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ==========================================
// GET ALL SUBJECTS (staff)
// ==========================================
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// MY SUBJECTS (Teachers — only subjects assigned
// to them, resolved from the linked account)
// ==========================================
exports.getMyTeacherSubjects = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const Teacher = require("../models/Teacher");
    const teacher = await Teacher.findById(req.user.linkedId);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "No teacher record is linked to your account",
      });
    }

    // Subjects are matched by the teacher's name (existing structure)
    const { escapeRegex } = require("../utils/teacherAccess");
    const nameRegex = new RegExp(`^${escapeRegex(teacher.name)}$`, "i");

    const subjects = await Subject.find({
      $or: [{ teacher: nameRegex }, { teacher: teacher.name }],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// MY SUBJECTS (Students — only their class/section)
// ==========================================
exports.getMySubjects = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const student = await Student.findById(req.user.linkedId);

    if (!student) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const query = { className: student.className, status: "Active" };
    if (student.section) {
      query.$or = [{ section: student.section }, { section: "" }, { section: null }];
    }

    const subjects = await Subject.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// GET SINGLE SUBJECT (staff)
// ==========================================
exports.getSingleSubject = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid subject id" });
    }

    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// UPDATE SUBJECT (Principal, Director, Admin)
// ==========================================
exports.updateSubject = async (req, res) => {
  try {
    const { name, className, section, teacher, status } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(className && { className }),
        ...(section !== undefined && { section }),
        ...(teacher !== undefined && { teacher }),
        ...(status && { status }),
      },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      data: subject,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ==========================================
// DELETE SUBJECT (Principal, Director, Admin)
// ==========================================
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    res.status(200).json({ success: true, message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
