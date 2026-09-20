const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createAssignment,
  getAssignments,
  getMyAssignments,
  getSingleAssignment,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignmentController");

// ==========================================
// MY ASSIGNMENTS (Students — own class/section)
// Must be registered BEFORE /:id
// ==========================================
router.get("/mine", protect, getMyAssignments);

// Create Assignment (Principal, Director, Admin, Teacher)
router.post(
  "/",
  protect,
  authorizeRoles("principal", "director", "admin", "teacher"),
  createAssignment
);

// Get All Assignments (Principal, Director, Admin, Teacher)
router.get(
  "/",
  protect,
  authorizeRoles("principal", "director", "admin", "teacher"),
  getAssignments
);

// Get Single Assignment (Principal, Director, Admin, Teacher)
router.get(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin", "teacher"),
  getSingleAssignment
);

// Update Assignment (Principal, Director, Admin, Teacher)
router.put(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin", "teacher"),
  updateAssignment
);

// Delete Assignment (Principal, Director, Admin, Teacher)
router.delete(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin", "teacher"),
  deleteAssignment
);

module.exports = router;
