import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Upload, 
  FileText, 
  Image, 
  File, 
  X, 
  CheckCircle, 
  Bot,
  Sparkles,
  Eye,
  Download
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProjectUpload = () => {
  useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errors, setErrors] = useState({});

  const projectTypes = [
    { value: 'building', label: 'New Building Construction' },
    { value: 'renovation', label: 'Building Renovation' },
    { value: 'commercial', label: 'Commercial Development' },
    { value: 'residential', label: 'Residential Development' },
    { value: 'other', label: 'Other' }
  ];

  const acceptedFileTypes = {
    'application/pdf': ['.pdf'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-powerpoint': ['.ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
  };

  const onDrop = async (acceptedFiles) => {
    setIsUploading(true);
    
    for (const file of acceptedFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post('/api/uploads', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setUploadedFiles(prev => [...prev, {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: response.data.file.url,
          status: 'uploaded'
        }]);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    setIsUploading(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: true,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }
    if (!formData.type) {
      newErrors.type = 'Project type is required';
    }
    if (!formData.location.address.trim()) {
      newErrors['location.address'] = 'Address is required';
    }
    if (!formData.location.city.trim()) {
      newErrors['location.city'] = 'City is required';
    }
    if (!formData.location.state.trim()) {
      newErrors['location.state'] = 'State is required';
    }
    if (uploadedFiles.length === 0) {
      newErrors.files = 'At least one document is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAnalyzeWithAI = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please upload documents first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await axios.post('/api/ai/analyze', {
        documentUrl: uploadedFiles[0].url
      });
      setAiAnalysis(response.data.analysis);
      toast.success('AI analysis completed');
    } catch (error) {
      console.error('AI analysis error:', error);
      toast.error('AI analysis failed');
    }
    setIsAnalyzing(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const projectData = {
        ...formData,
        documents: uploadedFiles.map(file => ({
          name: file.name,
          url: file.url,
          type: file.type,
          size: file.size
        }))
      };

      const response = await axios.post('/api/projects', projectData);
      toast.success('Project created successfully');
      navigate(`/projects/${response.data.project._id}`);
    } catch (error) {
      console.error('Project creation error:', error);
      toast.error('Failed to create project');
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-5 h-5" />;
    } else if (fileType === 'application/pdf') {
      return <FileText className="w-5 h-5" />;
    } else {
      return <File className="w-5 h-5" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-8"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Upload New Project</h1>
            <p className="text-gray-300">Create a new permit application with AI assistance</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Project Information */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Project Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter project title"
                  className={`glass-input w-full ${errors.title ? 'border-red-400' : ''}`}
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your project"
                  rows={4}
                  className="glass-input w-full resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Project Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`glass-input w-full ${errors.type ? 'border-red-400' : ''}`}
                >
                  <option value="">Select project type</option>
                  {projectTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="text-red-400 text-sm mt-1">{errors.type}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-white mb-4">
                  Project Location *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="location.address"
                      value={formData.location.address}
                      onChange={handleInputChange}
                      placeholder="Street Address"
                      className={`glass-input w-full ${errors['location.address'] ? 'border-red-400' : ''}`}
                    />
                    {errors['location.address'] && (
                      <p className="text-red-400 text-sm mt-1">{errors['location.address']}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className={`glass-input w-full ${errors['location.city'] ? 'border-red-400' : ''}`}
                    />
                    {errors['location.city'] && (
                      <p className="text-red-400 text-sm mt-1">{errors['location.city']}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="location.state"
                      value={formData.location.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className={`glass-input w-full ${errors['location.state'] ? 'border-red-400' : ''}`}
                    />
                    {errors['location.state'] && (
                      <p className="text-red-400 text-sm mt-1">{errors['location.state']}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="location.zipCode"
                      value={formData.location.zipCode}
                      onChange={handleInputChange}
                      placeholder="ZIP Code"
                      className="glass-input w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Upload Documents</h2>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-blue-400 bg-blue-500/10'
                  : 'border-white/20 hover:border-white/40 hover:bg-white/5'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-white text-lg mb-2">
                {isDragActive ? 'Drop files here' : 'Drag & drop files here, or click to select'}
              </p>
              <p className="text-gray-400 text-sm">
                Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG, GIF
              </p>
              <p className="text-gray-400 text-sm">Max file size: 10MB</p>
            </div>

            {errors.files && (
              <p className="text-red-400 text-sm mt-2">{errors.files}</p>
            )}

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="text-lg font-medium text-white">Uploaded Files</h3>
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.type)}
                      <div>
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400 text-sm">Uploaded</span>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="glass-button border-2 border-white/30 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isUploading}
              className="glass-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </motion.div>

        {/* AI Assistant Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          {/* AI Analysis */}
          <div className="glass-card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
            </div>
            
            {uploadedFiles.length > 0 ? (
              <div className="space-y-4">
                <button
                  onClick={handleAnalyzeWithAI}
                  disabled={isAnalyzing}
                  className="w-full glass-button bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </div>
                  ) : (
                    'Analyze Documents'
                  )}
                </button>

                {aiAnalysis && (
                  <div className="space-y-3">
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium">Analysis Complete</span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Confidence: {Math.round(aiAnalysis.confidence * 100)}%
                      </p>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">Extracted Data:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Project Type:</span>
                          <span className="text-white">{aiAnalysis.extractedData.projectType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Estimated Cost:</span>
                          <span className="text-white">${aiAnalysis.extractedData.estimatedCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Timeline:</span>
                          <span className="text-white">{aiAnalysis.extractedData.estimatedTimeline} days</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">Recommendations:</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        {aiAnalysis.extractedData.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Sparkles className="w-3 h-3 text-yellow-400 mt-1 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                Upload documents to enable AI analysis
              </p>
            )}
          </div>

          {/* Tips */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Upload Tips</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  Include all required documents for faster processing
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  Use high-quality scans for better AI analysis
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  Organize files with descriptive names
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center space-x-3">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300 text-sm">View Templates</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center space-x-3">
                  <Download className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300 text-sm">Download Checklist</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center space-x-3">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300 text-sm">Get Help</span>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectUpload;
