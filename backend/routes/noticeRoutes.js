const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createNotice,
  getNotices,
  getMyNotices,
  getSingleNotice,
  updateNotice,
  deleteNotice,
} = require("../controllers/noticeController");

// ==========================================
// MY NOTICES (Students — audience All/Students)
// Must be registered BEFORE /:id
// ==========================================
router.get("/mine", protect, getMyNotices);

// Create Notice (Principal, Director, Admin)
router.post(
  "/",
  protect,
  authorizeRoles("principal", "director", "admin"),
  createNotice
);

// Get All Notices (Teacher, Principal, Director, Admin)
router.get(
  "/",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  getNotices
);

// Get Single Notice (Teacher, Principal, Director, Admin)
router.get(
  "/:id",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  getSingleNotice
);

// Update Notice (Principal, Director, Admin)
router.put(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  updateNotice
);

// Delete Notice (Principal, Director, Admin)
router.delete(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  deleteNotice
);

module.exports = router;
