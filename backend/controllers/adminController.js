const User = require('../models/User');
const Admin = require('../models/Admin');

// =====================================
// ADMIN — SYSTEM USER MANAGEMENT
// Real CRUD over the same User collection
// the auth portal registers into, plus a
// lightweight aggregate for the Admin
// dashboard. Everything behind protect +
// authorizeRoles('admin') in the routes.
// =====================================

// ---------- List users (search + filters) ----------
const listUsers = async (req, res) => {
  try {
    const { search = '', role = '', status = '' } = req.query;

    const filter = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ name: regex }, { email: regex }, { userId: regex }, { mobile: regex }];
    }

    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await User.find(filter).sort({ createdAt: -1 });

    res.json({
      data: users.map((u) => ({
        _id: u._id,
        userId: u.userId,
        name: u.name,
        email: u.email,
        mobile: u.mobile,
        role: u.role,
        status: u.status,
        linkedId: u.linkedId,
        createdAt: u.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- Get one user ----------
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      _id: user._id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      status: user.status,
      linkedId: user.linkedId,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- Create a user (any supported role) ----------
const createUser = async (req, res) => {
  try {
    const { userId, name, email, password, mobile, role, status, linkedId } = req.body;

    if (!userId || !name || !email || !password || !mobile || !role) {
      return res.status(400).json({ message: 'userId, name, email, password, mobile, and role are required' });
    }

    const existing = await User.findOne({ $or: [{ email }, { userId }] });
    if (existing) {
      return res.status(400).json({ message: 'A user with this email or user ID already exists' });
    }

    const user = await User.create({
      userId,
      name,
      email,
      password,
      mobile,
      role,
      status: status || 'Active',
      linkedId: linkedId || null,
    });

    res.status(201).json({
      _id: user._id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      status: user.status,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ---------- Update a user (role, status, details) ----------
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, mobile, role, status, linkedId } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (role) user.role = role;
    if (status) user.status = status;
    if (linkedId !== undefined) user.linkedId = linkedId;

    const updated = await user.save();

    res.json({
      _id: updated._id,
      userId: updated.userId,
      name: updated.name,
      email: updated.email,
      mobile: updated.mobile,
      role: updated.role,
      status: updated.status,
      linkedId: updated.linkedId,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ---------- Activate / Deactivate an account ----------
const setUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Active or Inactive' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.status = status;
    await user.save();

    res.json({ message: `Account ${status === 'Active' ? 'activated' : 'deactivated'}`, status: user.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- Reset a user's password ----------
const resetUserPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.params.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = password;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  setUserStatus,
  resetUserPassword,
};
