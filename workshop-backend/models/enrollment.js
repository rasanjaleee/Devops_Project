// models/Enrollment.js
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workshop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  // Optional: Add completion certificate info
  certificateIssued: {
    type: Boolean,
    default: false
  },
  // Optional: Add notes or feedback
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Create compound index to prevent duplicate enrollments
enrollmentSchema.index({ user: 1, workshop: 1 }, { unique: true });

// Add a virtual for enrollment status
enrollmentSchema.virtual('status').get(function() {
  if (this.completed) {
    return 'completed';
  } else if (this.progress > 0) {
    return 'in-progress';
  } else {
    return 'enrolled';
  }
});

// Ensure virtual fields are serialized
enrollmentSchema.set('toJSON', { virtuals: true });

// ✅ Fix: Check if model already exists before compiling
module.exports = mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);