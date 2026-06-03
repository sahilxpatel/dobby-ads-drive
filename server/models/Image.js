const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // User-provided label
  },
  filename: {
    type: String,
    required: true, // Disk/cloud filename (public_id for cloudinary)
  },
  url: {
    type: String,
    required: false, // Cloudinary URL
  },
  size: {
    type: Number,
    required: true, // Bytes, stored at upload time
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null, // Null means it's in the root
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Image', ImageSchema);
