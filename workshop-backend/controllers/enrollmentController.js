
const Enrollment = require('../models/enrollment');
const Workshop = require('../models/workshop');
const User = require('../models/user');

const enrollWorkshop = async (req, res) => {
  try {
    const workshopId = req.params.id;
    const userId = req.user.id;

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found'
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      workshop: workshopId
    });

    if (existingEnrollment) {
      return res.status(200).json({
        success: true,
        message: 'Already enrolled in this workshop',
         alreadyEnrolled: true
      });
    }


    const enrollment = new Enrollment({
      user: userId,
      workshop: workshopId,
      enrolledAt: new Date(),
      progress: 0,
      completed: false
    });

    await enrollment.save();
    workshop.enrolled += 1;
    await workshop.save();

    await enrollment.populate('workshop');

    res.status(201).json({
  success: true,
  message: 'Successfully enrolled in workshop',
  data: { ...enrollment.toObject(), isEnrolled: true }
});

  } catch (error) {
    console.error('Enroll workshop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during enrollment',
      error: error.message
    });
  }
};


const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await Enrollment.find({ user: userId })
      .populate('workshop') 
      .sort({ enrolledAt: -1 }); 

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments: enrollments
    });

  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching enrollments',
      error: error.message
    });
  }
};


const getEnrollmentByWorkshop = async (req, res) => {
  try {
    const workshopId = req.params.id;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({
      user: userId,
      workshop: workshopId
    }).populate('workshop');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: enrollment
    });

  } catch (error) {
    console.error('Get enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching enrollment',
      error: error.message
    });
  }
};


const updateProgress = async (req, res) => {
  try {
    const workshopId = req.params.id;
    const userId = req.user.id;
    const { progress, completed } = req.body;

    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be between 0 and 100'
      });
    }

    const enrollment = await Enrollment.findOne({
      user: userId,
      workshop: workshopId
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    enrollment.progress = progress;
    enrollment.completed = completed || progress === 100;
    
    if (enrollment.completed && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
    } else if (!enrollment.completed) {
      enrollment.completedAt = null;
    }

    await enrollment.save();
    await enrollment.populate('workshop');

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: enrollment
    });

  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating progress',
      error: error.message
    });
  }
};

const cancelEnrollment = async (req, res) => {
  try {
    const workshopId = req.params.id;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOneAndDelete({
      user: userId,
      workshop: workshopId
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

     const workshop = await Workshop.findById(workshopId);
    if (workshop && workshop.enrolled > 0) {
      workshop.enrolled -= 1;
      await workshop.save();
    }

    res.status(200).json({
  success: true,
  message: 'Enrollment cancelled successfully',
  isEnrolled: false
});


  } catch (error) {
    console.error('Cancel enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error cancelling enrollment',
      error: error.message
    });
  }
};

module.exports = {
  enrollWorkshop,
  getMyEnrollments,
  getEnrollmentByWorkshop,
  updateProgress,
  cancelEnrollment
};