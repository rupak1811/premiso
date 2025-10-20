import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Clock,
  FileText,
  User,
  MessageCircle,
  Calendar,
  DollarSign,
  Download,
  Eye,
  Edit
} from 'lucide-react';

const ReviewDetails = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewDecision, setReviewDecision] = useState('');

  useEffect(() => {
    // Mock project data
    const mockProject = {
      id: id,
      title: 'Residential Building Permit',
      applicant: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      type: 'building',
      status: 'under_review',
      priority: 'high',
      submittedAt: '2024-01-15',
      estimatedCost: 25000,
      estimatedTimeline: 90,
      location: {
        address: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102'
      },
      description: 'Construction of a new single-family home with attached garage',
      documents: [
        { 
          name: 'Building Plans.pdf', 
          type: 'application/pdf', 
          size: 2048000, 
          uploadedAt: '2024-01-15',
          status: 'verified'
        },
        { 
          name: 'Site Survey.jpg', 
          type: 'image/jpeg', 
          size: 1024000, 
          uploadedAt: '2024-01-15',
          status: 'pending'
        },
        { 
          name: 'Engineering Report.pdf', 
          type: 'application/pdf', 
          size: 1536000, 
          uploadedAt: '2024-01-16',
          status: 'verified'
        }
      ],
      reviewComments: [
        {
          id: 1,
          reviewer: 'Jane Doe',
          comment: 'Please provide additional details about the foundation design.',
          timestamp: '2024-01-20',
          isInternal: false
        },
        {
          id: 2,
          reviewer: 'Mike Johnson',
          comment: 'The electrical plan needs to be updated to meet current code requirements.',
          timestamp: '2024-01-22',
          isInternal: false
        }
      ]
    };

    setTimeout(() => {
      setProject(mockProject);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <FileText className="w-4 h-4 text-blue-400" />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      verified: 'text-green-400 bg-green-500/20',
      pending: 'text-yellow-400 bg-yellow-500/20',
      rejected: 'text-red-400 bg-red-500/20'
    };
    return colors[status] || 'text-gray-400 bg-gray-500/20';
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card text-center p-8">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Project Not Found</h2>
          <p className="text-gray-400">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{project.title}</h1>
              <p className="text-gray-400">Review Project ID: #{project.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(project.priority)}`}>
              {project.priority}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              Under Review
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-white font-medium">{project.applicant}</p>
              <p className="text-gray-400 text-sm">{project.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-white font-medium">{new Date(project.submittedAt).toLocaleDateString()}</p>
              <p className="text-gray-400 text-sm">Submitted</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <DollarSign className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-white font-medium">${project.estimatedCost.toLocaleString()}</p>
              <p className="text-gray-400 text-sm">Estimated Cost</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-white font-medium">{project.estimatedTimeline} days</p>
              <p className="text-gray-400 text-sm">Timeline</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Project Description</h2>
            <p className="text-gray-300 leading-relaxed">{project.description}</p>
            
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h3 className="text-white font-medium mb-2">Location</h3>
              <p className="text-gray-300">
                {project.location.address}<br />
                {project.location.city}, {project.location.state} {project.location.zipCode}
              </p>
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Documents</h2>
            <div className="space-y-3">
              {project.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(doc.status)}
                    <div>
                      <p className="text-white font-medium">{doc.name}</p>
                      <p className="text-gray-400 text-sm">
                        {formatFileSize(doc.size)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Review Comments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Review Comments</h2>
            <div className="space-y-4">
              {project.reviewComments.map((comment) => (
                <div key={comment.id} className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-medium">{comment.reviewer}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{comment.timestamp}</span>
                  </div>
                  <p className="text-gray-300">{comment.comment}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Review Sidebar */}
        <div className="space-y-6">
          {/* Review Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Review Actions</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Add Comment
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Add your review comment..."
                  rows={4}
                  className="glass-input w-full resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Decision
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setReviewDecision('approve')}
                    className={`w-full p-3 rounded-lg font-medium transition-all duration-300 ${
                      reviewDecision === 'approve'
                        ? 'bg-green-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-green-500/20'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 inline-block mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => setReviewDecision('reject')}
                    className={`w-full p-3 rounded-lg font-medium transition-all duration-300 ${
                      reviewDecision === 'reject'
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-red-500/20'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 inline-block mr-2" />
                    Reject
                  </button>
                  <button
                    onClick={() => setReviewDecision('request_info')}
                    className={`w-full p-3 rounded-lg font-medium transition-all duration-300 ${
                      reviewDecision === 'request_info'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-yellow-500/20'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 inline-block mr-2" />
                    Request Info
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <button className="w-full glass-button bg-gradient-to-r from-blue-500 to-purple-600">
                  Submit Review
                </button>
                <button className="w-full glass-button border-2 border-white/30 hover:bg-white/10">
                  Save Draft
                </button>
              </div>
            </div>
          </motion.div>

          {/* Project Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Project Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="text-white capitalize">{project.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Priority:</span>
                <span className="text-white capitalize">{project.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-white capitalize">{project.status.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Documents:</span>
                <span className="text-white">{project.documents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Comments:</span>
                <span className="text-white">{project.reviewComments.length}</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full glass-button border-2 border-white/30 hover:bg-white/10">
                <Edit className="w-4 h-4 mr-2" />
                Edit Project
              </button>
              <button className="w-full glass-button border-2 border-white/30 hover:bg-white/10">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Applicant
              </button>
              <button className="w-full glass-button border-2 border-white/30 hover:bg-white/10">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;
