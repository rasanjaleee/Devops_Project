const bcrypt = require('bcryptjs');

async function hashPassword() {
  const password = 'admin123';  // Replace this with the admin password you want
  const hashed = await bcrypt.hash(password, 10);
  console.log('Hashed password:', hashed);
}

hashPassword();
