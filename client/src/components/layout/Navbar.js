import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Globe,
  Search,
  Sun,
  Moon
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { user, logout } = useAuth();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    } catch (e) {
      return 'dark';
    }
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Apply theme on mount and whenever it changes
  React.useEffect(() => {
    try {
      if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.body.classList.add('light');
      } else {
        document.documentElement.classList.add('dark');
        document.body.classList.remove('light');
      }
      localStorage.setItem('theme', theme);
    } catch (e) {
      // ignore (safety for SSR/test environments)
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // listen for global toggle events (from pages)
  React.useEffect(() => {
    const handler = () => toggleTheme();
    window.addEventListener('theme:toggle', handler);
    return () => window.removeEventListener('theme:toggle', handler);
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
  ];

  const getRoleBasedLinks = () => {
    const baseLinks = [
      { name: t('dashboard'), path: '/dashboard', icon: '📊' },
      { name: t('projects'), path: '/projects/upload', icon: '📁' },
      { name: t('aiAssistant'), path: '/ai-assistant', icon: '🤖' },
      { name: t('costEstimator'), path: '/cost-estimator', icon: '💰' },
      { name: t('documents'), path: '/documents', icon: '📄' }
    ];

    if (user?.role === 'reviewer' || user?.role === 'admin') {
      baseLinks.push(
        { name: t('reviews'), path: '/reviewer/dashboard', icon: '👀' }
      );
    }

    if (user?.role === 'admin') {
      baseLinks.push(
        { name: t('admin'), path: '/admin/dashboard', icon: '⚙️' }
      );
    }

    return baseLinks;
  };

  return (
    <nav className="glass border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-white font-bold text-xl">Permiso</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {getRoleBasedLinks().map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-1"
              >
                <span>{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden sm:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="glass-input pl-10 pr-4 py-2 w-64 text-sm"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors p-2"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm">
                  {languages.find(lang => lang.code === currentLanguage)?.flag}
                </span>
              </button>

              {isLanguageOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 glass-card py-2"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        currentLanguage === lang.code
                          ? 'bg-white/20 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {lang.flag} {lang.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden sm:block text-sm">{user?.name}</span>
              </button>

              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 glass-card py-2"
                >
                  <div className="px-4 py-2 border-b border-white/20">
                    <p className="text-white font-medium">{user?.name}</p>
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                    <p className="text-blue-400 text-xs capitalize">{user?.role}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('logout')}</span>
                  </button>
                </motion.div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-white/20"
          >
            <div className="space-y-2">
              {getRoleBasedLinks().map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
