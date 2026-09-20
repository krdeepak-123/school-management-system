const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  applyLeave,
  getMyLeaves,
  getLeaves,
  getSingleLeave,
  updateLeave,
  deleteLeave,
} = require("../controllers/leaveController");

// ==========================================
// APPLY FOR LEAVE (Students only)
// ==========================================
router.post("/", protect, applyLeave);

// ==========================================
// MY LEAVE APPLICATIONS (Students — own records)
// Must be registered BEFORE /:id
// ==========================================
router.get("/mine", protect, getMyLeaves);

// Get All Leave Applications (Teacher, Principal, Director, Admin)
router.get(
  "/",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  getLeaves
);

// Get Single Leave (Teacher, Principal, Director, Admin)
router.get(
  "/:id",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  getSingleLeave
);

// Approve/Reject Leave (Principal, Director, Admin)
router.put(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  updateLeave
);

// Delete Leave (Principal, Director, Admin)
router.delete(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  deleteLeave
);

module.exports = router;
