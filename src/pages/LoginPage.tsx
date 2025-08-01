import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { LoginForm } from '../components/LoginForm';
import { SignupForm } from '../components/SignupForm';
import { authAPI } from '../services/api';

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

const handleLogin = async (email: string, password: string) => {
  try {
    const result = await authAPI.login({ email, password });
    if (result.error) {
      alert(result.error);
    } else {
      localStorage.setItem('userId', result.user.id);
      navigate('/dashboard');
    }
  } catch (error) {
    alert('Login failed');
  }
};



  const handleSignup = async (userData: { name: string; email: string; password: string }) => {
    try {
      const result = await authAPI.signup(userData);
      if (result.error) {
        alert(result.error);
      } else {
        alert('Account created successfully!');
        setIsLogin(true);
      }
    } catch (error) {
      alert('Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
            <Heart className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Fundraising Intern Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? 'Welcome back! Sign in to your account' : 'Create your intern account to get started'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-100">
          {isLogin ? (
            <LoginForm onLogin={handleLogin} />
          ) : (
            <SignupForm onSignup={handleSignup} />
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                {isLogin ? 'Create new account' : 'Sign in instead'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
