const Teacher = require("../models/Teacher");

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

// ==========================================
// MY PROFILE (Teachers — own record only,
// resolved from the linked User account)
// ==========================================
exports.getMyProfile = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const teacher = await Teacher.findById(req.user.linkedId);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "No teacher record is linked to your account",
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
// UPDATE MY PROFILE (Teachers — permitted fields
// only: mobile, address, photo, qualification.
// Identity/employment fields are school-managed.)
// ==========================================
exports.updateMyProfile = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Whitelist — teachers cannot change teacherId,
    // name, email, subject, department, salary,
    // joiningDate or status
    const updates = {};

    if (req.body.mobile !== undefined) {
      const mobile = String(req.body.mobile).trim();
      if (mobile && !/^\d{10,15}$/.test(mobile)) {
        return res.status(400).json({
          success: false,
          message: "Mobile number must be 10-15 digits",
        });
      }
      updates.mobile = mobile;
    }

    if (req.body.address !== undefined) {
      updates.address = String(req.body.address).trim();
    }

    if (req.body.qualification !== undefined) {
      updates.qualification = String(req.body.qualification).trim();
    }

    if (req.file) {
      updates.photo = `uploads/${req.file.filename}`;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No permitted fields to update (mobile, address, qualification, photo only)",
      });
    }

    const teacher = await Teacher.findByIdAndUpdate(
      req.user.linkedId,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "No teacher record is linked to your account",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: teacher,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

