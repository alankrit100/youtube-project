const Video = require('../models/Video');
const Project = require('../models/Project');
const mongoose = require('mongoose');

// @desc    Upload a new video draft
// @route   POST /api/videos/upload/:projectId
// @access  Private (Editor-only)
exports.uploadVideoDraft = async (req, res) => {
    try {
        const { title, description } = req.body;
        const projectId = req.params.projectId;
        const editorId = req.user.id;

        if (!req.file) { // FIX: Added a check for a missing file
            return res.status(400).json({ error: 'No video file uploaded' });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const isEditor = project.editors.some(id => id.toString() === editorId); // FIX: Removed space before ===
        if (req.user.role !== 'editor' || !isEditor) {
            return res.status(403).json({ error: 'Not authorized to upload to this project' });
        }

        const video = await Video.create({
            title,
            description,
            fileUrl: `/uploads/${req.file.filename}`,
            thumbnailUrl: req.body.thumbnailUrl,
            projectId,
            editor: editorId,
            status: 'draft'
        });

        project.videos.push(video._id);
        await project.save();

        res.status(201).json({
            success: true,
            message: 'Video draft uploaded successfully',
            data: video
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' }); // FIX: Standardized error message
    }
};

// @desc    Get video details
// @route   GET /api/videos/:videoId
// @access  Private
exports.getVideoDetails = async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId)
            .populate('projectId', 'title')
            .populate('editor', 'name email');

        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        // FIX: Simplified the authorization logic for clarity and correctness
        const project = await Project.findById(video.projectId);
        const isProjectCreator = project.creator.toString() === req.user.id;
        const isProjectEditor = project.editors.some(id => id.toString() === req.user.id);
        
        if (!isProjectCreator && !isProjectEditor) {
             return res.status(403).json({ error: 'Not authorized to view this video' });
        }

        res.status(200).json({
            success: true,
            data: video
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error'});
    }
};


// @desc    Update video status (approve, reject, etc)
// @route   PUT /api/videos/status/:videoId
// @access  Private (Creator-only)
exports.updateVideoStatus = async(req, res) => {
    try {
        const { status } = req.body;
        const video = await Video.findById(req.params.videoId);

        if(!video) {
            return res.status(404).json({error: 'Video not found'}); // FIX: Standardized error message
        }

        const project = await Project.findById(video.projectId);
        // Ensure only the creator of the project can change the status
        if (req.user.role !== 'creator' || project.creator.toString() !== req.user.id) {
            return res.status(403).json({error: 'Not authorized to change video status'});
        }

        const validStatus = ['pending_review', 'approved', 'rejected'];
        if(!validStatus.includes(status)) {
            return res.status(400).json({error: 'Invalid status provided'});
        }

        video.status = status;
        await video.save();

        res.status(200).json({
            success: true,
            message: `Video status updated to ${status}`,
            data: video
        });

        // TO-DO Implement Youtube API publishing logic here for 'approved' status
        if (status === 'approved'){
            console.log(`Video ${video._id} has been approved. Publishing to Youtube`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error: 'Server error'});
    }
};