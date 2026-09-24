const express = require('express');
const router = express.Router();

const {
  register,
  registerAdmin,
  login,
  getMe,
  updateMe,
  changePassword,
  forgotPassword,
  resetPasswordWithOtp,
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
// FORGOT PASSWORD (request OTP)
// ==========================================
router.post('/forgot-password', forgotPassword);

// ==========================================
// RESET PASSWORD (verify OTP + set new password)
// ==========================================
router.post('/reset-password', resetPasswordWithOtp);

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
// UPDATE CURRENT USER PROFILE
// ==========================================
router.put('/me', protect, updateMe);

// ==========================================
// CHANGE PASSWORD (any logged-in user)
// ==========================================
router.post('/change-password', protect, changePassword);

module.exports = router;