import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Home, 
  FileText, 
  Upload, 
  Bot, 
  Calculator, 
  FolderOpen,
  Eye,
  Settings,
  BarChart3,
  Users,
  Shield
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      {
        name: t('dashboard'),
        path: '/dashboard',
        icon: Home,
        roles: ['user', 'reviewer', 'admin']
      },
      {
        name: t('projects'),
        path: '/projects/upload',
        icon: FileText,
        roles: ['user']
      },
      {
        name: t('upload'),
        path: '/projects/upload',
        icon: Upload,
        roles: ['user']
      },
      {
        name: t('aiAssistant'),
        path: '/ai-assistant',
        icon: Bot,
        roles: ['user', 'reviewer', 'admin']
      },
      {
        name: t('costEstimator'),
        path: '/cost-estimator',
        icon: Calculator,
        roles: ['user']
      },
      {
        name: t('documents'),
        path: '/documents',
        icon: FolderOpen,
        roles: ['user']
      }
    ];

    if (user?.role === 'reviewer' || user?.role === 'admin') {
      baseItems.push(
        {
          name: t('reviews'),
          path: '/reviewer/dashboard',
          icon: Eye,
          roles: ['reviewer', 'admin']
        },
        {
          name: 'Workflow',
          path: '/reviewer/workflow',
          icon: BarChart3,
          roles: ['reviewer', 'admin']
        }
      );
    }

    if (user?.role === 'admin') {
      baseItems.push(
        {
          name: t('admin'),
          path: '/admin/dashboard',
          icon: Shield,
          roles: ['admin']
        },
        {
          name: t('userManagement'),
          path: '/admin/users',
          icon: Users,
          roles: ['admin']
        },
        {
          name: t('projectManagement'),
          path: '/admin/projects',
          icon: FileText,
          roles: ['admin']
        },
        {
          name: t('analytics'),
          path: '/admin/analytics',
          icon: BarChart3,
          roles: ['admin']
        }
      );
    }

    return baseItems.filter(item => item.roles.includes(user?.role));
  };

  const navigationItems = getNavigationItems();

  return (
    <aside className="w-64 glass border-r border-white/20 min-h-screen">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white">Navigation</h2>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                </motion.div>
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 bg-blue-400 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-white font-medium text-sm">{user?.name}</p>
              <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {user?.role === 'user' && (
          <div className="mt-6 space-y-3">
            <div className="glass-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Active Projects</span>
                <span className="text-white font-bold">3</span>
              </div>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Pending Reviews</span>
                <span className="text-yellow-400 font-bold">1</span>
              </div>
            </div>
          </div>
        )}

        {user?.role === 'reviewer' && (
          <div className="mt-6 space-y-3">
            <div className="glass-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Pending Reviews</span>
                <span className="text-yellow-400 font-bold">5</span>
              </div>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Completed Today</span>
                <span className="text-green-400 font-bold">12</span>
              </div>
            </div>
          </div>
        )}

        {user?.role === 'admin' && (
          <div className="mt-6 space-y-3">
            <div className="glass-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Total Users</span>
                <span className="text-white font-bold">1,234</span>
              </div>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Revenue</span>
                <span className="text-green-400 font-bold">$45K</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
