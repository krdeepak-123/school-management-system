const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getMyProfile,
  updateMyProfile,
  getMyTeacherStudents,
} = require("../controllers/studentController");

// ==========================================
// MY PROFILE (Students — own record only)
// Must be registered BEFORE /:id
// ==========================================
router.get(
  "/me",
  protect,
  getMyProfile
);

// Edit permitted profile fields only
// (mobile, address, photo)
router.put(
  "/me",
  protect,
  updateMyProfile
);

// ==========================================
// MY STUDENTS (Teachers — students of assigned
// classes only) Must be registered BEFORE /:id
// ==========================================
router.get(
  "/teacher-mine",
  protect,
  getMyTeacherStudents
);

// Create Student (Principal, Director, Admin)
router.post(
  "/",
  protect,
  authorizeRoles("principal", "director", "admin"),
  upload.single("photo"),
  createStudent
);

// Get All Students (Principal, Director, Admin)
// Teachers use /teacher-mine (scoped to their classes)
router.get(
  "/",
  protect,
  authorizeRoles("principal", "director", "admin"),
  getStudents
);

// Get Single Student (Principal, Director, Admin)
router.get(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  getStudent
);

// Update Student (Principal, Director, Admin)
router.put(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  upload.single("photo"),
  updateStudent
);

// Delete Student (Principal, Director, Admin)
router.delete(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  deleteStudent
);

module.exports = router;