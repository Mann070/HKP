const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");
const { upload } = require("../config/cloudinary");

router.get("/:categoryId", imageController.getImagesByCategory);
router.post("/", upload.array("images", 10), imageController.uploadImages); // Max 10 images at once
router.delete("/bulk", imageController.bulkDeleteImages);
router.delete("/:id", imageController.deleteImage);

module.exports = router;
