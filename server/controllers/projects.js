const Project = require('../models/Project');
const User = require('../models/User');


// @desc      Create a new project
// @route     POST /api/projects
// @access    Private(creator only)

exports.createProject = async (req, res) => {
    try {
        const { title, description } = req.body;

        const creatorId = req.user.id;
        const creatorRole = req.user.role;

        //Ensure only creators can create projects
        if (creatorRole !== 'creator') {
            return res.status(403).json({ error: 'Only creators can create projects' });
        }

        const project = await Project.create({
            title, 
            description,
            creator: creatorId,
            editors: []
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc      Get all projects for a user
// @route     GET /api/projects
// @access    Private
exports.getProjects = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let projects;

        if (userRole === 'creator') {
            // Creators see projects they created
            projects = await Project.find({ creator: userId }).populate('editors', 'name email');
        } else if (userRole === 'editor') {
            // Editors see projects they are assigned to
            projects = await Project.find({ editors: userId }).populate('creator', 'name email');
        } else {
            return res.status(403).json({ error: 'Invalid user role' });
        }

        res.status(200).json({ 
            success: true,
            count: projects.length,
            data: projects
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Add an editor to a project
// @route   PUT /api/projects/:projectId/add-editor
// @access  Private (Creator-only)
exports.addEditorToProject = async (req, res) => {
    try {
        const { editorEmail } = req.body;
        const projectId = req.params.projectId;

        // Ensure the logged-in user is the creator of this project
        const project = await Project.findById(projectId);
        if (!project || project.creator.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to modify this project' });
        }

        // Find the editor by email
        const editor = await User.findOne({ email: editorEmail, role: 'editor' });
        if (!editor) {
            return res.status(404).json({ error: 'Editor not found with that email' });
        }

        // Check if editor is already on the project
        if (project.editors.includes(editor._id)) {
            return res.status(400).json({ error: 'Editor is already on this project' });
        }

        project.editors.push(editor._id);
        await project.save();

        res.status(200).json({
            success: true,
            message: 'Editor added to project successfully',
            data: project
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};


