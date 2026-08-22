const express = require("express");

const router = express.Router();

const {
  createAttendance,
  getAttendance,
  getSingleAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

// ==========================================
// CREATE ATTENDANCE
// POST /api/attendance
// ==========================================
router.post("/", createAttendance);

// ==========================================
// GET ALL ATTENDANCE
// GET /api/attendance
// ==========================================
router.get("/", getAttendance);

// ==========================================
// GET SINGLE ATTENDANCE
// GET /api/attendance/:id
// ==========================================
router.get("/:id", getSingleAttendance);

// ==========================================
// UPDATE ATTENDANCE
// PUT /api/attendance/:id
// ==========================================
router.put("/:id", updateAttendance);

// ==========================================
// DELETE ATTENDANCE
// DELETE /api/attendance/:id
// ==========================================
router.delete("/:id", deleteAttendance);

module.exports = router;