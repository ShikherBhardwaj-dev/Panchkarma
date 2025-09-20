import React, { useState } from "react";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

const AuthContainer = ({ onAuthSuccess, onBackToLanding }) => {
  const [isLogin, setIsLogin] = useState(true);
  // store prefill credentials after signup so LoginPage can use them
  const [prefill, setPrefill] = useState({ email: "", password: "" });

  const handleAuthSuccess = (userData) => {
    // ✅ Pass the full user object (_id, name, email, userType) to App.jsx
    if (onAuthSuccess) {
      onAuthSuccess(userData);
    }
  };

  const handleSignupSuccess = (creds) => {
    // creds = { email, password } from SignupPage
    // If server returned a user object (with _id) then treat as logged in and forward to App
    if (creds && creds._id) {
      if (onAuthSuccess) onAuthSuccess(creds);
      return;
    }

    if (creds && creds.email) {
      setPrefill({ email: creds.email, password: creds.password || "" });
    }
    // switch to login view so user can sign in (prefilled)
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {isLogin ? (
        <LoginPage
          onSwitchToSignup={() => setIsLogin(false)}
          onAuthSuccess={handleAuthSuccess}
          onBackToLanding={onBackToLanding}
          prefillEmail={prefill.email}
          prefillPassword={prefill.password}
        />
      ) : (
        <SignupPage
          onSwitchToLogin={() => setIsLogin(true)}
          onSignupSuccess={handleSignupSuccess}
          onBackToLanding={onBackToLanding}
        />
      )}
    </div>
  );
};

export default AuthContainer;

