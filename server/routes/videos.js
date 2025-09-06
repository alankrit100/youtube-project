const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { uploadVideoDraft, getVideoDetails } = require('../controllers/videos');
const multer = require('multer');
const path = require('path');
const { updateVideoStatus} = require('../controllers/videos'); // Add updateVideoStatus

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

router.use(protect);

// @desc    Upload a new video draft
// @route   POST /api/videos/upload/:projectId
// @access  Private (editor only)
router.post('/upload/:projectId', upload.single('video'), uploadVideoDraft);

// @desc    Get video details
// @route   GET /api/videos/:videoId
// @access  Private (editor, reviewer, admin)
router.get('/:videoId', getVideoDetails);

// @desc    update video status (approve, reject, etc)
// @route   PUT /api/videos/status/:videoId
// @access  Private (Creator-only)

router.put('/status/:videoId', authorize('creator'), updateVideoStatus); // added the authorize middleware

module.exports = router;
