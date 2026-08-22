const express = require("express");

const router = express.Router();

const {
  createClass,
  getClasses,
  getClass,
  updateClass,
  deleteClass,
} = require("../controllers/classController");

// ==========================
// CREATE CLASS
// ==========================
router.post("/", createClass);

// ==========================
// GET ALL CLASSES
// ==========================
router.get("/", getClasses);

// ==========================
// GET SINGLE CLASS
// ==========================
router.get("/:id", getClass);

// ==========================
// UPDATE CLASS
// ==========================
router.put("/:id", updateClass);

// ==========================
// DELETE CLASS
// ==========================
router.delete("/:id", deleteClass);

module.exports = router;