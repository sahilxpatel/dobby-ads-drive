const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');
const Image = require('../models/Image');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes in this file
router.use(authMiddleware);

// Helper function to calculate folder size recursively (Option A)
async function getFolderSize(folderId) {
  let size = 0;

  // Find all images in this folder
  const images = await Image.find({ folder: folderId });
  for (const img of images) {
    size += img.size;
  }

  // Find all child folders
  const childFolders = await Folder.find({ parent: folderId });
  for (const child of childFolders) {
    size += await getFolderSize(child._id);
  }

  return size;
}

// GET /api/folders - Get all root folders for the logged-in user
router.get('/', async (req, res) => {
  try {
    const folders = await Folder.find({ owner: req.user.userId, parent: null });
    res.json(folders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/folders - Create a folder
router.post('/', async (req, res) => {
  try {
    const { name, parentId } = req.body;
    
    if (parentId) {
      // Check if parent exists and belongs to user
      const parentFolder = await Folder.findOne({ _id: parentId, owner: req.user.userId });
      if (!parentFolder) {
        return res.status(404).json({ message: 'Parent folder not found' });
      }
    }

    const newFolder = new Folder({
      name,
      owner: req.user.userId,
      parent: parentId || null
    });

    await newFolder.save();
    res.status(201).json(newFolder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/folders/:id - Get folder details (including recursive size)
router.get('/:id', async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    
    const size = await getFolderSize(folder._id);
    
    res.json({ folder, size });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/folders/:id/children - Get direct children of a folder
router.get('/:id/children', async (req, res) => {
  try {
    // Validate folder ownership
    const folder = await Folder.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    const children = await Folder.find({ parent: req.params.id, owner: req.user.userId });
    res.json(children);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper for cascade delete
async function deleteFolderCascade(folderId, userId) {
  // Find child folders
  const childFolders = await Folder.find({ parent: folderId, owner: userId });
  for (const child of childFolders) {
    await deleteFolderCascade(child._id, userId);
  }
  
  // Delete all images in this folder (mocking for now since images aren't fully set up)
  await Image.deleteMany({ folder: folderId, owner: userId });
  
  // Delete the folder itself
  await Folder.deleteOne({ _id: folderId, owner: userId });
}

// DELETE /api/folders/:id - Delete folder (cascade delete children and images)
router.delete('/:id', async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    await deleteFolderCascade(folder._id, req.user.userId);
    
    res.json({ message: 'Folder and all nested contents deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
