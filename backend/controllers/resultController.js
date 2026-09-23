const Result = require("../models/Result");
const Student = require("../models/Student");

// ==========================================
// Generate Result ID
// ==========================================
const generateResultId = async () => {
  const lastResult = await Result.findOne().sort({
    createdAt: -1,
  });

  if (!lastResult || !lastResult.resultId) {
    return "RES001";
  }

  const lastNumber = parseInt(
    lastResult.resultId.replace("RES", ""),
    10
  );

  const nextNumber = lastNumber + 1;

  return `RES${String(nextNumber).padStart(3, "0")}`;
};

// ==========================================
// Calculate Result
// ==========================================
const calculateResult = (
  totalMarks,
  obtainedMarks
) => {
  const total = Number(totalMarks);
  const obtained = Number(obtainedMarks);

  if (!total || total <= 0) {
    return {
      percentage: 0,
      grade: "F",
      status: "Fail",
    };
  }

  const percentage =
    (obtained / total) * 100;

  let grade = "F";

  if (percentage >= 90) {
    grade = "A+";
  } else if (percentage >= 80) {
    grade = "A";
  } else if (percentage >= 70) {
    grade = "B+";
  } else if (percentage >= 60) {
    grade = "B";
  } else if (percentage >= 50) {
    grade = "C";
  } else if (percentage >= 33) {
    grade = "D";
  }

  const status =
    percentage >= 33
      ? "Pass"
      : "Fail";

  return {
    percentage: Number(
      percentage.toFixed(2)
    ),
    grade,
    status,
  };
};

