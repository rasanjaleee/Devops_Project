
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {

    cb(null, Date.now() + path.extname(file.originalname));
  }
});


function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
 

  if(extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images and Videos Only!'));
  }
}


const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, 
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = upload;
