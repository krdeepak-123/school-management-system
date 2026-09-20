const express = require("express");

const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createClass,
  getClasses,
  getClass,
  updateClass,
  deleteClass,
  getMyClass,
  getMyTeacherClasses,
} = require("../controllers/classController");

// ==========================================
// MY CLASS (Students — own class only)
// Must be registered BEFORE /:id
// ==========================================
router.get(
  "/mine",
  protect,
  getMyClass
);

// ==========================================
// MY CLASSES (Teachers — only assigned classes)
// Must be registered BEFORE /:id
// ==========================================
router.get(
  "/teacher-mine",
  protect,
  getMyTeacherClasses
);

// ==========================
// CREATE CLASS (Principal, Director, Admin)
// ==========================
router.post(
  "/",
  protect,
  authorizeRoles("principal", "director", "admin"),
  createClass
);

// ==========================
// GET ALL CLASSES (Principal, Director, Admin)
// Teachers use /teacher-mine (scoped to their classes)
// ==========================
router.get(
  "/",
  protect,
  authorizeRoles("principal", "director", "admin"),
  getClasses
);

// ==========================
// GET SINGLE CLASS (Teacher, Principal, Director, Admin)
// ==========================
router.get(
  "/:id",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  getClass
);

// ==========================
// UPDATE CLASS (Principal, Director, Admin)
// ==========================
router.put(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  updateClass
);

// ==========================
// DELETE CLASS (Principal, Director, Admin)
// ==========================
router.delete(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  deleteClass
);

module.exports = router;