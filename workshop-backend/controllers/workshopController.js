
const Workshop = require('../models/workshop');
const Enrollment = require('../models/enrollment');

exports.createWorkshop = async (req, res) => {
  try {
    const { title, description, category, instructor, duration, price,featured } = req.body;

   
    const videos = req.files['videos']
      ? req.files['videos'].map((file, index) => ({
          filename: file.filename,
          path: `/uploads/${file.filename}`, 
          order: index + 1,                  
        }))
      : [];

  
    const image = req.files['image'] ? req.files['image'][0].filename : null;

    const newWorkshop = await Workshop.create({
      title,
      description,
      category,
      instructor,
      duration,
      price,
      image,
      videos,
      featured: featured === 'true' || false
    });

    res.status(201).json({
      success: true,
      message: 'Workshop created successfully',
      data: newWorkshop
    });
  } catch (error) {
    console.error('Error creating workshop:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating workshop', 
      error: error.message 
    });
  }
};



exports.updateWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ 
        success: false,
        message: 'Workshop not found' 
      });
    }

    // Update basic fields
    const fields = ['title', 'description', 'instructor', 'duration', 'category', 'price'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        workshop[field] = req.body[field];
      }
    });

    // Update image if uploaded
    if (req.files && req.files.image && req.files.image.length > 0) {
      workshop.image = req.files.image[0].filename;
    }

    // Update videos if uploaded
    if (req.files && req.files.videos && req.files.videos.length > 0) {
      const videoFiles = req.files.videos.map((file, index) => ({
        title: file.originalname,
        filename: file.filename,
        path: `/uploads/${file.filename}`,
        order: index + 1,
        duration: '' // optional, you can calculate or leave empty
      }));
      workshop.videos = videoFiles; // replace existing videos
    }

    const updatedWorkshop = await workshop.save();

    res.status(200).json({
      success: true,
      message: 'Workshop updated successfully',
      data: updatedWorkshop
    });

  } catch (error) {
    console.error('Error updating workshop:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.getWorkshops = async (req, res) => {
  try {
    // Fetch all workshops sorted by creation date
    const workshops = await Workshop.find().sort({ createdAt: -1 });

    // Convert to plain objects for enrichment
    let enrichedWorkshops = workshops.map(w => w.toObject());

    // If user is logged in, mark which workshops they are enrolled in
    if (req.user?._id) {
      const enrollments = await Enrollment.find({ user: req.user._id }).select("workshop");
      const enrolledWorkshopIds = enrollments.map(e => e.workshop.toString());

      enrichedWorkshops = enrichedWorkshops.map(w => ({
        ...w,
        isEnrolled: enrolledWorkshopIds.includes(w._id.toString())
      }));
    } else {
      // For guests, mark all workshops as not enrolled
      enrichedWorkshops = enrichedWorkshops.map(w => ({
        ...w,
        isEnrolled: false
      }));
    }

    res.status(200).json({
      success: true,
      count: enrichedWorkshops.length,
      data: enrichedWorkshops
    });
  } catch (error) {
    console.error('Error fetching workshops:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching workshops',
      error: error.message 
    });
  }
};



exports.getWorkshopById = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ 
        success: false,
        message: 'Workshop not found' 
      });
    }

    const videos = [...workshop.videos].sort((a, b) => a.order - b.order);

    let enrollmentInfo = null;
    let isEnrolled = false;
    
    if (req.user) {
      enrollmentInfo = await Enrollment.findOne({ 
        user: req.user._id, 
        workshop: workshop._id 
      });
      isEnrolled = !!enrollmentInfo;
    }

    res.status(200).json({
      success: true,
      data: {
        ...workshop.toObject(), 
        videos,
        isEnrolled, 
        enrollmentInfo 
      }
    });
  } catch (error) {
    console.error('Error fetching workshop by ID:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching workshop' 
    });
  }
};


exports.deleteWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ 
        success: false,
        message: 'Workshop not found' 
      });
    }

    await Workshop.findByIdAndDelete(req.params.id);
    res.status(200).json({ 
      success: true,
      message: 'Workshop deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};


exports.getWorkshopsByCategory = async (req, res) => {
  try {
    const workshops = await Workshop.find({ category: req.params.category });
    
    let enrichedWorkshops = workshops.map(w => w.toObject());


    if (req.user?._id) {
      const enrollments = await Enrollment.find({ user: req.user._id }).select("workshop");
      const enrolledWorkshopIds = enrollments.map(e => e.workshop.toString());

      enrichedWorkshops = workshops.map(w => ({
        ...w.toObject(),
        isEnrolled: enrolledWorkshopIds.includes(w._id.toString())
      }));
    } else {
      enrichedWorkshops = workshops.map(w => ({
        ...w.toObject(),
        isEnrolled: false
      }));
    }
    
    res.status(200).json({
      success: true,
      count: enrichedWorkshops.length,
      data: enrichedWorkshops
    });
  } catch (error) {
    console.error('Error fetching workshops by category:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getFeaturedWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find({ featured: true })
      .limit(3)
      .sort('-createdAt');

    let enrichedWorkshops = workshops.map(w => w.toObject());

    if (req.user?._id) {
      const enrollments = await Enrollment.find({ user: req.user._id }).select("workshop");
      const enrolledWorkshopIds = enrollments.map(e => e.workshop.toString());

      enrichedWorkshops = workshops.map(w => ({
        ...w.toObject(),
        isEnrolled: enrolledWorkshopIds.includes(w._id.toString())
      }));
    } else {
      enrichedWorkshops = workshops.map(w => ({
        ...w.toObject(),
        isEnrolled: false
      }));
    }

    res.status(200).json({
      success: true,
      count: enrichedWorkshops.length,
      data: enrichedWorkshops
    });
  } catch (error) {
    console.error('Error fetching featured workshops:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};