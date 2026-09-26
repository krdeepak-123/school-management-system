const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const PasswordReset = require('../models/PasswordReset');

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password) =>
  /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
const isValidMobile = (mobile) => /^\d{10,15}$/.test(String(mobile));
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const PUBLIC_ROLES = ['student', 'teacher', 'principal', 'director'];

const loadLinkedData = async (user) => {
  if (!user.linkedId || user.role === 'admin') return null;
  if (user.role === 'student') return Student.findById(user.linkedId);
  if (user.role === 'teacher') return Teacher.findById(user.linkedId);
  return null;
};

// ==========================================
// PUBLIC REGISTRATION (Student, Teacher, Principal, Director)
// ==========================================
exports.register = async (req, res) => {
  try {
    const { role, name, email, mobile, userId, password, confirmPassword } = req.body;

    if (!PUBLIC_ROLES.includes(role)) {
      return res.status(403).json({
        message: 'Admin accounts cannot be created through public registration. Contact an existing administrator.',
      });
    }

    if (!name || !email || !mobile || !userId || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    if (!isValidMobile(mobile)) {
      return res.status(400).json({ message: 'Mobile number must be 10-15 digits' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and include both letters and numbers',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUserId = userId.trim();

    // Duplicate email across User collection
    const userByEmail = await User.findOne({ email: normalizedEmail });
    if (userByEmail) {
      return res.status(400).json({ message: 'An account already exists with this email' });
    }

    // Duplicate email across legacy Admin collection
    const adminByEmail = await Admin.findOne({ email: normalizedEmail });
    if (adminByEmail) {
      return res.status(400).json({ message: 'An account already exists with this email' });
    }

    // Duplicate User ID
    const userByUserId = await User.findOne({ userId: normalizedUserId });
    if (userByUserId) {
      return res.status(400).json({ message: 'This User ID is already registered' });
    }

    let linkedId = null;

    // Connect a Student registration to the existing Student record
    if (role === 'student') {
      const student = await Student.findOne({ admissionNo: normalizedUserId });
      if (!student) {
        return res.status(400).json({
          message: `No student record found with Admission No "${normalizedUserId}". Please use the Admission No given at the time of admission.`,
        });
      }

      const alreadyLinked = await User.findOne({ role: 'student', linkedId: student._id });
      if (alreadyLinked) {
        return res.status(400).json({ message: 'An account already exists for this student record' });
      }

      if (student.email && student.email.toLowerCase() !== normalizedEmail) {
        return res.status(400).json({ message: 'Email does not match the student record' });
      }

      if (!student.email) {
        student.email = normalizedEmail;
        await student.save();
      }

      linkedId = student._id;
    }

    // Connect a Teacher registration to the existing Teacher record
    if (role === 'teacher') {
      const teacher = await Teacher.findOne({ teacherId: normalizedUserId });
      if (!teacher) {
        return res.status(400).json({
          message: `No teacher record found with Teacher ID "${normalizedUserId}". Please use the Teacher ID given at the time of joining.`,
        });
      }

      const alreadyLinked = await User.findOne({ role: 'teacher', linkedId: teacher._id });
      if (alreadyLinked) {
        return res.status(400).json({ message: 'An account already exists for this teacher record' });
      }

      if (teacher.email && teacher.email.toLowerCase() !== normalizedEmail) {
        return res.status(400).json({ message: 'Email does not match the teacher record' });
      }

      if (!teacher.email) {
        teacher.email = normalizedEmail;
        await teacher.save();
      }

      linkedId = teacher._id;
    }

    const user = await User.create({
      userId: normalizedUserId,
      name: name.trim(),
      email: normalizedEmail,
      password,
      mobile: mobile.trim(),
      role,
      linkedId,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please login with your new account.',
      data: {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = (error.message.match(/index: (\w+)_/) || [])[1];
      return res.status(400).json({
        message: field === 'userId' ? 'This User ID is already registered' : 'This email is already registered',
      });
    }
    console.error('REGISTER ERROR:', error);
    res.status(400).json({ message: error.message });
  }
};

// ==========================================
// PROTECTED ADMIN CREATION
// ==========================================
exports.registerAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create admin accounts' });
    }

    const { name, email, mobile, password, confirmPassword, userId } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    if (!isValidMobile(mobile)) {
      return res.status(400).json({ message: 'Mobile number must be 10-15 digits' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and include both letters and numbers',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(400).json({ message: 'An account already exists with this email' });
    }

    let finalUserId = (userId || '').trim();
    if (!finalUserId) {
      finalUserId = `ADM-${Date.now().toString().slice(-6)}`;
    }

    const existingUserId = await User.findOne({ userId: finalUserId });
    if (existingUserId) {
      return res.status(400).json({ message: 'This User ID is already registered' });
    }

    const admin = await User.create({
      userId: finalUserId,
      name: name.trim(),
      email: normalizedEmail,
      password,
      mobile: mobile.trim(),
      role: 'admin',
    });

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: {
        _id: admin._id,
        userId: admin.userId,
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        role: admin.role,
        status: admin.status,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This email or User ID is already registered' });
    }
    console.error('REGISTER ADMIN ERROR:', error);
    res.status(400).json({ message: error.message });
  }
};

// ==========================================
// LOGIN (all roles, with legacy Admin fallback)
// Identifier = User ID OR Email — the actual role
// is always resolved from the account in the DB.
// ==========================================
exports.login = async (req, res) => {
  try {
    // "identifier" accepts a User ID or an Email address.
    // "email" is kept for backward compatibility.
    const identifier = (req.body.identifier || req.body.email || '').trim();
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'User ID/Email and password are required' });
    }

    const isEmail = isValidEmail(identifier);

    let user = null;
    if (isEmail) {
      user = await User.findOne({ email: identifier.toLowerCase() }).select('+password');
    } else {
      user = await User.findOne({
        userId: new RegExp(`^${escapeRegex(identifier)}$`, 'i'),
      }).select('+password');
    }

    let isLegacyAdmin = false;

    // Legacy Admin accounts have no User ID — fallback by email only
    if (isEmail && !user) {
      const legacyAdmin = await Admin.findOne({ email: identifier.toLowerCase() }).select('+password');
      if (legacyAdmin) {
        user = legacyAdmin;
        isLegacyAdmin = true;
      }
    }

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid User ID/Email or password' });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({ message: 'Your account is inactive. Contact administration.' });
    }
    if (user.status === 'Pending') {
      return res.status(403).json({ message: 'Your account is pending approval.' });
    }

    const linkedData = isLegacyAdmin ? null : await loadLinkedData(user);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        status: user.status,
        address: user.address || "",
        linkedData,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// CHANGE PASSWORD (any logged-in user)
// ==========================================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: 'Current password, new password and confirm password are required',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and include both letters and numbers',
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: 'New password must be different from the current password',
      });
    }

    // Resolve the account (User first, legacy Admin fallback)
    let user = await User.findById(req.user.id).select('+password');
    if (!user) user = await Admin.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('CHANGE PASSWORD ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// GET LOGGED-IN PROFILE
// ==========================================
exports.getMe = async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    let isLegacyAdmin = false;

    if (!user) {
      user = await Admin.findById(req.user.id);
      isLegacyAdmin = true;
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const linkedData = isLegacyAdmin ? null : await loadLinkedData(user);

    res.json({
      success: true,
      data: {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        status: user.status,
        address: user.address || "",
        linkedData,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('GET ME ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// UPDATE LOGGED-IN PROFILE
// Only harmless account fields (name, mobile,
// address) can be changed by the account owner.
// ==========================================
exports.updateMe = async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    if (!user) user = await Admin.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, mobile, address } = req.body;

    if (name !== undefined && String(name).trim()) {
      user.name = String(name).trim();
    }

    if (mobile !== undefined && String(mobile).trim()) {
      if (!isValidMobile(mobile)) {
        return res.status(400).json({ message: 'Mobile number must be 10-15 digits' });
      }
      user.mobile = String(mobile).trim();
    }

    if (address !== undefined) {
      user.address = String(address).trim();
    }

    await user.save();

    const isLegacyAdmin = !(user instanceof User);
    const linkedData = isLegacyAdmin ? null : await loadLinkedData(user);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        status: user.status,
        address: user.address || "",
        linkedData,
      },
    });
  } catch (error) {
    console.error('UPDATE ME ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// FORGOT PASSWORD (request OTP)
// Generates a 6-digit OTP with a 10-minute
// expiry and "sends" it through sendOtpEmail.
// The response never reveals whether the email
// exists, so accounts cannot be enumerated.
// ==========================================
exports.forgotPassword = async (req, res) => {
  try {
    const email = String((req.body.email || '').trim()).toLowerCase();

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    let account = await User.findOne({ email });
    if (!account) account = await Admin.findOne({ email });

    if (!account) {
      // Do not reveal that the email is unknown
      return res.json({
        success: true,
        message: 'If an account exists with that email, an OTP has been sent.',
      });
    }

    // Invalidate any previous OTPs for this email
    await PasswordReset.updateMany(
      { email, used: false },
      { used: true, expiresAt: new Date(0) }
    );

    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await PasswordReset.create({ email, otp, expiresAt });

    sendOtpEmail(email, otp);

    res.json({
      success: true,
      message: 'If an account exists with that email, an OTP has been sent.',
    });
  } catch (error) {
    console.error('FORGOT PASSWORD ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// RESET PASSWORD (verify OTP + set new password)
// ==========================================
exports.resetPasswordWithOtp = async (req, res) => {
  try {
    const email = String((req.body.email || '').trim()).toLowerCase();
    const { otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Email, OTP and new password are required' });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and include both letters and numbers',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const record = await PasswordReset.findOne({
      email,
      used: false,
    }).select('+otp');

    if (!record || record.otp !== String(otp).trim()) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (record.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired. Request a new one.' });
    }

    let user = await User.findOne({ email });
    if (!user) user = await Admin.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Account not found' });
    }

    user.password = newPassword;
    await user.save();

    record.used = true;
    await record.save();

    res.json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.',
    });
  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// Send the OTP to the user's email.
// This project has no mailer configured, so
// the OTP is logged server-side. Swap this
// function body for a real email/SMS provider
// (e.g. Nodemailer, Twilio) in production.
// ==========================================
const sendOtpEmail = (email, otp) => {
  console.log(`[FORGOT-PASSWORD] OTP for ${email}: ${otp}`);
};