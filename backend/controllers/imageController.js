const Image = require("../models/Image");
const { cloudinary } = require("../config/cloudinary");

// GET /api/images/:categoryId
exports.getImagesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const images = await Image.find({ categoryId }).sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch images", error: error.message });
  }
};

// POST /api/images
// Multer middleware should be used before this in the route
exports.uploadImages = async (req, res) => {
  try {
    const { categoryId } = req.body;
    if (!categoryId) return res.status(400).json({ message: "Category ID is required" });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const imageDocs = req.files.map((file) => ({
      categoryId,
      imageUrl: file.path.startsWith("http") ? file.path : `http://localhost:${process.env.PORT || 5000}/uploads/${file.filename}`,
      cloudinaryId: file.filename, // Multer-storage-cloudinary uses filename for the public ID
    }));

    const savedImages = await Image.insertMany(imageDocs);

    res.status(201).json(savedImages);
  } catch (error) {
    res.status(500).json({ message: "Failed to upload images", error: error.message });
  }
};

// DELETE /api/images/:id
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    // Delete from Cloudinary or local file system
    if (cloudinary) {
      await cloudinary.uploader.destroy(image.cloudinaryId);
    } else {
      const fs = require("fs");
      const path = require("path");
      const filePath = path.join(__dirname, "../../uploads", image.cloudinaryId);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete from DB
    await Image.findByIdAndDelete(id);

    res.status(200).json({ message: "Image deleted successfully", id });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete image", error: error.message });
  }
};

// DELETE /api/images/bulk
exports.bulkDeleteImages = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Please provide an array of image IDs to delete" });
    }

    const images = await Image.find({ _id: { $in: ids } });
    
    // Delete from Cloudinary or local file system
    for (const image of images) {
      if (cloudinary) {
        await cloudinary.uploader.destroy(image.cloudinaryId);
      } else {
        const fs = require("fs");
        const path = require("path");
        const filePath = path.join(__dirname, "../../uploads", image.cloudinaryId);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // Delete from DB
    await Image.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: `${images.length} images deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete images", error: error.message });
  }
};
