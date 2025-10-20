import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const isDemoEnv = process.env.REACT_APP_DEMO_MODE === 'true' || localStorage.getItem('demo') === '1';

const initialState = {
  isAuthenticated: isDemoEnv ? true : false,
  user: isDemoEnv
    ? {
        id: 'demo-user-id',
        name: localStorage.getItem('demoName') || 'Demo User',
        email: localStorage.getItem('demoEmail') || 'demo@permiso.dev',
        role: localStorage.getItem('demoRole') || 'user',
        avatar: ''
      }
    : null,
  token: isDemoEnv ? 'demo-token' : localStorage.getItem('token'),
  loading: false,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios interceptor for token
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Check if user is logged in on app start (skip in demo mode)
  useEffect(() => {
    if (isDemoEnv) return;
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/api/auth/me');
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.data.user,
              token
            }
          });
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        }
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    if (isDemoEnv) {
      localStorage.removeItem('demo');
      localStorage.removeItem('demoRole');
      localStorage.removeItem('demoEmail');
      localStorage.removeItem('demoName');
    } else {
      localStorage.removeItem('token');
    }
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  // DEMO helpers
  const enableDemo = (role = 'user') => {
    localStorage.setItem('demo', '1');
    localStorage.setItem('demoRole', role);
    localStorage.setItem('demoEmail', `${role}@permiso.dev`);
    localStorage.setItem('demoName', `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`);
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        token: 'demo-token',
        user: {
          id: 'demo-user-id',
          name: localStorage.getItem('demoName'),
          email: localStorage.getItem('demoEmail'),
          role: localStorage.getItem('demoRole'),
          avatar: ''
        }
      }
    });
    toast.success('Demo mode enabled');
  };

  const setDemoRole = (role) => {
    if (!isDemoEnv) return;
    localStorage.setItem('demoRole', role);
    dispatch({
      type: 'UPDATE_USER',
      payload: { role }
    });
    toast.success(`Switched role to ${role}`);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/auth/profile', profileData);
      dispatch({
        type: 'UPDATE_USER',
        payload: response.data.user
      });
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    enableDemo,
    setDemoRole,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
