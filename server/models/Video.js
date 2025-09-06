const { ServerDescription } = require('mongodb');
const mongoose = require('mongoose');  

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'please add a video title']
    },
    description: {
        type: String,
        maxlength: [1000, 'description can not be more than 1000 characters']
    },
    fileUrl: {
        type: String,
        required: [true, 'please add a file url']
    },
    thumbnailUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['draft', 'pending_review', 'approved', 'rejected', 'published'],
        default: 'draft'
    },
    projectId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
        required: true
    },
    editor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    youtubeVideoId: {
        type: String
    },
    deletedAt: { 
        type: Date, 
        default: null 
    }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema); 

