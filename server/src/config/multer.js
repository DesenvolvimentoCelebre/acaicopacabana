const multer = require('multer');
const path = require('path');

require('')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../assets/'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage: storage})

module.exports = upload;