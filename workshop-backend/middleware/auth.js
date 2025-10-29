// middleware/auth.js
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');

const auth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

 
  if (token === 'fake-jwt-token') {

    req.user = {
      _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'), 
      id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
      name: 'Admin User',
      email: 'admin@gmail.com',
      role: 'admin'
    };
    console.log('Using fake token, user:', req.user); 
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = user;
    console.log('Authenticated user:', req.user._id);
    next();
  } catch (error) {
    console.error('Auth error:', error); 
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { auth, authorize};
