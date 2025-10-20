import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Activity,
  Sun
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  useLanguage();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProjects: 0,
    revenue: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [projectStatusData, setProjectStatusData] = useState([]);

  useEffect(() => {
    // Mock data
    setStats({
      totalUsers: 1234,
      activeUsers: 856,
      totalProjects: 567,
      revenue: 125000
    });

    setRecentProjects([
      {
        id: 1,
        title: 'Residential Building Permit',
        applicant: 'John Smith',
        status: 'approved',
        submittedAt: '2024-01-20',
        estimatedCost: 25000
      },
      {
        id: 2,
        title: 'Commercial Renovation',
        applicant: 'Jane Doe',
        status: 'under_review',
        submittedAt: '2024-01-19',
        estimatedCost: 15000
      },
      {
        id: 3,
        title: 'Electrical Permit',
        applicant: 'Mike Johnson',
        status: 'rejected',
        submittedAt: '2024-01-18',
        estimatedCost: 5000
      }
    ]);

    setUserGrowth([
      { month: 'Jan', users: 120, projects: 45 },
      { month: 'Feb', users: 180, projects: 67 },
      { month: 'Mar', users: 250, projects: 89 },
      { month: 'Apr', users: 320, projects: 112 },
      { month: 'May', users: 400, projects: 134 },
      { month: 'Jun', users: 480, projects: 156 }
    ]);

    setRevenueData([
      { month: 'Jan', revenue: 15000 },
      { month: 'Feb', revenue: 22000 },
      { month: 'Mar', revenue: 28000 },
      { month: 'Apr', revenue: 35000 },
      { month: 'May', revenue: 42000 },
      { month: 'Jun', revenue: 48000 }
    ]);

    setProjectStatusData([
      { name: 'Approved', value: 45, color: '#10B981' },
      { name: 'Under Review', value: 30, color: '#F59E0B' },
      { name: 'Rejected', value: 15, color: '#EF4444' },
      { name: 'Draft', value: 10, color: '#6B7280' }
    ]);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      approved: 'text-green-400 bg-green-500/20',
      under_review: 'text-yellow-400 bg-yellow-500/20',
      rejected: 'text-red-400 bg-red-500/20',
      draft: 'text-gray-400 bg-gray-500/20'
    };
    return colors[status] || 'text-gray-400 bg-gray-500/20';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'under_review':
        return <Clock className="w-4 h-4 text-yellow-400" />;
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
            <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-300">Overview of platform performance and management</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Theme toggle - will use global body class set by Navbar */}
            <button
              onClick={() => {
                const evt = new CustomEvent('theme:toggle');
                window.dispatchEvent(evt);
              }}
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
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-green-400 text-sm">+12% from last month</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
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
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">{stats.activeUsers.toLocaleString()}</p>
              <p className="text-green-400 text-sm">+8% from last month</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-400" />
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
              <p className="text-gray-400 text-sm">Total Projects</p>
              <p className="text-2xl font-bold text-white">{stats.totalProjects.toLocaleString()}</p>
              <p className="text-green-400 text-sm">+15% from last month</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-400" />
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
              <p className="text-gray-400 text-sm">Revenue</p>
              <p className="text-2xl font-bold text-white">${stats.revenue.toLocaleString()}</p>
              <p className="text-green-400 text-sm">+22% from last month</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">User Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="projects" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="revenue" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Project Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Recent Projects</h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(project.status)}
                  <div>
                    <h4 className="text-white font-medium">{project.title}</h4>
                    <p className="text-gray-400 text-sm">by {project.applicant}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                  <span className="text-gray-400 text-sm">
                    ${project.estimatedCost.toLocaleString()}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {new Date(project.submittedAt).toLocaleDateString()}
                  </span>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="glass-button bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">Manage Users</span>
          </button>
          <button className="glass-button bg-gradient-to-r from-green-500 to-teal-600 p-4 text-center">
            <FileText className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">View Projects</span>
          </button>
          <button className="glass-button bg-gradient-to-r from-yellow-500 to-orange-600 p-4 text-center">
            <BarChart3 className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">Analytics</span>
          </button>
          <button className="glass-button bg-gradient-to-r from-purple-500 to-pink-600 p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <span className="font-medium">Reports</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
