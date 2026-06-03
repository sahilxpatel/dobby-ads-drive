const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Folder = require('../models/Folder');
const Image = require('../models/Image');
const authMiddleware = require('../middleware/authMiddleware');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'dobby_ads_drive',
    allowed_formats: ['jpeg', 'png', 'jpg', 'webp', 'gif']
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST /api/images/upload
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    const { name, folderId } = req.body;
    let targetFolderId = folderId && folderId !== 'root' ? folderId : null;

    if (targetFolderId) {
      // Validate folder ownership
      const folder = await Folder.findOne({ _id: targetFolderId, owner: req.user.userId });
      if (!folder) {
        // Destroy uploaded file on Cloudinary since it's unauthorized
        await cloudinary.uploader.destroy(req.file.filename);
        return res.status(404).json({ message: 'Target folder not found or unauthorized' });
      }
    }

    const newImage = new Image({
      name: name || req.file.originalname,
      filename: req.file.filename, // Cloudinary public_id
      url: req.file.path, // Cloudinary secure_url
      size: req.file.size || req.file.bytes || 0,
      folder: targetFolderId,
      owner: req.user.userId
    });

    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    if (req.file && req.file.filename) {
      await cloudinary.uploader.destroy(req.file.filename).catch(() => {});
    }
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// GET /api/images/:folderId
router.get('/:folderId', async (req, res) => {
  try {
    let targetFolderId = req.params.folderId === 'root' ? null : req.params.folderId;

    if (targetFolderId) {
      const folder = await Folder.findOne({ _id: targetFolderId, owner: req.user.userId });
      if (!folder) {
        return res.status(404).json({ message: 'Folder not found or unauthorized' });
      }
    }

    const images = await Image.find({ folder: targetFolderId, owner: req.user.userId });
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/images/:id
router.delete('/:id', async (req, res) => {
  try {
    const image = await Image.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete from Cloudinary using the stored public_id (filename)
    if (image.filename && image.url) {
      await cloudinary.uploader.destroy(image.filename);
    } else {
      // Legacy local file cleanup just in case
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '../uploads', image.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Image.deleteOne({ _id: image._id });
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
