const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));
app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/workshops', require('./routes/workshopRoutes'));


const enrollmentRoutes = require('./routes/enrollmentRoutes');
console.log('Enrollment routes loaded');
app.use('/api/enrollments', enrollmentRoutes);


app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);
