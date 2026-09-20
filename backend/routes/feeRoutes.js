const express = require("express");

const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  createFee,
  getFees,
  getSingleFee,
  updateFee,
  deleteFee,
  getMyFees,
} = require("../controllers/feeController");

// ==========================================
// MY FEES (any logged-in user; students get their own records)
// ==========================================
router.get("/mine", protect, getMyFees);

// ==========================================
// CREATE FEE (Principal, Director, Admin)
// ==========================================
router.post(
  "/",
  protect,
  authorizeRoles("principal", "director", "admin"),
  createFee
);

// ==========================================
// GET ALL FEES (Teacher, Principal, Director, Admin)
// ==========================================
router.get(
  "/",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  getFees
);

// ==========================================
// GET SINGLE FEE (Teacher, Principal, Director, Admin)
// ==========================================
router.get(
  "/:id",
  protect,
  authorizeRoles("teacher", "principal", "director", "admin"),
  getSingleFee
);

// ==========================================
// UPDATE FEE (Principal, Director, Admin)
// ==========================================
router.put(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  updateFee
);

// ==========================================
// DELETE FEE (Principal, Director, Admin)
// ==========================================
router.delete(
  "/:id",
  protect,
  authorizeRoles("principal", "director", "admin"),
  deleteFee
);

module.exports = router;