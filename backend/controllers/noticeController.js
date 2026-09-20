const mongoose = require("mongoose");
const Notice = require("../models/Notice");

// ==========================================
// GENERATE NOTICE ID
// ==========================================
const generateNoticeId = async () => {
  const last = await Notice.findOne().sort({ createdAt: -1 });
  if (!last || !last.noticeId) return "NOT001";
  const lastNumber = parseInt(last.noticeId.replace("NOT", ""), 10);
  return `NOT${String(lastNumber + 1).padStart(3, "0")}`;
};

// ==========================================
// CREATE NOTICE (Principal, Director, Admin)
// ==========================================
exports.createNotice = async (req, res) => {
  try {
    const { title, message, audience } = req.body;

    if (!title || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Title and message are required" });
    }

    const noticeId = await generateNoticeId();

    const notice = await Notice.create({
      noticeId,
      title,
      message,
      audience: audience || "All",
      postedBy: req.user?.name || "Administration",
    });

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: notice,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ==========================================
// GET ALL NOTICES (staff)
// ==========================================
exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// MY NOTICES (Students — audience All or Students)
// ==========================================
exports.getMyNotices = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const notices = await Notice.find({
      audience: { $in: ["All", "Students"] },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// GET SINGLE NOTICE (staff)
// ==========================================
exports.getSingleNotice = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid notice id" });
    }

    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }

    res.status(200).json({ success: true, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// UPDATE NOTICE (Principal, Director, Admin)
// ==========================================
exports.updateNotice = async (req, res) => {
  try {
    const { title, message, audience } = req.body;

    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(message && { message }),
        ...(audience && { audience }),
      },
      { new: true, runValidators: true }
    );

    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }

    res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      data: notice,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ==========================================
// DELETE NOTICE (Principal, Director, Admin)
// ==========================================
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }

    res.status(200).json({ success: true, message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
