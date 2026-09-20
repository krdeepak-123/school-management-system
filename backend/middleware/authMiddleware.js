const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }

  // Load the account from the User collection, falling back to the legacy Admin collection
  let user = await User.findById(decoded.id);
  if (!user) user = await Admin.findById(decoded.id);

  if (!user) {
    return res.status(401).json({ message: 'Not authorized, user not found' });
  }

  if (user.status === 'Inactive') {
    return res.status(403).json({ message: 'Your account is inactive. Contact administration.' });
  }

  req.user = {
    id: decoded.id,
    role: user.role,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    userId: user.userId,
    linkedId: user.linkedId || null,
    status: user.status,
  };

  next();
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = { protect, authorizeRoles };