const Class = require("../models/Class");

// ==========================================
// Generate Class ID
// ==========================================
const generateClassId = async () => {
  const lastClass = await Class.findOne().sort({ createdAt: -1 });

  if (!lastClass || !lastClass.classId) {
    return "CLS001";
  }

  const lastNumber = parseInt(
    lastClass.classId.replace("CLS", "")
  );

  const nextNumber = lastNumber + 1;

  return `CLS${String(nextNumber).padStart(3, "0")}`;
};

// ==============================
// CREATE CLASS
// ==============================
exports.createClass = async (req, res) => {
  try {
    const classData = {
      ...req.body,
    };

    // Auto Generate Class ID
    classData.classId = await generateClassId();

    // Format Data
    if (classData.className) {
      classData.className = classData.className.toUpperCase();
    }

    if (classData.section) {
      classData.section = classData.section.toUpperCase();
    }

    if (classData.classTeacher) {
      classData.classTeacher = classData.classTeacher
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    if (classData.status) {
      classData.status =
        classData.status.charAt(0).toUpperCase() +
        classData.status.slice(1).toLowerCase();
    }

    const newClass = await Class.create(classData);

    res.status(201).json({
      success: true,
      message: "Class Added Successfully",
      data: newClass,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// GET ALL CLASSES
// ==============================
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// GET SINGLE CLASS
// ==============================
exports.getClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: classData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// UPDATE CLASS
// ==============================
exports.updateClass = async (req, res) => {
  try {
    const classData = {
      ...req.body,
    };

    if (classData.className) {
      classData.className = classData.className.toUpperCase();
    }

    if (classData.section) {
      classData.section = classData.section.toUpperCase();
    }

    if (classData.classTeacher) {
      classData.classTeacher = classData.classTeacher
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    if (classData.status) {
      classData.status =
        classData.status.charAt(0).toUpperCase() +
        classData.status.slice(1).toLowerCase();
    }

    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      classData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: "Class Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class Updated Successfully",
      data: updatedClass,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// DELETE CLASS
// ==============================
exports.deleteClass = async (req, res) => {
  try {
    const classData = await Class.findByIdAndDelete(req.params.id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// MY CLASSES (Teachers — only classes assigned
// to them, resolved from the linked account)
// ==========================================
exports.getMyTeacherClasses = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { getTeacherAccess } = require("../utils/teacherAccess");
    const access = await getTeacherAccess(req.user);

    if (!access) {
      // No teacher record found — report an empty list instead of
      // failing the whole request so the UI can show a useful message.
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        message: "No classes are assigned to your account",
      });
    }

    res.status(200).json({
      success: true,
      count: access.classes.length,
      data: access.classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// MY CLASS (Students — only their own class,
// resolved from the linked User account)
// ==========================================
exports.getMyClass = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const Student = require("../models/Student");
    const student = await Student.findById(req.user.linkedId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "No student record is linked to your account",
      });
    }

    // Class names are stored uppercase — match case-insensitively
    const query = {
      className: new RegExp(
        `^${student.className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        "i"
      ),
    };

    if (student.section) {
      const sectionRegex = new RegExp(
        `^${student.section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        "i"
      );
      query.section = sectionRegex;
    }

    const classData = await Class.findOne(query);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: classData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};