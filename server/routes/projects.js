const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createProject, getProjects, addEditorToProject } = require('../controllers/projects');

router.use(protect);

// @desc      Create a new project
// @route     POST /api/projects
// @access    Private(creator only)
router.post('/', authorize('creator'), createProject);

// @desc      Get all projects for a user
// @route     GET /api/projects
// @access    Private
router.get('/', getProjects);

// @desc      Add an editor to a project
// @route     GET /api/projects/:projectId/add-editor
// @access    Private (creator-only)
router.put('/:projectId/add-editor', authorize('creator'), addEditorToProject);

module.exports = router;