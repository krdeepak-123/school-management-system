const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

// Create Student
router.post("/", upload.single("photo"), createStudent);

// Get All Students
router.get("/", getStudents);

// Get Single Student
router.get("/:id", getStudent);

// Update Student
router.put("/:id", upload.single("photo"), updateStudent);

// Delete Student
router.delete("/:id", deleteStudent);

module.exports = router;
