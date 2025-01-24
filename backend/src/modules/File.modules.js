const multer = require("multer");
const path = require("path");

// Set up multer disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const uniqueName = `${path.basename(
      file.originalname,
      extension
    )}-${Date.now()}${extension}`;
    cb(null, uniqueName);
  },
});

// Initialize multer with the defined storage
const upload = multer({ storage });

module.exports = upload;
