// routes/enrollmentRoutes.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  enrollWorkshop,
  getMyEnrollments,
  updateProgress,
  cancelEnrollment,
  getEnrollmentByWorkshop
} = require('../controllers/enrollmentController');

router.get('/test', (req, res) => {
  res.json({ message: 'Enrollment routes are working!' });
});

router.post('/:id/enroll', auth, enrollWorkshop);
router.get('/my-enrollments', auth, getMyEnrollments);
router.get('/:id', auth, getEnrollmentByWorkshop);
router.patch('/:id/progress', auth, updateProgress);
router.delete('/:id/enroll', auth, cancelEnrollment);


module.exports = router;