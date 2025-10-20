import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { SocketProvider } from './context/SocketContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Auth Components
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Pages
import Landing from './pages/user/Landing';
import UserDashboard from './pages/user/Dashboard';
import ProjectUpload from './pages/user/ProjectUpload';
import ProjectDetails from './pages/user/ProjectDetails';
import AIAssistant from './pages/user/AIAssistant';
import CostEstimator from './pages/user/CostEstimator';
import DocumentManager from './pages/user/DocumentManager';

// Reviewer Pages
import ReviewerDashboard from './pages/reviewer/Dashboard';
import ReviewWorkflow from './pages/reviewer/ReviewWorkflow';
import ReviewDetails from './pages/reviewer/ReviewDetails';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminProjects from './pages/admin/Projects';
import AdminAnalytics from './pages/admin/Analytics';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <div className="min-h-screen">
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                  },
                }}
              />
              
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="flex">
                      <Sidebar />
                      <main className="flex-1 p-6">
                        <UserDashboard />
                      </main>
                    </div>
                  </ProtectedRoute>
                } />
                
                <Route path="/projects/upload" element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="flex">
                      <Sidebar />
                      <main className="flex-1 p-6">
                        <ProjectUpload />
                      </main>
                    </div>
                  </ProtectedRoute>
                } />
                
                <Route path="/projects/:id" element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="flex">
                      <Sidebar />
                      <main className="flex-1 p-6">
                        <ProjectDetails />
                      </main>
                    </div>
                  </ProtectedRoute>
                } />
                
                <Route path="/ai-assistant" element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="flex">
                      <Sidebar />
                      <main className="flex-1 p-6">
                        <AIAssistant />
                      </main>
                    </div>
                  </ProtectedRoute>
                } />
                
                <Route path="/cost-estimator" element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="flex">
                      <Sidebar />
                      <main className="flex-1 p-6">
                        <CostEstimator />
                      </main>
                    </div>
                  </ProtectedRoute>
                } />
                
                <Route path="/documents" element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="flex">
                      <Sidebar />
                      <main className="flex-1 p-6">
                        <DocumentManager />
                      </main>
                    </div>
                  </ProtectedRoute>
                } />
                
                {/* Reviewer Routes */}
                <Route path="/reviewer/dashboard" element={
                  <ProtectedRoute allowedRoles={['reviewer', 'admin']}>
                    <Navbar />
                    <div className="flex">
                      <Sidebar />
                      <main className="flex-1 p-6">
                        <ReviewerDashboard />
                      </main>
                    </div>
                  </ProtectedRoute>
                } />
                
                <Route path="/reviewer/workflow" element={
                  <ProtectedRoute allowedRoles={['reviewer', 'admin']}>
                    <Navbar />
                    <div className="flex">
                      <Sidebar />
                      <main className="flex-1 p-6">
                        <ReviewWorkflow />
                      </main>
                    </div>
                  </ProtectedRoute>
                } />
                
                <Route path="/reviewer/projects/:id" element={
                  <ProtectedRoute allowedRoles={['reviewer', 'admin']}>
                    <Navbar />
                    <div className="flex">
                      <Sidebar />
                      <main className="flex-1 p-6">
                        <ReviewDetails />
                      </main>
                    </div>
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Navbar />
                    <div className="flex">
                      <Sidebar />
                      <main className="flex-1 p-6">
                        <AdminDashboard />
                      </main>
                    </div>
                  </ProtectedRoute>
                } />
                
                <Route path="/admin/users" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Navbar />
                    <div className="flex">
                      <Sidebar />
                      <main className="flex-1 p-6">
                        <AdminUsers />
                      </main>
                    </div>
                  </ProtectedRoute>
                } />
                
                <Route path="/admin/projects" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Navbar />
                    <div className="flex">
                      <Sidebar />
                      <main className="flex-1 p-6">
                        <AdminProjects />
                      </main>
                    </div>
                  </ProtectedRoute>
                } />
                
                <Route path="/admin/analytics" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Navbar />
                    <div className="flex">
                      <Sidebar />
                      <main className="flex-1 p-6">
                        <AdminAnalytics />
                      </main>
                    </div>
                  </ProtectedRoute>
                } />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
