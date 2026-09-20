const express = require('express');
const router = express.Router();

const {
  register,
  registerAdmin,
  login,
  getMe,
  changePassword,
} = require('../controllers/authController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// ==========================================
// PUBLIC REGISTRATION
// Student / Teacher / Principal / Director
// ==========================================
router.post('/register', register);

// ==========================================
// PROTECTED ADMIN CREATION
// Only existing admins can create admin accounts
// ==========================================
router.post('/register-admin', protect, authorizeRoles('admin'), registerAdmin);

// ==========================================
// LOGIN
// ==========================================
router.post('/login', login);

// ==========================================
// LOGOUT (JWT is stateless — the client
// discards the token; endpoint exists for
// completeness / future token blacklist)
// ==========================================
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// ==========================================
// CURRENT USER PROFILE
// ==========================================
router.get('/me', protect, getMe);

// ==========================================
// CHANGE PASSWORD (any logged-in user)
// ==========================================
router.post('/change-password', protect, changePassword);

module.exports = router;