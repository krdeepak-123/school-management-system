const Student = require("../models/Student");

// ==========================
// CREATE STUDENT
// ==========================
exports.createStudent = async (req, res) => {
  try {
    const studentData = {
      ...req.body,
    };

    // Photo Upload
    if (req.file) {
      studentData.photo = `uploads/${req.file.filename}`;
    }

    const student = await Student.create(studentData);

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// GET ALL STUDENTS
// ==========================
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// GET SINGLE STUDENT
// ==========================
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// UPDATE STUDENT
// ==========================
exports.updateStudent = async (req, res) => {
  try {
    const studentData = {
      ...req.body,
    };

    // Photo Upload
    if (req.file) {
      studentData.photo = `uploads/${req.file.filename}`;
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      studentData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// DELETE STUDENT
// ==========================
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// MY STUDENTS (Teachers — only students of the
// classes assigned to them, enforced server-side)
// ==========================================
exports.getMyTeacherStudents = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { getTeacherAccess } = require("../utils/teacherAccess");
    const access = await getTeacherAccess(req.user.linkedId);

    if (!access) {
      return res.status(404).json({
        success: false,
        message: "No teacher record is linked to your account",
      });
    }

    // Students whose class matches any assigned class
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

    const students = await Student.find({ $or: classFilters }).sort({
      className: 1,
      rollNo: 1,
    });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// MY PROFILE (Students — own record only,
// resolved from the linked User account)
// ==========================
exports.getMyProfile = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const student = await Student.findById(req.user.linkedId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "No student record is linked to your account",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// UPDATE MY PROFILE (Students — permitted
// fields only: mobile, address, photo.
// Identity/class fields are school-managed.)
// ==========================
exports.updateMyProfile = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Whitelist — students cannot change admissionNo,
    // rollNo, className, section, name or status
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

    if (req.file) {
      updates.photo = `uploads/${req.file.filename}`;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No permitted fields to update (mobile, address, photo only)",
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.user.linkedId,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "No student record is linked to your account",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};