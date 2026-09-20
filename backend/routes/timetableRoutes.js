const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createTimetable,
  getTimetables,
  getMyTimetable,
  getSingleTimetable,
  updateTimetable,
  deleteTimetable,
} = require("../controllers/timetableController");

// ==========================================
// MY TIMETABLE (Students — own class/section)
// Must be registered BEFORE /:id
// ==========================================
router.get("/mine", protect, getMyTimetable);

// Create Timetable (Principal, Director, Admin)
router.post(
  "/",
  protect,
  authorizeRoles("principal", "director", "admin"),
  createTimetable
);

// Get All Timetables (Teacher, Principal, Director, Admin)
router.get(
  "/",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  getTimetables
);

// Get Single Timetable (Teacher, Principal, Director, Admin)
router.get(
  "/:id",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  getSingleTimetable
);

// Update Timetable (Principal, Director, Admin)
router.put(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  updateTimetable
);

// Delete Timetable (Principal, Director, Admin)
router.delete(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  deleteTimetable
);

module.exports = router;
