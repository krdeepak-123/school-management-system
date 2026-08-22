const express = require("express");

const router = express.Router();

const {
createFee,
getFees,
getSingleFee,
updateFee,
deleteFee,
} = require("../controllers/feeController");

// ==========================================
// CREATE FEE
// POST /api/fees
// ==========================================
router.post("/", createFee);

// ==========================================
// GET ALL FEES
// GET /api/fees
// ==========================================
router.get("/", getFees);

// ==========================================
// GET SINGLE FEE
// GET /api/fees/:id
// ==========================================
router.get("/:id", getSingleFee);

// ==========================================
// UPDATE FEE
// PUT /api/fees/:id
// ==========================================
router.put("/:id", updateFee);

// ==========================================
// DELETE FEE
// DELETE /api/fees/:id
// ==========================================
router.delete("/:id", deleteFee);

module.exports = router;
