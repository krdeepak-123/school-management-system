const express = require("express");

const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createAttendance,
  getAttendance,
  getSingleAttendance,
  updateAttendance,
  deleteAttendance,
  getMyAttendance,
  getMyTeacherAttendance,
} = require("../controllers/attendanceController");

// ==========================================
// MY ATTENDANCE (any logged-in user; students get their own records)
// GET /api/attendance/mine
// ==========================================
router.get("/mine", protect, getMyAttendance);

// ==========================================
// MY ATTENDANCE RECORDS (Teachers — records of
// their assigned classes only)
// Must be registered BEFORE /:id
// ==========================================
router.get("/teacher-mine", protect, getMyTeacherAttendance);

// ==========================================
// CREATE ATTENDANCE (Teacher, Principal, Director, Admin)
// Teachers are class-scoped in the controller
// ==========================================
router.post(
  "/",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  createAttendance
);

// ==========================================
// GET ALL ATTENDANCE (Principal, Director, Admin)
// Teachers use /teacher-mine (scoped to their classes)
// ==========================================
router.get(
  "/",
  protect,
  authorizeRoles("principal", "director", "admin"),
  getAttendance
);

// ==========================================
// GET SINGLE ATTENDANCE (Teacher, Principal, Director, Admin)
// ==========================================
router.get(
  "/:id",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  getSingleAttendance
);

// ==========================================
// UPDATE ATTENDANCE (Teacher, Principal, Director, Admin)
// ==========================================
router.put(
  "/:id",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  updateAttendance
);

// ==========================================
// DELETE ATTENDANCE (Teacher, Principal, Director, Admin)
// ==========================================
router.delete(
  "/:id",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  deleteAttendance
);

module.exports = router;