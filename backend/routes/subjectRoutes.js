const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createSubject,
  getSubjects,
  getMySubjects,
  getMyTeacherSubjects,
  getSingleSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

// ==========================================
// MY SUBJECTS (Students — own class/section)
// Must be registered BEFORE /:id
// ==========================================
router.get("/mine", protect, getMySubjects);

// ==========================================
// MY SUBJECTS (Teachers — only assigned subjects)
// Must be registered BEFORE /:id
// ==========================================
router.get("/teacher-mine", protect, getMyTeacherSubjects);

// Create Subject (Principal, Director, Admin)
router.post(
  "/",
  protect,
  authorizeRoles("principal", "director", "admin"),
  createSubject
);

// Get All Subjects (Teacher, Principal, Director, Admin)
router.get(
  "/",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  getSubjects
);

// Get Single Subject (Teacher, Principal, Director, Admin)
router.get(
  "/:id",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  getSingleSubject
);

// Update Subject (Principal, Director, Admin)
router.put(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  updateSubject
);

// Delete Subject (Principal, Director, Admin)
router.delete(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  deleteSubject
);

module.exports = router;
