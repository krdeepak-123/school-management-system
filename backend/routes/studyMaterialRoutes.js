const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createMaterial,
  getMaterials,
  getMyMaterials,
  getSingleMaterial,
  updateMaterial,
  deleteMaterial,
} = require("../controllers/studyMaterialController");

// ==========================================
// MY STUDY MATERIALS (Students — own class/section)
// Must be registered BEFORE /:id
// ==========================================
router.get("/mine", protect, getMyMaterials);

// Create Study Material (Principal, Director, Admin, Teacher)
router.post(
  "/",
  protect,
  authorizeRoles("principal", "director", "admin", "teacher"),
  createMaterial
);

// Get All Study Materials (Principal, Director, Admin, Teacher)
router.get(
  "/",
  protect,
  authorizeRoles("principal", "director", "admin", "teacher"),
  getMaterials
);

// Get Single Study Material (Principal, Director, Admin, Teacher)
router.get(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin", "teacher"),
  getSingleMaterial
);

// Update Study Material (Principal, Director, Admin, Teacher)
router.put(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin", "teacher"),
  updateMaterial
);

// Delete Study Material (Principal, Director, Admin, Teacher)
router.delete(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin", "teacher"),
  deleteMaterial
);

module.exports = router;
