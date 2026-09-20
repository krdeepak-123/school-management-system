const mongoose = require("mongoose");
const Exam = require("../models/Exam");
const Student = require("../models/Student");

// ==========================================
// GENERATE EXAM ID
// ==========================================
const generateExamId = async () => {
  const last = await Exam.findOne().sort({ createdAt: -1 });
  if (!last || !last.examId) return "EXM001";
  const lastNumber = parseInt(last.examId.replace("EXM", ""), 10);
  return `EXM${String(lastNumber + 1).padStart(3, "0")}`;
};

// ==========================================
// CREATE EXAM (Principal, Director, Admin)
// ==========================================
exports.createExam = async (req, res) => {
  try {
    const { name, className, section, subject, examDate, startTime, totalMarks } =
      req.body;

    if (!name || !className || !examDate) {
      return res.status(400).json({
        success: false,
        message: "Exam name, class and exam date are required",
      });
    }

    // Teacher class-scope enforcement: teachers may
    // only create exams for their assigned classes
    if (req.user.role === "teacher") {
      const { getTeacherAccess, isClassAssigned } = require("../utils/teacherAccess");
      const access = await getTeacherAccess(req.user.linkedId);

      if (!access) {
        return res.status(403).json({
          success: false,
          message: "No teacher record is linked to your account",
        });
      }

      if (!isClassAssigned(access.classes, className, section)) {
        return res.status(403).json({
          success: false,
          message: "You can only create exams for your assigned classes",
        });
      }
    }

    const examId = await generateExamId();

    const exam = await Exam.create({
      examId,
      name,
      className,
      section: section || "",
      subject: subject || "",
      examDate,
      startTime: startTime || "",
      totalMarks: totalMarks !== undefined ? Number(totalMarks) : 100,
    });

    res.status(201).json({
      success: true,
      message: "Exam created successfully",
      data: exam,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ==========================================
// GET ALL EXAMS (staff)
// ==========================================
exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ examDate: -1 });
    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// MY EXAMS (Students — only their class/section)
// ==========================================
exports.getMyExams = async (req, res) => {
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

    const exams = await Exam.find(query).sort({ examDate: 1 });

    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// GET SINGLE EXAM (staff)
// ==========================================
exports.getSingleExam = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid exam id" });
    }

    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    res.status(200).json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// UPDATE EXAM (Principal, Director, Admin)
// ==========================================
exports.updateExam = async (req, res) => {
  try {
    const { name, className, section, subject, examDate, startTime, totalMarks, status } =
      req.body;

    // Teacher class-scope enforcement: teachers may
    // only update exams of their assigned classes
    if (req.user.role === "teacher") {
      const existing = await Exam.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: "Exam not found" });
      }

      const { getTeacherAccess, isClassAssigned } = require("../utils/teacherAccess");
      const access = await getTeacherAccess(req.user.linkedId);

      if (!access) {
        return res.status(403).json({
          success: false,
          message: "No teacher record is linked to your account",
        });
      }

      const examClassName = className || existing.className;
      const examSection = section !== undefined ? section : existing.section;

      if (!isClassAssigned(access.classes, examClassName, examSection)) {
        return res.status(403).json({
          success: false,
          message: "You can only update exams for your assigned classes",
        });
      }
    }

    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(className && { className }),
        ...(section !== undefined && { section }),
        ...(subject !== undefined && { subject }),
        ...(examDate && { examDate }),
        ...(startTime !== undefined && { startTime }),
        ...(totalMarks !== undefined && { totalMarks: Number(totalMarks) }),
        ...(status && { status }),
      },
      { new: true, runValidators: true }
    );

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      data: exam,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ==========================================
// DELETE EXAM (Principal, Director, Admin)
// ==========================================
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    res.status(200).json({ success: true, message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
