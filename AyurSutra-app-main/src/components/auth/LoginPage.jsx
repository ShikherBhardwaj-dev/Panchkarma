import React, { useState, useEffect } from "react";
import { Leaf, Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";

const LoginPage = ({
  onSwitchToSignup,
  onAuthSuccess,
  onBackToLanding,
  prefillEmail = "",
  prefillPassword = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Prefill credentials if passed from SignupPage
  useEffect(() => {
    if (prefillEmail || prefillPassword) {
      setFormData({
        email: prefillEmail,
        password: prefillPassword,
        rememberMe: false,
      });
    }
  }, [prefillEmail, prefillPassword]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }

    if (!formData.email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (res.ok) {
        alert("Login successful ✅");

        if (onAuthSuccess) {
          // ✅ Pass the complete user object from backend
          onAuthSuccess({
            _id: data._id,
            name: data.name,
            email: data.email,
            userType: data.userType, // "patient" or "practitioner"
          });
        }
      } else {
        alert(data.msg || "Login failed ❌");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-ayurveda-chandana/30 via-ayurveda-haldi/20 to-ayurveda-kumkum/20">
      {/* Main background with multiple layers */}
      <div className="fixed inset-0">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-ayurveda-chandana/40 via-ayurveda-haldi/30 to-ayurveda-kumkum/30"></div>

        {/* Pattern overlays */}
        <div className="absolute inset-0 bg-mandala-pattern opacity-5 animate-spin-slow"></div>
        <div className="absolute inset-0 bg-[url('/patterns/lotus-pattern.png')] bg-repeat opacity-10"></div>

        {/* Large decorative circles */}
        <div className="absolute -top-48 -left-48 w-[800px] h-[800px] bg-ayurveda-brahmi/20 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-48 -right-48 w-[800px] h-[800px] bg-ayurveda-kumkum/20 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] bg-ayurveda-haldi/15 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

        {/* Small animated elements */}
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-ayurveda-brahmi/30 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-ayurveda-kumkum/30 rounded-full animate-float-medium"></div>
        <div className="absolute top-3/4 left-1/3 w-10 h-10 bg-ayurveda-haldi/30 rounded-full animate-float-fast"></div>
        <div className="absolute top-1/3 right-1/3 w-14 h-14 bg-ayurveda-neem/30 rounded-full animate-float-medium"></div>
      </div>

      {/* Back to Landing Button */}
      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          className="fixed top-6 left-6 flex items-center text-gray-600 hover:text-ayurveda-brahmi font-medium transition-colors z-50"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>
      )}

      <div className="max-w-md w-full relative">
        {/* Floating Herbs Animation */}
        <div className="absolute -top-20 -left-20 w-40 h-40">
          <div className="absolute w-16 h-16 bg-ayurveda-brahmi/10 rounded-full animate-float-slow"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-ayurveda-haldi/10 rounded-full animate-float-medium"></div>
        </div>

        {/* Logo and Header */}
        <div className="text-center mb-8 relative">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-ayurveda-brahmi to-ayurveda-neem p-3 rounded-lotus shadow-lg">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          {/* Sanskrit Blessing */}
          <div className="mb-4">
            <p className="text-xl text-ayurveda-triphala font-decorative opacity-75">
              स्वागतम्
            </p>
            <p className="text-sm text-gray-500">Welcome Back</p>
          </div>
          <h1 className="text-4xl font-display text-dosha-kapha mb-2">
            <span className="bg-gradient-to-r from-ayurveda-haldi via-ayurveda-kumkum to-ayurveda-brahmi bg-clip-text text-transparent">
              AyurSutra
            </span>
          </h1>
          <p className="text-gray-600 font-body">
            Continue your journey towards wellness
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-ayurveda-chandana/20">
          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-dosha-kapha">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-ayurveda-kumkum transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-ayurveda-chandana/20 rounded-lg focus:ring-2 focus:ring-ayurveda-kumkum focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-dosha-kapha">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-ayurveda-kumkum transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-12 py-3 bg-white/90 backdrop-blur-sm border border-ayurveda-chandana/20 rounded-lg focus:ring-2 focus:ring-ayurveda-kumkum focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-ayurveda-brahmi to-ayurveda-neem text-white px-6 py-3 rounded-lotus font-medium hover:from-dosha-kapha hover:to-ayurveda-brahmi transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <span className="text-lg font-display">प्रवेश करें</span>
              <span className="block text-sm">Sign In</span>
            </button>

            {/* Divider with Mandala */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-ayurveda-kumkum/30 to-transparent"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="bg-white px-4">
                  <div className="w-8 h-8 bg-[url('/patterns/om-symbol.png')] opacity-20"></div>
                </div>
              </div>
            </div>

            {/* Social Login Options */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-ayurveda-chandana/20 rounded-lotus hover:bg-ayurveda-chandana/5 transition-all duration-200 group"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                <span className="text-gray-600 group-hover:text-ayurveda-kumkum transition-colors">
                  Google
                </span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-ayurveda-chandana/20 rounded-lotus hover:bg-ayurveda-chandana/5 transition-all duration-200 group"
              >
                <div className="w-5 h-5 mr-2 bg-[#1877f2] rounded text-white text-xs flex items-center justify-center font-bold">
                  f
                </div>
                <span className="text-gray-600 group-hover:text-ayurveda-kumkum transition-colors">
                  Facebook
                </span>
              </button>
            </div>
          </div>

          {/* Sign Up Link with Sanskrit */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-ayurveda-triphala font-decorative">
              नूतन खाता
            </p>
            <div>
              <span className="text-gray-600">Don't have an account? </span>
              <button
                onClick={onSwitchToSignup}
                className="text-ayurveda-kumkum hover:text-ayurveda-brahmi font-medium transition-colors"
              >
                Sign up here
              </button>
            </div>
          </div>
        </div>

        {/* Footer with Sanskrit */}
        <div className="text-center mt-6 space-y-2">
          <div className="flex items-center justify-center space-x-2 text-ayurveda-triphala/60">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-ayurveda-kumkum/30"></div>
            <span className="text-sm font-decorative">नियम एवं गोपनीयता</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-ayurveda-kumkum/30"></div>
          </div>
          <div className="text-sm text-gray-500">
            By signing in, you agree to our{" "}
            <a
              href="#"
              className="text-ayurveda-kumkum hover:text-ayurveda-brahmi transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-ayurveda-kumkum hover:text-ayurveda-brahmi transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
