const express = require('express');
const router = express.Router();
const workshopController = require('../controllers/workshopController');
const { auth, authorize } = require('../middleware/auth');

const {
  getWorkshops,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  getFeaturedWorkshops,
  getWorkshopsByCategory,
} = require('../controllers/workshopController');
const upload = require('../config/multer');

router.get('/', getWorkshops);
router.get('/featured', getFeaturedWorkshops);
router.get('/category/:category', getWorkshopsByCategory);
router.get('/:id',auth, getWorkshopById);

router.post(
  '/',
  auth,
  authorize('ADMIN'),
  upload.fields([
    { name: 'image', maxCount: 1 },    // single image
    { name: 'videos', maxCount: 10 }   // multiple videos
  ]),
  createWorkshop
);
router.put(
  '/:id',
  auth,
  authorize('ADMIN'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'videos', maxCount: 10 }
  ]),
  workshopController.updateWorkshop
);

router.delete('/:id', auth, authorize( 'ADMIN'), deleteWorkshop);

module.exports = router;