import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const { loginWithGoogle, handleGoogleCallback } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userData = params.get('userData');
    
    if (token && userData) {
      handleGoogleCallback(token, userData);
      navigate('/dashboard');
    }
  }, [location, handleGoogleCallback, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">College Login</h1>
      <button
        onClick={loginWithGoogle}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Login with Google
      </button>
    </div>
  );
};

export default Login;