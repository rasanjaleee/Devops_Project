// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['STUDENT', 'ADMIN'],
    default: 'STUDENT',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Fix: Check if model already exists before compiling
module.exports = mongoose.models.User || mongoose.model('User', userSchema);