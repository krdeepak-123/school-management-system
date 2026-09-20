const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  setUserStatus,
  resetUserPassword,
} = require('../controllers/adminController');

const router = express.Router();

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register admin
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists with this email' });
    }

    const admin = await Admin.create({ name, email, password });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get logged-in admin profile
router.get('/profile', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ User management ------------------
// All routes below reach the real adminController and are
// protected so only an authenticated admin can manage them.

// List all system users (search / role / status filters)
router.get('/users', protect, authorizeRoles('admin'), listUsers);

// Account stats for the admin dashboard
router.get('/users/stats', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const User = require('../models/User');
    const [total, active, teachers, students, directors, principals] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'Active' }),
      User.countDocuments({ role: 'teacher' }),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'director' }),
      User.countDocuments({ role: 'principal' }),
    ]);
    res.json({ total, active, teachers, students, directors, principals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single user
router.get('/users/:id', protect, authorizeRoles('admin'), getUserById);

// Create a new user (any supported role)
router.post('/users', protect, authorizeRoles('admin'), createUser);

// Update a user (role / status / details)
router.put('/users/:id', protect, authorizeRoles('admin'), updateUser);

// Activate / deactivate a user
router.put('/users/:id/status', protect, authorizeRoles('admin'), setUserStatus);

// Reset a user's password
router.put('/users/:id/reset-password', protect, authorizeRoles('admin'), resetUserPassword);

module.exports = router;
