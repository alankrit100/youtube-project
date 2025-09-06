const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be for more than 500 characters']
    },
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    editors: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    videos: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Video'
    }],
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Project', ProjectSchema);