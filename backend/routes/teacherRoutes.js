const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  createTeacher,
  getTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");

// =====================================
// CREATE TEACHER
// =====================================
router.post(
  "/",
  upload.single("photo"),
  createTeacher
);

// =====================================
// GET ALL TEACHERS
// =====================================
router.get("/", getTeachers);

// =====================================
// GET SINGLE TEACHER
// =====================================
router.get("/:id", getTeacher);

// =====================================
// UPDATE TEACHER
// =====================================
router.put(
  "/:id",
  upload.single("photo"),
  updateTeacher
);

// =====================================
// DELETE TEACHER
// =====================================
router.delete("/:id", deleteTeacher);

module.exports = router;
