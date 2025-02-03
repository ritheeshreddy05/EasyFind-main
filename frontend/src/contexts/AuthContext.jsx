import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  loginWithGoogle as apiLoginWithGoogle, 
  setPassword as apiSetPassword, 
  fetchUserProfile as apiFetchUserProfile, 
  logout as apiLogout 
} from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      console.log(storedToken)
      setToken(storedToken);
      fetchUserProfile(storedToken);
    }
    setLoading(false);
  }, []);

  const fetchUserProfile = async (authToken) => {
    try {
      const userData = await apiFetchUserProfile(authToken);
      console.log(token)
      console.log("at the fetch userprofile")
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    }
  };

  const loginWithGoogle = () => {
    apiLoginWithGoogle();
  };

  const handleGoogleCallback = async (newToken, userData) => {
    try {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Parse and set user data directly
      const user = JSON.parse(decodeURIComponent(userData));
      setUser(user);
      
      // Optional: Verify user data with backend
      await fetchUserProfile(newToken);
    } catch (error) {
      console.error('Google login failed:', error);
      logout();
    }
  };

  const setPassword = async (password) => {
    try {
      await apiSetPassword(token, password);
      await fetchUserProfile(token);
    } catch (error) {
      console.error('Failed to set password:', error);
    }
  };

  const logout = () => {
    apiLogout();
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token,
        loginWithGoogle, 
        handleGoogleCallback,
        setPassword,
        logout,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);