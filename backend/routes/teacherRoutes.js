const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createTeacher,
  getTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher,
  getMyProfile,
  updateMyProfile,
} = require("../controllers/teacherController");

// =====================================
// MY PROFILE (Teachers — own record only)
// Must be registered BEFORE /:id
// =====================================
router.get("/me", protect, getMyProfile);

// Edit permitted profile fields only
// (mobile, address, qualification, photo)
router.put("/me", protect, upload.single("photo"), updateMyProfile);

// =====================================
// CREATE TEACHER (Principal, Director, Admin)
// =====================================
router.post(
  "/",
  protect,
  authorizeRoles("principal", "director", "admin"),
  upload.single("photo"),
  createTeacher
);

// =====================================
// GET ALL TEACHERS (Principal, Director, Admin)
// =====================================
router.get(
  "/",
  protect,
  authorizeRoles("principal", "director", "admin"),
  getTeachers
);

// =====================================
// GET SINGLE TEACHER (Principal, Director, Admin)
// =====================================
router.get(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  getTeacher
);

// =====================================
// UPDATE TEACHER (Principal, Director, Admin)
// =====================================
router.put(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  upload.single("photo"),
  updateTeacher
);

// =====================================
// DELETE TEACHER (Principal, Director, Admin)
// =====================================
router.delete(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  deleteTeacher
);

module.exports = router;