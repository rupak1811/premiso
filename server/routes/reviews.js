const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews/pending
// @desc    Get pending reviews for reviewer
// @access  Private (Reviewer)
router.get('/pending', auth, authorize('reviewer', 'admin'), async (req, res) => {
  try {
    const { status = 'submitted', page = 1, limit = 10 } = req.query;
    
    const query = { status };
    if (req.user.role === 'reviewer') {
      query.reviewer = req.user._id;
    }

    const projects = await Project.find(query)
      .populate('applicant', 'name email phone')
      .sort({ submittedAt: -1 })
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
    console.error('Get pending reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/reviews/:projectId/approve
// @desc    Approve project
// @access  Private (Reviewer/Admin)
router.post('/:projectId/approve', auth, authorize('reviewer', 'admin'), [
  body('comment').optional().trim(),
  body('conditions').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { comment, conditions = [] } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is assigned reviewer or admin
    if (req.user.role === 'reviewer' && project.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update project status
    project.status = 'approved';
    project.approvedAt = new Date();

    // Add review comment
    if (comment) {
      project.reviewComments.push({
        reviewer: req.user._id,
        comment,
        timestamp: new Date()
      });
    }

    await project.save();

    // Create notification for applicant
    const notification = new Notification({
      user: project.applicant,
      type: 'status_change',
      title: 'Project Approved',
      message: `Your project "${project.title}" has been approved!`,
      project: project._id,
      priority: 'high'
    });
    await notification.save();

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(project.applicant.toString()).emit('notification', {
      type: 'status_change',
      title: 'Project Approved',
      message: `Your project "${project.title}" has been approved!`
    });

    res.json({
      message: 'Project approved successfully',
      project
    });
  } catch (error) {
    console.error('Approve project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/reviews/:projectId/reject
// @desc    Reject project
// @access  Private (Reviewer/Admin)
router.post('/:projectId/reject', auth, authorize('reviewer', 'admin'), [
  body('comment').trim().isLength({ min: 10 }).withMessage('Rejection comment must be at least 10 characters'),
  body('reasons').isArray({ min: 1 }).withMessage('At least one rejection reason is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { comment, reasons } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is assigned reviewer or admin
    if (req.user.role === 'reviewer' && project.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update project status
    project.status = 'rejected';
    project.rejectedAt = new Date();

    // Add review comment
    project.reviewComments.push({
      reviewer: req.user._id,
      comment: `${comment}\n\nRejection reasons: ${reasons.join(', ')}`,
      timestamp: new Date()
    });

    await project.save();

    // Create notification for applicant
    const notification = new Notification({
      user: project.applicant,
      type: 'status_change',
      title: 'Project Rejected',
      message: `Your project "${project.title}" has been rejected. Please review the comments and resubmit.`,
      project: project._id,
      priority: 'high'
    });
    await notification.save();

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(project.applicant.toString()).emit('notification', {
      type: 'status_change',
      title: 'Project Rejected',
      message: `Your project "${project.title}" has been rejected. Please review the comments and resubmit.`
    });

    res.json({
      message: 'Project rejected successfully',
      project
    });
  } catch (error) {
    console.error('Reject project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/reviews/:projectId/comment
// @desc    Add review comment
// @access  Private (Reviewer/Admin)
router.post('/:projectId/comment', auth, authorize('reviewer', 'admin'), [
  body('comment').trim().isLength({ min: 5 }).withMessage('Comment must be at least 5 characters'),
  body('isInternal').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { comment, isInternal = false } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is assigned reviewer or admin
    if (req.user.role === 'reviewer' && project.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Add review comment
    project.reviewComments.push({
      reviewer: req.user._id,
      comment,
      isInternal,
      timestamp: new Date()
    });

    await project.save();

    // Create notification for applicant (only if not internal)
    if (!isInternal) {
      const notification = new Notification({
        user: project.applicant,
        type: 'comment',
        title: 'New Comment on Project',
        message: `A new comment has been added to your project "${project.title}"`,
        project: project._id
      });
      await notification.save();

      // Emit real-time notification
      const io = req.app.get('io');
      io.to(project.applicant.toString()).emit('notification', {
        type: 'comment',
        title: 'New Comment on Project',
        message: `A new comment has been added to your project "${project.title}"`
      });
    }

    res.json({
      message: 'Comment added successfully',
      comment: project.reviewComments[project.reviewComments.length - 1]
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reviews/stats
// @desc    Get reviewer statistics
// @access  Private (Reviewer/Admin)
router.get('/stats', auth, authorize('reviewer', 'admin'), async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'reviewer') {
      query.reviewer = req.user._id;
    }

    const stats = await Project.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalProjects = await Project.countDocuments(query);
    const completedThisMonth = await Project.countDocuments({
      ...query,
      approvedAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    res.json({
      statusBreakdown: stats,
      totalProjects,
      completedThisMonth
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
