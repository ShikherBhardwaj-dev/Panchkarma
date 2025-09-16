import React, { useState } from "react";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

const AuthContainer = ({ onAuthSuccess, onBackToLanding }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthSuccess = (userData) => {
    // ✅ Pass the full user object (_id, name, email, userType) to App.jsx
    if (onAuthSuccess) {
      onAuthSuccess(userData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {isLogin ? (
        <LoginPage
          onSwitchToSignup={() => setIsLogin(false)}
          onAuthSuccess={handleAuthSuccess}
          onBackToLanding={onBackToLanding}
        />
      ) : (
        <SignupPage
          onSwitchToLogin={() => setIsLogin(true)}
          onAuthSuccess={handleAuthSuccess}
          onBackToLanding={onBackToLanding}
        />
      )}
    </div>
  );
};

export default AuthContainer;

