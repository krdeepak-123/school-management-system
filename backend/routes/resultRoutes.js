const express = require("express");

const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createResult,
  getResults,
  getSingleResult,
  updateResult,
  deleteResult,
  getMyResults,
  getMyTeacherResults,
} = require("../controllers/resultController");

// ==========================================
// MY RESULTS (any logged-in user; students get their own records)
// ==========================================
router.get("/mine", protect, getMyResults);

// ==========================================
// MY RESULTS (Teachers — results of their assigned
// classes only) Must be registered BEFORE /:id
// ==========================================
router.get("/teacher-mine", protect, getMyTeacherResults);

// ==========================================
// CREATE RESULT (Teacher, Principal, Director, Admin)
// Teachers are class-scoped in the controller
// ==========================================
router.post(
  "/",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  createResult
);

// ==========================================
// GET ALL RESULTS (Principal, Director, Admin)
// Teachers use /teacher-mine (scoped to their classes)
// ==========================================
router.get(
  "/",
  protect,
  authorizeRoles("principal", "director", "admin"),
  getResults
);

// ==========================================
// GET SINGLE RESULT (Principal, Director, Admin)
// ==========================================
router.get(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  getSingleResult
);

// ==========================================
// UPDATE RESULT (Teacher, Principal, Director, Admin)
// Teachers can only update unlocked results of
// their assigned classes (enforced in the controller)
// ==========================================
router.put(
  "/:id",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  updateResult
);

// ==========================================
// DELETE RESULT (Principal, Director, Admin)
// ==========================================
router.delete(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  deleteResult
);

module.exports = router;