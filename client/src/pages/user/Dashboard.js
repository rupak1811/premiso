import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  Eye,
  Download,
  Upload,
  Calculator
} from 'lucide-react';
import { Sun } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  useLanguage();
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    pendingReviews: 0,
    approvedProjects: 0,
    totalSpent: 0
  });

  // Mock data - in real app, this would come from API
  useEffect(() => {
    setProjects([
      {
        id: 1,
        title: 'Residential Building Permit',
        type: 'building',
        status: 'under_review',
        priority: 'high',
        submittedAt: '2024-01-15',
        estimatedCost: 25000,
        progress: 75
      },
      {
        id: 2,
        title: 'Commercial Renovation',
        type: 'renovation',
        status: 'approved',
        priority: 'medium',
        submittedAt: '2024-01-10',
        estimatedCost: 15000,
        progress: 100
      },
      {
        id: 3,
        title: 'Electrical Permit',
        type: 'other',
        status: 'draft',
        priority: 'low',
        submittedAt: null,
        estimatedCost: 5000,
        progress: 30
      }
    ]);

    setNotifications([
      {
        id: 1,
        title: 'Project Status Update',
        message: 'Your residential building permit has been moved to review stage',
        type: 'status_change',
        timestamp: '2 hours ago',
        isRead: false
      },
      {
        id: 2,
        title: 'New Comment',
        message: 'Reviewer added a comment to your commercial renovation project',
        type: 'comment',
        timestamp: '1 day ago',
        isRead: true
      },
      {
        id: 3,
        title: 'Payment Confirmed',
        message: 'Payment for electrical permit has been processed successfully',
        type: 'payment',
        timestamp: '2 days ago',
        isRead: true
      }
    ]);

    setStats({
      totalProjects: 12,
      pendingReviews: 3,
      approvedProjects: 8,
      totalSpent: 125000
    });
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-500',
      submitted: 'bg-blue-500',
      under_review: 'bg-yellow-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500',
      withdrawn: 'bg-gray-400'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      urgent: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4" />;
      case 'under_review':
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-300">
              Here's what's happening with your permit applications
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/projects/upload"
              className="glass-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Project</span>
            </Link>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('theme:toggle'))}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              <Sun className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Projects</p>
              <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Reviews</p>
              <p className="text-2xl font-bold text-white">{stats.pendingReviews}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Approved</p>
              <p className="text-2xl font-bold text-white">{stats.approvedProjects}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-white">${stats.totalSpent.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="lg:col-span-2"
        >
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
              <Link
                to="/projects"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="glass-card p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${getStatusColor(project.status)} rounded-lg flex items-center justify-center text-white`}>
                        {getStatusIcon(project.status)}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{project.title}</h3>
                        <p className="text-gray-400 text-sm capitalize">{project.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>${project.estimatedCost.toLocaleString()}</span>
                      </div>
                      {project.submittedAt && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(project.submittedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/projects/${project.id}`}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {project.status !== 'approved' && project.status !== 'rejected' && (
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Notifications</h2>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {notifications.filter(n => !n.isRead).length}
              </span>
            </div>

            <div className="space-y-4">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`p-4 rounded-lg transition-colors ${
                    notification.isRead 
                      ? 'bg-white/5' 
                      : 'bg-blue-500/10 border border-blue-500/20'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.isRead ? 'bg-gray-400' : 'bg-blue-400'
                    }`} />
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-gray-400 text-xs mt-1">
                        {notification.message}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              to="/notifications"
              className="block text-center text-blue-400 hover:text-blue-300 text-sm font-medium mt-4"
            >
              View All Notifications
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/projects/upload"
            className="glass-button bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 p-4 text-center"
          >
            <Upload className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">Upload Project</span>
          </Link>
          <Link
            to="/ai-assistant"
            className="glass-button bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 p-4 text-center"
          >
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">AI Assistant</span>
          </Link>
          <Link
            to="/cost-estimator"
            className="glass-button bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 p-4 text-center"
          >
            <Calculator className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">Cost Estimator</span>
          </Link>
          <Link
            to="/documents"
            className="glass-button bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 p-4 text-center"
          >
            <FileText className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">Documents</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
