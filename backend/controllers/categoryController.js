const Category = require("../models/Category");
const Image = require("../models/Image");
const { cloudinary } = require("../config/cloudinary");

// Predefined icons mapping
const iconMapping = {
  "Feeding Bottle": "🍼",
  "Baby Toys": "🧸",
  "Baby Blanket": "🛏️",
  "Baby Comb": "🪮",
  "Clothes": "👕",
  "Diapers": "🩲",
  "Stroller": "🛒",
  "Shoes": "👟",
  "Food": "🥣",
  "Default": "👶"
};

const getIconForCategory = (name) => {
  for (const [key, value] of Object.entries(iconMapping)) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  return iconMapping["Default"];
};

// GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error: error.message });
  }
};

// POST /api/categories
exports.addCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });

    const assignedIcon = icon || getIconForCategory(name);

    const category = new Category({ name, icon: assignedIcon });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to add category", error: error.message });
  }
};

// DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Find all images in this category
    const images = await Image.find({ categoryId: id });

    // Delete images from Cloudinary or Local
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

    // Delete images from DB
    await Image.deleteMany({ categoryId: id });

    // Delete category
    await Category.findByIdAndDelete(id);

    res.status(200).json({ message: "Category and associated images deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category", error: error.message });
  }
};
