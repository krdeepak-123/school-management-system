const Class = require("../models/Class");
const Teacher = require("../models/Teacher");

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const norm = (v) => (v === undefined || v === null ? "" : String(v).trim().toLowerCase());

// ==========================================
// Returns { teacher, classes } for a logged-in
// teacher. classes = Class docs assigned to them
// via the existing classTeacher name field.
// ==========================================
const getTeacherAccess = async (linkedId) => {
  const teacher = await Teacher.findById(linkedId);
  if (!teacher) return null;

  const nameRegex = new RegExp(`^${escapeRegex(teacher.name)}$`, "i");
  const classes = await Class.find({ classTeacher: nameRegex });

  return { teacher, classes };
};

// ==========================================
// Whether a class (className + section) is
// assigned to the teacher. Sections are matched
// loosely: an empty/undefined section on either
// side still counts as a match.
// ==========================================
const isClassAssigned = (classes, className, section) =>
  classes.some(
    (c) =>
      norm(c.className) === norm(className) &&
      (!norm(c.section) || !norm(section) || norm(c.section) === norm(section))
  );

module.exports = { getTeacherAccess, isClassAssigned, escapeRegex };
