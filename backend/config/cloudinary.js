const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

let storage;

if (process.env.CLOUDINARY_API_KEY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "harsiddh_kids_point",
      allowedFormats: ["jpg", "jpeg", "png", "webp"],
    },
  });
} else {
  console.log("No Cloudinary credentials found, using local disk storage for demo...");
  const uploadDir = path.join(__dirname, "../uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, '-'));
    }
  });
}

const upload = multer({ storage: storage });

module.exports = { cloudinary: process.env.CLOUDINARY_API_KEY ? cloudinary : null, upload };