// ==========================================
// CREATE RESULT
// ==========================================
exports.createResult = async (
  req,
  res
) => {
  try {
    const {
      studentName,
      className,
      section,
      rollNo,
      exam,
      subject,
      totalMarks,
      obtainedMarks,
      examDate,
    } = req.body;

    // Teacher class-scope enforcement: teachers may
    // only enter marks for their assigned classes
    if (req.user.role === "teacher") {
      const { getTeacherAccess, isClassAssigned } = require("../utils/teacherAccess");
      const access = await getTeacherAccess(req.user);

      if (!access) {
        return res.status(403).json({
          success: false,
          message: "No teacher record is linked to your account",
        });
      }

      if (!isClassAssigned(access.classes, className, section)) {
        return res.status(403).json({
          success: false,
          message: "You can only enter marks for your assigned classes",
        });
      }
    }

    // ==============================
    // Required Fields
    // ==============================

    if (!studentName) {
      return res.status(400).json({
        success: false,
        message:
          "Student Name is required",
      });
    }

    if (!className) {
      return res.status(400).json({
        success: false,
        message:
          "Class is required",
      });
    }

    if (!section) {
      return res.status(400).json({
        success: false,
        message:
          "Section is required",
      });
    }

    if (!rollNo) {
      return res.status(400).json({
        success: false,
        message:
          "Roll No is required",
      });
    }

    if (!exam) {
      return res.status(400).json({
        success: false,
        message:
          "Exam is required",
      });
    }

    if (!subject) {
      return res.status(400).json({
        success: false,
        message:
          "Subject is required",
      });
    }

    if (
      totalMarks === undefined ||
      totalMarks === ""
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Total Marks is required",
      });
    }

    if (
      obtainedMarks === undefined ||
      obtainedMarks === ""
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Obtained Marks is required",
      });
    }

    if (!examDate) {
      return res.status(400).json({
        success: false,
        message:
          "Exam Date is required",
      });
    }

    // ==============================
    // Validate Marks
    // ==============================

    const total = Number(totalMarks);
    const obtained =
      Number(obtainedMarks);

    if (total <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Total Marks must be greater than 0",
      });
    }

    if (obtained < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Obtained Marks cannot be negative",
      });
    }

    if (obtained > total) {
      return res.status(400).json({
        success: false,
        message:
          "Obtained Marks cannot be greater than Total Marks",
      });
    }

    // ==============================
    // Calculate Result
    // ==============================

    const calculated =
      calculateResult(
        total,
        obtained
      );

    // ==============================
    // Generate Result ID
    // ==============================

    const resultId =
      await generateResultId();

    // ==============================
    // Create Result
    // ==============================

    const result =
      await Result.create({
        resultId,
        studentName,
        className,
        section,
        rollNo,
        exam,
        subject,
        totalMarks: total,
        obtainedMarks: obtained,
        percentage:
          calculated.percentage,
        grade: calculated.grade,
        status: calculated.status,
        examDate,
      });

    res.status(201).json({
      success: true,
      message:
        "Result Added Successfully",
      data: result,
    });

  } catch (error) {
    console.error(
      "Create Result Error:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// MY RESULTS (Students see only their own records)
// ==========================================
exports.getMyResults = async (req, res) => {
  try {
    if (req.user.role === "student") {
      const student = await Student.findById(req.user.linkedId);

      if (!student) {
        return res.status(200).json({ success: true, count: 0, data: [] });
      }

      const results = await Result.find({
        className: student.className,
        section: student.section,
        rollNo: student.rollNo,
      }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: results.length,
        data: results,
      });
    }

    const results = await Result.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Get My Results Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// MY RESULTS (Teachers — only results of the
// classes assigned to them, for marks entry
// and class performance)
// ==========================================
exports.getMyTeacherResults = async (req, res) => {
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

    const results = await Result.find({ $or: classFilters }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// GET ALL RESULTS
// ==========================================
exports.getResults = async (
  req,
  res
) => {
  try {
    const results =
      await Result.find().sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });

  } catch (error) {
    console.error(
      "Get Results Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET SINGLE RESULT
// ==========================================
exports.getSingleResult = async (
  req,
  res
) => {
  try {
    const result =
      await Result.findById(
        req.params.id
      );

    if (!result) {
      return res.status(404).json({
        success: false,
        message:
          "Result Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error(
      "Get Single Result Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE RESULT
// ==========================================
exports.updateResult = async (
  req,
  res
) => {
  try {
    const {
      studentName,
      className,
      section,
      rollNo,
      exam,
      subject,
      totalMarks,
      obtainedMarks,
      examDate,
    } = req.body;

    // ==============================
    // Validate Marks
    // ==============================

    if (
      totalMarks === undefined ||
      obtainedMarks === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Total Marks and Obtained Marks are required",
      });
    }

    const total = Number(totalMarks);
    const obtained =
      Number(obtainedMarks);

    if (total <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Total Marks must be greater than 0",
      });
    }

    if (obtained < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Obtained Marks cannot be negative",
      });
    }

    if (obtained > total) {
      return res.status(400).json({
        success: false,
        message:
          "Obtained Marks cannot be greater than Total Marks",
      });
    }

    // ==============================
    // Recalculate Result
    // ==============================

    const calculated =
      calculateResult(
        total,
        obtained
      );

    const updatedData = {
      studentName,
      className,
      section,
      rollNo,
      exam,
      subject,
      totalMarks: total,
      obtainedMarks: obtained,
      percentage:
        calculated.percentage,
      grade: calculated.grade,
      status: calculated.status,
      examDate,
    };

    // Lock management — only Principal, Director, Admin
    // can lock/unlock results
    if (
      req.user.role === "principal" ||
      req.user.role === "director" ||
      req.user.role === "admin"
    ) {
      if (req.body.locked !== undefined) {
        updatedData.locked = Boolean(req.body.locked);
      }
    }

    // Teacher enforcement: assigned classes only,
    // and only before the result is locked
    if (req.user.role === "teacher") {
      const existing = await Result.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Result Not Found",
        });
      }

      if (existing.locked) {
        return res.status(403).json({
          success: false,
          message: "This result is locked. Contact administration to change it.",
        });
      }

      const { getTeacherAccess, isClassAssigned } = require("../utils/teacherAccess");
      const access = await getTeacherAccess(req.user);

      if (!access) {
        return res.status(403).json({
          success: false,
          message: "No teacher record is linked to your account",
        });
      }

      const className = updatedData.className || existing.className;
      const section = updatedData.section !== undefined ? updatedData.section : existing.section;

      if (!isClassAssigned(access.classes, className, section)) {
        return res.status(403).json({
          success: false,
          message: "You can only update results for your assigned classes",
        });
      }
    }

    const result =
      await Result.findByIdAndUpdate(
        req.params.id,
        updatedData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!result) {
      return res.status(404).json({
        success: false,
        message:
          "Result Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Result Updated Successfully",
      data: result,
    });

  } catch (error) {
    console.error(
      "Update Result Error:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE RESULT
// ==========================================
exports.deleteResult = async (
  req,
  res
) => {
  try {
    const result =
      await Result.findByIdAndDelete(
        req.params.id
      );

    if (!result) {
      return res.status(404).json({
        success: false,
        message:
          "Result Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Result Deleted Successfully",
    });

  } catch (error) {
    console.error(
      "Delete Result Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};