// models/Workshop.js
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  order: { type: Number, default: 1 },
  duration: { type: String },
});

const workshopSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  duration: {
    type: String, // in hours
    required: true,
  },
  image: {
    type: String, // URL to workshop image
  },
  price: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'COMPLETED'],
    default: 'ACTIVE',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  videos: [videoSchema]
});

module.exports = mongoose.models.Workshop || mongoose.model('Workshop', workshopSchema);