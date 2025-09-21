import React, { useState } from 'react';
import { Shield, MessageSquare, Users, Settings, CheckCircle, Clock, XCircle } from 'lucide-react';
import WhatsAppTester from './WhatsAppTester';
import VerificationPanel from './VerificationPanel';

const AdminPanel = ({ user }) => {
  const [activeAdminTab, setActiveAdminTab] = useState('verification');

  const adminTabs = [
    {
      id: 'verification',
      label: 'Verification Management',
      icon: Shield,
      description: 'Manage practitioner verification requests'
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp Testing',
      icon: MessageSquare,
      description: 'Test WhatsApp notifications'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      description: 'Manage all users and permissions'
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: Settings,
      description: 'Configure system settings'
    }
  ];

  const renderAdminContent = () => {
    switch (activeAdminTab) {
      case 'verification':
        return <VerificationPanel user={user} />;
      case 'whatsapp':
        return <WhatsAppTester user={user} />;
      case 'users':
        return (
          <div className="min-h-screen bg-gradient-to-br from-ayurveda-chandana/20 via-ayurveda-haldi/10 to-ayurveda-kumkum/20 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-ayurveda-kumkum/20">
                <h1 className="text-3xl font-display text-dosha-kapha mb-4">User Management</h1>
                <p className="text-gray-600 mb-6">Manage all users and their permissions</p>
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h3>
                  <p className="text-gray-500">User management features will be available soon</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="min-h-screen bg-gradient-to-br from-ayurveda-chandana/20 via-ayurveda-haldi/10 to-ayurveda-kumkum/20 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-ayurveda-kumkum/20">
                <h1 className="text-3xl font-display text-dosha-kapha mb-4">System Settings</h1>
                <p className="text-gray-600 mb-6">Configure system settings and preferences</p>
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h3>
                  <p className="text-gray-500">System settings will be available soon</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <VerificationPanel user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ayurveda-chandana/20 via-ayurveda-haldi/10 to-ayurveda-kumkum/20">
      {/* Admin Header */}
      <div className="bg-white/90 backdrop-blur-lg border-b border-ayurveda-kumkum/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display text-dosha-kapha">Admin Panel</h1>
              <p className="text-gray-600">Manage your AyurSutra platform</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Admin Access</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Admin Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-ayurveda-kumkum/20">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Tools</h2>
              <nav className="space-y-2">
                {adminTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveAdminTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeAdminTab === tab.id
                          ? 'bg-ayurveda-kumkum text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{tab.label}</div>
                        <div className={`text-xs ${
                          activeAdminTab === tab.id ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Admin Content */}
          <div className="lg:col-span-3">
            {renderAdminContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
