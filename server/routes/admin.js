const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', auth, authorize('admin'), async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get statistics
    const [
      totalUsers,
      activeUsers,
      totalProjects,
      projectsThisPeriod,
      revenueThisPeriod,
      statusBreakdown,
      userGrowth,
      projectGrowth
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Project.countDocuments(),
      Project.countDocuments({ createdAt: { $gte: startDate } }),
      Project.aggregate([
        { $match: { paymentStatus: 'paid', updatedAt: { $gte: startDate } } },
        { $group: { _id: null, total: { $sum: '$actualCost' } } }
      ]),
      Project.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),
      Project.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ])
    ]);

    const revenue = revenueThisPeriod.length > 0 ? revenueThisPeriod[0].total : 0;

    res.json({
      overview: {
        totalUsers,
        activeUsers,
        totalProjects,
        projectsThisPeriod,
        revenueThisPeriod: revenue
      },
      statusBreakdown,
      userGrowth,
      projectGrowth,
      period
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private (Admin)
router.get('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private (Admin)
router.put('/users/:id/role', auth, authorize('admin'), [
  body('role').isIn(['user', 'reviewer', 'admin']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/projects
// @desc    Get all projects with filters
// @access  Private (Admin)
router.get('/projects', auth, authorize('admin'), async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      type, 
      reviewer,
      startDate,
      endDate 
    } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (reviewer) query.reviewer = reviewer;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

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
    console.error('Get admin projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get detailed analytics
// @access  Private (Admin)
router.get('/analytics', auth, authorize('admin'), async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Revenue analytics
    const revenueData = await Project.aggregate([
      { $match: { paymentStatus: 'paid', updatedAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$updatedAt' },
            month: { $month: '$updatedAt' },
            day: { $dayOfMonth: '$updatedAt' }
          },
          revenue: { $sum: '$actualCost' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Project type distribution
    const projectTypeDistribution = await Project.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Average processing time
    const processingTimeData = await Project.aggregate([
      { 
        $match: { 
          status: { $in: ['approved', 'rejected'] },
          submittedAt: { $exists: true }
        } 
      },
      {
        $project: {
          processingTime: {
            $divide: [
              { $subtract: ['$updatedAt', '$submittedAt'] },
              1000 * 60 * 60 * 24 // Convert to days
            ]
          },
          status: 1
        }
      },
      {
        $group: {
          _id: '$status',
          avgProcessingTime: { $avg: '$processingTime' }
        }
      }
    ]);

    res.json({
      revenueData,
      projectTypeDistribution,
      processingTimeData,
      period
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/audit
// @desc    Get audit trail
// @access  Private (Admin)
router.get('/audit', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 50, action, userId, startDate, endDate } = req.query;
    
    const query = {};
    if (action) query.type = action;
    if (userId) query.user = userId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const notifications = await Notification.find(query)
      .populate('user', 'name email role')
      .populate('project', 'title type')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);

    res.json({
      auditTrail: notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get audit trail error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
