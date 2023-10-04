const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination(req, file, callback) {
    const filePath = path.join('./uploads/advertisements');
    fs.mkdirSync(filePath, { recursive: true }, (err) => {
      if (err) throw err;
    });
    callback(null, filePath);
  },
  filename(req, file, callback) {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

module.exports = multer({ storage });
