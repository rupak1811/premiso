import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import { Sun } from 'lucide-react';

const ReviewerDashboard = () => {
  useLanguage();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    pendingReviews: 0,
    completedToday: 0,
    averageProcessingTime: 0,
    totalProjects: 0
  });

  useEffect(() => {
    // Mock data
    setProjects([
      {
        id: 1,
        title: 'Residential Building Permit',
        applicant: 'John Smith',
        type: 'building',
        status: 'under_review',
        priority: 'high',
        submittedAt: '2024-01-15',
        estimatedCost: 25000,
        daysInReview: 5
      },
      {
        id: 2,
        title: 'Commercial Renovation',
        applicant: 'Jane Doe',
        type: 'renovation',
        status: 'under_review',
        priority: 'medium',
        submittedAt: '2024-01-12',
        estimatedCost: 15000,
        daysInReview: 8
      },
      {
        id: 3,
        title: 'Electrical Permit',
        applicant: 'Mike Johnson',
        type: 'other',
        status: 'under_review',
        priority: 'low',
        submittedAt: '2024-01-18',
        estimatedCost: 5000,
        daysInReview: 2
      }
    ]);

    setStats({
      pendingReviews: 12,
      completedToday: 8,
      averageProcessingTime: 5.2,
      totalProjects: 156
    });
  }, []);

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
      case 'under_review':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <FileText className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Reviewer Dashboard</h1>
            <p className="text-gray-300">Manage and review permit applications</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                className="glass-input pl-10 w-56 md:w-64"
              />
            </div>
            <button className="glass-button border-2 border-white/30 hover:bg-white/10">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
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
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed Today</p>
              <p className="text-2xl font-bold text-white">{stats.completedToday}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
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
              <p className="text-gray-400 text-sm">Avg. Processing Time</p>
              <p className="text-2xl font-bold text-white">{stats.averageProcessingTime} days</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-400" />
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
              <p className="text-gray-400 text-sm">Total Projects</p>
              <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Projects List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Pending Reviews</h2>
          <div className="flex items-center space-x-2">
            <button className="glass-button border-2 border-white/30 hover:bg-white/10">
              <Calendar className="w-4 h-4 mr-2" />
              Sort by Date
            </button>
            <button className="glass-button border-2 border-white/30 hover:bg-white/10">
              <Users className="w-4 h-4 mr-2" />
              Sort by Applicant
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-4 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-blue-400">
                    {getStatusIcon(project.status)}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{project.title}</h3>
                    <p className="text-gray-400 text-sm">by {project.applicant}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {project.daysInReview} days
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span className="capitalize">{project.type}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(project.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>$</span>
                    <span>{project.estimatedCost.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="glass-button bg-gradient-to-r from-blue-500 to-purple-600 text-sm px-4 py-2">
                    Review
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewerDashboard;
