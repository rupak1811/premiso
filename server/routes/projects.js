const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    const query = {};

    // Filter by user role
    if (req.user.role === 'user') {
      query.applicant = req.user._id;
    } else if (req.user.role === 'reviewer') {
      query.reviewer = req.user._id;
    }

    // Additional filters
    if (status) query.status = status;
    if (type) query.type = type;

    const projects = await Project.find(query)
      .populate('applicant', 'name email')
      .populate('reviewer', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(query);

    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('applicant', 'name email phone')
      .populate('reviewer', 'name email')
      .populate('reviewComments.reviewer', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check access permissions
    if (req.user.role === 'user' && project.applicant._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
router.post('/', auth, authorize('user'), [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').optional().trim(),
  body('type').isIn(['building', 'renovation', 'commercial', 'residential', 'other']).withMessage('Invalid project type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, type, location } = req.body;

    const project = new Project({
      title,
      description,
      type,
      location,
      applicant: req.user._id
    });

    await project.save();

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').optional().trim(),
  body('status').optional().isIn(['draft', 'submitted', 'under_review', 'approved', 'rejected', 'withdrawn'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check permissions
    if (req.user.role === 'user' && project.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, status, forms, documents } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (status) updateData.status = status;
    if (forms) updateData.forms = forms;
    if (documents) updateData.documents = documents;

    // Update timestamps based on status
    if (status === 'submitted' && !project.submittedAt) {
      updateData.submittedAt = new Date();
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('applicant', 'name email');

    // Create notification for status change
    if (status && status !== project.status) {
      const notification = new Notification({
        user: project.applicant,
        type: 'status_change',
        title: 'Project Status Updated',
        message: `Your project "${project.title}" status has been updated to ${status.replace('_', ' ')}`,
        project: project._id
      });
      await notification.save();

      // Emit real-time notification
      const io = req.app.get('io');
      io.to(project.applicant.toString()).emit('notification', {
        type: 'status_change',
        title: 'Project Status Updated',
        message: `Your project "${project.title}" status has been updated to ${status.replace('_', ' ')}`
      });
    }

    res.json({
      message: 'Project updated successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check permissions
    if (req.user.role === 'user' && project.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects/:id/assign
// @desc    Assign project to reviewer
// @access  Private (Admin/Reviewer)
router.post('/:id/assign', auth, authorize('admin', 'reviewer'), async (req, res) => {
  try {
    const { reviewerId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.reviewer = reviewerId;
    project.status = 'under_review';
    await project.save();

    // Create notification for reviewer
    const notification = new Notification({
      user: reviewerId,
      type: 'status_change',
      title: 'New Project Assigned',
      message: `You have been assigned to review project "${project.title}"`,
      project: project._id
    });
    await notification.save();

    res.json({
      message: 'Project assigned successfully',
      project
    });
  } catch (error) {
    console.error('Assign project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
