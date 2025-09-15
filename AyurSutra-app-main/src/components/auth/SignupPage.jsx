import React, { useState } from "react";
import { Leaf, Mail, Lock, User, Phone } from "lucide-react";

const SignupPage = ({ onSwitchToLogin, onSignupSuccess, onBackToLanding }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "patient", // default selection
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // send name, email, phone, password, userType
      });

      const data = await res.json();
      console.log("Signup response:", data);

      if (res.ok) {
        alert("Signup successful ✅");
        if (onSignupSuccess) {
          onSignupSuccess({
            email: formData.email,
            password: formData.password,
          });
        }
      } else {
        alert(data.msg || "Signup failed ❌");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ayurveda-chandana/20 via-ayurveda-haldi/10 to-ayurveda-kumkum/10 flex items-center justify-center p-4">
      {/* Decorative Mandala Background */}
      <div className="absolute inset-0 bg-mandala-pattern opacity-5 animate-spin-slow"></div>

      <div className="max-w-md w-full relative">
        {/* Floating Herbs Animation */}
        <div className="absolute -top-20 -right-20 w-40 h-40">
          <div className="absolute w-16 h-16 bg-ayurveda-brahmi/10 rounded-full animate-float-medium"></div>
          <div className="absolute top-10 right-10 w-20 h-20 bg-ayurveda-haldi/10 rounded-full animate-float-slow"></div>
        </div>

        {/* Logo and Header */}
        <div className="text-center mb-8 relative">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-ayurveda-brahmi to-ayurveda-neem p-3 rounded-lotus shadow-lg">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          {/* Sanskrit Welcome */}
          <div className="mb-4">
            <p className="text-xl text-ayurveda-triphala font-decorative opacity-75">
              आरोग्य यात्रा
            </p>
            <p className="text-sm text-gray-500">Begin Your Wellness Journey</p>
          </div>
          <h1 className="text-4xl font-display text-dosha-kapha mb-2">
            <span className="bg-gradient-to-r from-ayurveda-haldi via-ayurveda-kumkum to-ayurveda-brahmi bg-clip-text text-transparent">
              Join AyurSutra
            </span>
          </h1>
          <p className="text-gray-600 font-body">Create your healing account</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-ayurveda-chandana/20">
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-dosha-kapha flex items-center space-x-2">
                <span>नाम</span>
                <span className="text-gray-500">Full Name</span>
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-ayurveda-kumkum transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-ayurveda-chandana/20 rounded-lotus focus:ring-2 focus:ring-ayurveda-kumkum focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-dosha-kapha flex items-center space-x-2">
                <span>ईमेल</span>
                <span className="text-gray-500">Email Address</span>
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-ayurveda-kumkum transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-ayurveda-chandana/20 rounded-lotus focus:ring-2 focus:ring-ayurveda-kumkum focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-dosha-kapha flex items-center space-x-2">
                <span>फोन</span>
                <span className="text-gray-500">Phone Number</span>
              </label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-ayurveda-kumkum transition-colors" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-ayurveda-chandana/20 rounded-lotus focus:ring-2 focus:ring-ayurveda-kumkum focus:border-transparent transition-all duration-200"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-dosha-kapha flex items-center space-x-2">
                <span>पासवर्ड</span>
                <span className="text-gray-500">Password</span>
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-ayurveda-kumkum transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-white/90 backdrop-blur-sm border border-ayurveda-chandana/20 rounded-lotus focus:ring-2 focus:ring-ayurveda-kumkum focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-dosha-kapha flex items-center space-x-2">
                <span>पुष्टि करें</span>
                <span className="text-gray-500">Confirm Password</span>
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-ayurveda-kumkum transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-white/90 backdrop-blur-sm border border-ayurveda-chandana/20 rounded-lotus focus:ring-2 focus:ring-ayurveda-kumkum focus:border-transparent transition-all duration-200"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            {/* User Type (Role Selector) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-dosha-kapha flex items-center space-x-2">
                <span>भूमिका</span>
                <span className="text-gray-500">I am a:</span>
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className="w-full p-3 bg-white/90 backdrop-blur-sm border border-ayurveda-chandana/20 rounded-lotus focus:ring-2 focus:ring-ayurveda-kumkum focus:border-transparent transition-all duration-200 text-gray-700"
              >
                <option value="patient">रोगी / Patient</option>
                <option value="practitioner">वैद्य / Practitioner</option>
              </select>
            </div>

            {/* Signup Button */}
            <button
              onClick={handleSignup}
              className="w-full bg-gradient-to-r from-ayurveda-brahmi to-ayurveda-neem text-white px-6 py-3 rounded-lotus font-medium hover:from-dosha-kapha hover:to-ayurveda-brahmi transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <span className="text-lg font-display">पंजीकरण करें</span>
              <span className="block text-sm">Create Account</span>
            </button>

            {/* Decorative Divider */}
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

            {/* Switch to Login with Sanskrit */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-ayurveda-triphala font-decorative">
                पहले से खाता है?
              </p>
              <div>
                <span className="text-gray-600">Already have an account? </span>
                <button
                  onClick={onSwitchToLogin}
                  className="text-ayurveda-kumkum hover:text-ayurveda-brahmi font-medium transition-colors"
                >
                  Log in here
                </button>
              </div>
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
            By signing up, you agree to our{" "}
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

export default SignupPage;
