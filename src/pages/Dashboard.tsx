import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Bell, Heart, Edit, DollarSign, Users, Target, TrendingUp, Copy, Check } from 'lucide-react';
import { userAPI } from '../services/api';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      loadUserProfile(userId);
    }
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const userData = await userAPI.getProfile(userId);
      setUser(userData);
      setNewName(userData.name);
    } catch (error) {
      console.error('Failed to load user profile');
    }
  };

  const handleUpdateName = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      await userAPI.updateName(userId, newName);
      setUser({ ...user, name: newName });
      setIsEditing(false);
      alert('Name updated successfully!');
    } catch (error) {
      alert('Failed to update name');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };
  
    const handleCopyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy referral code:', err);
    }
  };
  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-lg">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Fundraising Portal</h1>
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="text-xs border rounded px-2 py-1"
                      />
                      <button
                        onClick={handleUpdateName}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <p className="text-xs text-gray-500">
                        Welcome, {user.name}
                      </p>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
            <p className="text-blue-100">Keep up the amazing work making a difference.</p>
          </div>
         <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
    <h2 className="text-xl font-bold text-gray-800 mb-4">Share the referral code</h2>
    <p className="text-gray-600 mb-2">Your referral code is:</p>
    <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
      <div className="text-gray-800 font-mono text-lg">
        {user.referralCode || 'Re4402'}
      </div>
      <button
        onClick={handleCopyReferralCode}
        className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
    <p className="text-sm text-gray-500 mt-2">Share this code with your friends to help raise funds!</p>
  </div>

          {/* Profile Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <p className="text-lg text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="text-lg text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <p className="text-lg text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-green-50">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-1">$0</p>
              <p className="text-sm text-gray-600">Total Raised</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-50">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-1">0%</p>
              <p className="text-sm text-gray-600">Goal Progress</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple-50">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-1">0</p>
              <p className="text-sm text-gray-600">Donors Reached</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-orange-50">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-1">+0%</p>
              <p className="text-sm text-gray-600">Growth Rate</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                <h3 className="font-semibold text-gray-800 mb-2">Share Referral Link</h3>
                <p className="text-sm text-gray-600">Send your referral code to potential donors</p>
              </button>
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200">
                <h3 className="font-semibold text-gray-800 mb-2">View Donations</h3>
                <p className="text-sm text-gray-600">Check your recent donation activity</p>
              </button>
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
                <h3 className="font-semibold text-gray-800 mb-2">Update Profile</h3>
                <p className="text-sm text-gray-600">Modify your account settings</p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
