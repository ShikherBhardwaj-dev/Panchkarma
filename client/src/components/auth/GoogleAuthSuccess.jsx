import React, { useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext.jsx';

const GoogleAuthSuccess = ({ onAuthSuccess }) => {
  const { show } = useToast();

  useEffect(() => {
    const handleGoogleAuth = () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userParam = urlParams.get('user');

        if (token && userParam) {
          // Decode user data
          const userData = JSON.parse(decodeURIComponent(userParam));
          
          // Store token and user data
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));

          // Show success message
          show({
            title: 'Success',
            message: `Welcome back, ${userData.name}! 🎉`,
            duration: 4000
          });

          // Call the auth success callback
          if (onAuthSuccess) {
            onAuthSuccess(userData);
          }
        } else {
          // Handle error case
          show({
            title: 'Authentication Error',
            message: 'Google authentication failed. Please try again.',
            duration: 4000
          });
          
          // Redirect to login after a delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
      } catch (error) {
        console.error('Google auth success error:', error);
        show({
          title: 'Error',
          message: 'Failed to process Google authentication. Please try again.',
          duration: 4000
        });
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    };

    handleGoogleAuth();
  }, [onAuthSuccess, show]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ayurveda-chandana/30 via-ayurveda-haldi/20 to-ayurveda-kumkum/20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ayurveda-kumkum mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Processing Google Authentication...
        </h2>
        <p className="text-gray-500">
          Please wait while we complete your login.
        </p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;
