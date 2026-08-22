const express = require("express");

const router = express.Router();

const {
  createResult,
  getResults,
  getSingleResult,
  updateResult,
  deleteResult,
} = require("../controllers/resultController");

// ==========================================
// CREATE RESULT
// ==========================================
router.post("/", createResult);

// ==========================================
// GET ALL RESULTS
// ==========================================
router.get("/", getResults);

// ==========================================
// GET SINGLE RESULT
// ==========================================
router.get("/:id", getSingleResult);

// ==========================================
// UPDATE RESULT
// ==========================================
router.put("/:id", updateResult);

// ==========================================
// DELETE RESULT
// ==========================================
router.delete("/:id", deleteResult);

module.exports = router;