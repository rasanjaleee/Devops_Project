// generateHash.js
const bcrypt = require('bcryptjs');

const password = "admin123"; // the plaintext password you want to hash
const saltRounds = 10;       // bcrypt salt complexity

// Generate hash
const hash = bcrypt.hashSync(password, saltRounds);

console.log("Bcrypt hash:", hash);
