const Teacher = require("../models/Teacher");
console.log("✅ NEW TEACHER CONTROLLER LOADED");

// ==========================================
// Generate Employee ID
// ==========================================
const generateTeacherId = async () => {
  const lastTeacher = await Teacher.findOne().sort({
    createdAt: -1,
  });

  if (!lastTeacher || !lastTeacher.teacherId) {
    return "T001";
  }

  const lastNumber = parseInt(
    lastTeacher.teacherId.replace("T", "")
  );

  const nextNumber = lastNumber + 1;

  return `T${String(nextNumber).padStart(3, "0")}`;
};

// ==========================================
// CREATE TEACHER
// ==========================================
exports.createTeacher = async (req, res) => {
   console.log("BODY =", req.body);
  try {
    const teacherData = {
      ...req.body,
    };

    // =============================
    // Employee ID Auto Generate
    // =============================
   teacherData.teacherId = await generateTeacherId();

    // =============================
    // Name Formatting
    // =============================
    if (teacherData.name) {
      teacherData.name = teacherData.name
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    if (teacherData.fatherName) {
      teacherData.fatherName = teacherData.fatherName
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    if (teacherData.motherName) {
      teacherData.motherName = teacherData.motherName
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    if (teacherData.department) {
      teacherData.department = teacherData.department
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    if (teacherData.subject) {
      teacherData.subject = teacherData.subject
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    if (teacherData.qualification) {
      teacherData.qualification = teacherData.qualification
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    // =============================
    // Email
    // =============================
    if (teacherData.email) {
      teacherData.email = teacherData.email.toLowerCase();
    }

    // =============================
    // Gender
    // =============================
    if (teacherData.gender) {
      teacherData.gender =
        teacherData.gender.charAt(0).toUpperCase() +
        teacherData.gender.slice(1).toLowerCase();
    }

    // =============================
    // Status
    // =============================
    if (teacherData.status) {
      teacherData.status =
        teacherData.status.charAt(0).toUpperCase() +
        teacherData.status.slice(1).toLowerCase();
    }

    // =============================
    // Upload Photo
    // =============================
    if (req.file) {
      teacherData.photo = `uploads/${req.file.filename}`;
    }
    console.log("Teacher Data =", teacherData);
    const teacher = await Teacher.create(teacherData);

    res.status(201).json({
      success: true,
      message: "Teacher added successfully",
      data: teacher,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL TEACHERS
// ==========================================
exports.getTeachers = async (req, res) => {
  try {

    const teachers = await Teacher.find().sort({
      createdAt: -1,
    });

    console.log("Teachers =", teachers);

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// GET SINGLE TEACHER
// ==========================================
exports.getTeacher = async (req, res) => {
  try {

    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      data: teacher,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ==========================================
// UPDATE TEACHER
// ==========================================
exports.updateTeacher = async (req, res) => {
  try {

    const teacherData = {
      ...req.body,
    };

    // =============================
    // Name Formatting
    // =============================
    if (teacherData.name) {
      teacherData.name = teacherData.name
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    if (teacherData.fatherName) {
      teacherData.fatherName = teacherData.fatherName
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    if (teacherData.motherName) {
      teacherData.motherName = teacherData.motherName
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    if (teacherData.department) {
      teacherData.department = teacherData.department
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    if (teacherData.subject) {
      teacherData.subject = teacherData.subject
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    if (teacherData.qualification) {
      teacherData.qualification = teacherData.qualification
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    if (teacherData.email) {
      teacherData.email = teacherData.email.toLowerCase();
    }

    if (teacherData.gender) {
      teacherData.gender =
        teacherData.gender.charAt(0).toUpperCase() +
        teacherData.gender.slice(1).toLowerCase();
    }

    if (teacherData.status) {
      teacherData.status =
        teacherData.status.charAt(0).toUpperCase() +
        teacherData.status.slice(1).toLowerCase();
    }

    // Upload New Photo
    if (req.file) {
      teacherData.photo = `uploads/${req.file.filename}`;
    }

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      teacherData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      data: teacher,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// DELETE TEACHER
// ==========================================
exports.deleteTeacher = async (req, res) => {
  try {

    const teacher = await Teacher.findByIdAndDelete(
      req.params.id
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

