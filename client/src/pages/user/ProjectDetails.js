import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ArrowLeft, 
  Edit, 
  Download, 
  Share, 
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  MessageCircle,
  DollarSign,
  Calendar
} from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock project data
    const mockProject = {
      id: id,
      title: 'Residential Building Permit',
      description: 'Construction of a new single-family home with attached garage',
      type: 'building',
      status: 'under_review',
      priority: 'high',
      submittedAt: '2024-01-15',
      estimatedCost: 25000,
      estimatedTimeline: 90,
      progress: 75,
      location: {
        address: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102'
      },
      documents: [
        { name: 'Building Plans.pdf', type: 'application/pdf', size: 2048000, uploadedAt: '2024-01-15' },
        { name: 'Site Survey.jpg', type: 'image/jpeg', size: 1024000, uploadedAt: '2024-01-15' },
        { name: 'Engineering Report.pdf', type: 'application/pdf', size: 1536000, uploadedAt: '2024-01-16' }
      ],
      reviewComments: [
        {
          id: 1,
          reviewer: 'John Smith',
          comment: 'Please provide additional details about the foundation design.',
          timestamp: '2024-01-20',
          isInternal: false
        },
        {
          id: 2,
          reviewer: 'Jane Doe',
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5" />;
      case 'under_review':
        return <Clock className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
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
          <p className="text-gray-400 mb-4">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="glass-button bg-gradient-to-r from-blue-500 to-purple-600"
          >
            Back to Dashboard
          </button>
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
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{project.title}</h1>
              <p className="text-gray-400">Project ID: #{project.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="glass-button border-2 border-white/30 hover:bg-white/10">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button className="glass-button border-2 border-white/30 hover:bg-white/10">
              <Share className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 ${getStatusColor(project.status)} rounded-lg flex items-center justify-center text-white`}>
              {getStatusIcon(project.status)}
            </div>
            <div>
              <p className="text-white font-medium capitalize">{project.status.replace('_', ' ')}</p>
              <p className="text-gray-400 text-sm">Status</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-white font-medium">${project.estimatedCost.toLocaleString()}</p>
              <p className="text-gray-400 text-sm">Estimated Cost</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-400" />
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
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Project Description</h2>
            <p className="text-gray-300 leading-relaxed">{project.description}</p>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Documents</h2>
              <button className="glass-button bg-gradient-to-r from-blue-500 to-purple-600">
                Upload More
              </button>
            </div>
            <div className="space-y-3">
              {project.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">{doc.name}</p>
                      <p className="text-gray-400 text-sm">
                        {(doc.size / 1024 / 1024).toFixed(2)} MB • {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Overall Progress</span>
                  <span className="text-white">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Application Submitted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Initial Review</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300">Technical Review</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">Final Approval</span>
                </div>
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
                <span className="text-gray-400">Submitted:</span>
                <span className="text-white">{new Date(project.submittedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Location:</span>
                <span className="text-white text-right">
                  {project.location.address}<br />
                  {project.location.city}, {project.location.state} {project.location.zipCode}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="w-full glass-button bg-gradient-to-r from-blue-500 to-purple-600">
                Add Comment
              </button>
              <button className="w-full glass-button border-2 border-white/30 hover:bg-white/10">
                Request Update
              </button>
              <button className="w-full glass-button border-2 border-white/30 hover:bg-white/10">
                Download Report
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
