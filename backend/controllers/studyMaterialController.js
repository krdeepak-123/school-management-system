const mongoose = require("mongoose");
const StudyMaterial = require("../models/StudyMaterial");
const Student = require("../models/Student");

// ==========================================
// GENERATE MATERIAL ID
// ==========================================
const generateMaterialId = async () => {
  const last = await StudyMaterial.findOne().sort({ createdAt: -1 });
  if (!last || !last.materialId) return "MAT001";
  const lastNumber = parseInt(last.materialId.replace("MAT", ""), 10);
  return `MAT${String(lastNumber + 1).padStart(3, "0")}`;
};

// ==========================================
// CREATE STUDY MATERIAL (Principal, Director, Admin, Teacher)
// ==========================================
exports.createMaterial = async (req, res) => {
  try {
    const { title, description, className, section, subject, link, uploadedBy } =
      req.body;

    if (!title || !className || !subject) {
      return res.status(400).json({
        success: false,
        message: "Title, class and subject are required",
      });
    }

    const materialId = await generateMaterialId();

    const material = await StudyMaterial.create({
      materialId,
      title,
      description: description || "",
      className,
      section: section || "",
      subject,
      link: link || "",
      uploadedBy: uploadedBy || req.user?.name || "",
    });

    res.status(201).json({
      success: true,
      message: "Study material created successfully",
      data: material,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ==========================================
// GET ALL STUDY MATERIALS (staff)
// ==========================================
exports.getMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: materials.length,
      data: materials,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// MY STUDY MATERIALS (Students — only their class/section)
// ==========================================
exports.getMyMaterials = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const student = await Student.findById(req.user.linkedId);

    if (!student) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const query = { className: student.className };
    if (student.section) {
      query.$or = [
        { section: student.section },
        { section: "" },
        { section: null },
      ];
    }

    const materials = await StudyMaterial.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: materials.length,
      data: materials,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// GET SINGLE STUDY MATERIAL (staff)
// ==========================================
exports.getSingleMaterial = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid material id" });
    }

    const material = await StudyMaterial.findById(req.params.id);

    if (!material) {
      return res
        .status(404)
        .json({ success: false, message: "Study material not found" });
    }

    res.status(200).json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// UPDATE STUDY MATERIAL (Principal, Director, Admin, Teacher)
// ==========================================
exports.updateMaterial = async (req, res) => {
  try {
    const { title, description, className, section, subject, link, uploadedBy } =
      req.body;

    const material = await StudyMaterial.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(className && { className }),
        ...(section !== undefined && { section }),
        ...(subject && { subject }),
        ...(link !== undefined && { link }),
        ...(uploadedBy !== undefined && { uploadedBy }),
      },
      { new: true, runValidators: true }
    );

    if (!material) {
      return res
        .status(404)
        .json({ success: false, message: "Study material not found" });
    }

    res.status(200).json({
      success: true,
      message: "Study material updated successfully",
      data: material,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ==========================================
// DELETE STUDY MATERIAL (Principal, Director, Admin, Teacher)
// ==========================================
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findByIdAndDelete(req.params.id);

    if (!material) {
      return res
        .status(404)
        .json({ success: false, message: "Study material not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Study material deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
