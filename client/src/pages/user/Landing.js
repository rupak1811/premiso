import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Zap, 
  Shield,
  Globe,
  Bot,
  FileText,
  Calculator,
  Eye,
  BarChart3
} from 'lucide-react';

const Landing = () => {
  const { t } = useLanguage();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('light');
      root.classList.remove('body');
    } else {
      root.classList.add('light');
    }
  }, [isDark]);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Bot,
      title: t('features.aiAdvisor'),
      description: t('features.aiAdvisorDesc'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FileText,
      title: t('features.documentAutomation'),
      description: t('features.documentAutomationDesc'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Globe,
      title: t('features.multilingualSupport'),
      description: t('features.multilingualSupportDesc'),
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: Zap,
      title: t('features.realTimeTracking'),
      description: t('features.realTimeTrackingDesc'),
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Calculator,
      title: t('features.costEstimation'),
      description: t('features.costEstimationDesc'),
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Eye,
      title: t('features.expertReview'),
      description: t('features.expertReviewDesc'),
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Projects Completed' },
    { number: '95%', label: 'Success Rate' },
    { number: '50%', label: 'Time Saved' },
    { number: '24/7', label: 'AI Support' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Architect',
      company: 'Design Studio',
      content: 'Permiso Platform revolutionized our permit process. What used to take weeks now takes days!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Project Manager',
      company: 'BuildCorp',
      content: 'The AI assistant is incredibly helpful. It caught several issues we would have missed.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Contractor',
      company: 'Elite Construction',
      content: 'Real-time tracking and notifications keep us updated every step of the way.',
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="glass rounded-xl px-4 py-3 flex items-center justify-between">
            <a href="#home" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-accent-500 rounded-lg flex items-center justify-center">
                <span className={`${isDark ? 'text-white' : 'text-primary-900'} font-bold text-lg`}>P</span>
              </div>
              <span className={`${isDark ? 'text-white' : 'text-primary-900'} font-bold text-xl`}>Permiso</span>
            </a>
            <nav className="flex items-center space-x-3">
              <a href="#home" className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-primary-900 hover:opacity-80'} text-sm px-3 py-2`}>Home</a>
              <a href="#contact" className={`${isDark ? 'text-gray-200 hover:text-white' : 'text-primary-900 hover:opacity-80'} text-sm px-3 py-2`}>Contact</a>
              <Link to="/login" className={`glass-button border-2 ${isDark ? 'border-white/30 hover:bg-white/10 text-white' : 'border-primary-900/30 hover:bg-primary-900/5 text-primary-900'} text-sm px-4 py-2`}>Sign In</Link>
              <Link to="/register" className="glass-button bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 text-sm px-4 py-2 text-white">Get Started</Link>
              <button
                onClick={() => setIsDark(!isDark)}
                className="ml-1 px-3 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/20 text-gray-200"
                aria-label="Toggle theme"
                title="Toggle theme"
              >
                {isDark ? '🌞' : '🌙'}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className={`absolute inset-0 ${isDark ? 'gradient-primary' : 'gradient-light'}`}>
          <div
            className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-20`}
          />
          {!isDark && <div className="water-overlay" />}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${isDark ? 'text-white' : 'text-primary-900'}`}>
              <span className={`${isDark ? 'text-gradient-accent' : 'text-gradient'}`}>AI-Powered</span>
              <br />
              Permit Management
            </h1>
            <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Streamline your permit applications with intelligent automation, 
              real-time tracking, and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="glass-button bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 text-lg px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className={`glass-button border-2 text-lg px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${isDark ? 'border-white/30 hover:bg-white/10 text-white' : 'border-primary-900/30 hover:bg-primary-900/5 text-primary-900'}`}
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-500/20 rounded-full blur-xl animate-bounce-gentle" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-500/20 rounded-full blur-xl animate-bounce-gentle" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent-500/20 rounded-full blur-xl animate-bounce-gentle" style={{ animationDelay: '2s' }} />
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to manage permits efficiently and effectively
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-card hover-lift cursor-pointer ${
                  currentFeature === index ? 'ring-2 ring-blue-400' : ''
                }`}
                onClick={() => setCurrentFeature(index)}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="glass-card p-8">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of satisfied users who have transformed their permit process
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-8"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-card p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of professionals who trust Permiso Platform for their permit management needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="glass-button bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="glass-button border-2 border-white/30 hover:bg-white/10 text-lg px-8 py-4 rounded-xl font-semibold transition-all duration-300"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact / Footer */}
      <section id="contact" className="py-20 relative">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-gray-300 mb-6">Have questions? Reach out and we’ll get back to you soon.</p>
            <form className="grid grid-cols-1 gap-4">
              <input className="glass-input" placeholder="Your name" />
              <input className="glass-input" placeholder="Your email" />
              <textarea className="glass-input resize-none" placeholder="Message" rows="4" />
              <button className="glass-button bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 w-full">Send</button>
            </form>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-white font-bold text-xl">Permiso</span>
              </div>
              <p className="text-gray-400">
                AI-powered permit management platform for modern professionals.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/api" className="hover:text-white transition-colors">API</Link></li>
                <li><Link to="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/status" className="hover:text-white transition-colors">Status</Link></li>
                <li><Link to="/security" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/20 text-center text-gray-400">
            <p>&copy; 2024 Permiso Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
