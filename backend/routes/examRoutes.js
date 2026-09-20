const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createExam,
  getExams,
  getMyExams,
  getSingleExam,
  updateExam,
  deleteExam,
} = require("../controllers/examController");

// ==========================================
// MY EXAMS (Students — own class/section)
// Must be registered BEFORE /:id
// ==========================================
router.get("/mine", protect, getMyExams);

// Create Exam (Teacher, Principal, Director, Admin)
// Teachers are class-scoped in the controller
router.post(
  "/",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  createExam
);

// Get All Exams (Teacher, Principal, Director, Admin)
router.get(
  "/",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  getExams
);

// Get Single Exam (Teacher, Principal, Director, Admin)
router.get(
  "/:id",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  getSingleExam
);

// Update Exam (Teacher, Principal, Director, Admin)
// Teachers are class-scoped in the controller
router.put(
  "/:id",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  updateExam
);

// Delete Exam (Principal, Director, Admin)
router.delete(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  deleteExam
);

module.exports = router;
