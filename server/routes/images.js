const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Folder = require('../models/Folder');
const Image = require('../models/Image');
const authMiddleware = require('../middleware/authMiddleware');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
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
        // Cleanup the uploaded file
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: 'Target folder not found or unauthorized' });
      }
    }

    const newImage = new Image({
      name: name || req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      folder: targetFolderId,
      owner: req.user.userId
    });

    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
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

    // Delete file from disk
    const filePath = path.join(uploadDir, image.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Image.deleteOne({ _id: image._id });
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
