const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Test route - now returns valid JSON
router.get("/test", (req, res) => {
  res.json({ message: "Auth route is working ✅" });
});

module.exports = router;
