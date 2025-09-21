import React, { useState } from "react";
import { useToast } from "../../contexts/ToastContext.jsx";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from "lucide-react";

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

  const { show } = useToast();

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      show({
        title: "Missing fields",
        message: "Please fill in name, email and password",
        duration: 4000,
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      show({
        title: "Password mismatch",
        message: "Passwords do not match",
        duration: 4000,
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (e) {
        data = { msg: await res.text().catch(() => "No response body") };
      }

      console.log("Signup status", res.status, data);

      if (res.ok) {
        show({
          title: "Signup successful",
          message: data.msg || "Account created",
          duration: 4000,
        });
        // If server returned the created user object, forward it up so App can use phone/_id
        if (onSignupSuccess)
          onSignupSuccess(
            data.user || { email: formData.email, password: formData.password }
          );
      } else {
        show({
          title: "Signup failed",
          message: data.msg || `Status ${res.status}`,
          duration: 6000,
        });
      }
    } catch (err) {
      console.error("Signup error", err);
      show({
        title: "Signup error",
        message: err.message || "Network error",
        duration: 6000,
      });
    }
  };

  // Dynamic backgrounds and accents
  const isPatient = formData.userType === "patient";
  const bgGradient = isPatient
    ? "from-[#8B4513]/20 via-[#CD853F]/15 to-[#DEB887]/20"
    : "from-[#8B4513]/20 via-[#CD853F]/15 to-[#DEB887]/20";
  const patternUrl = isPatient
    ? "/patterns/herbs-bg.svg"
    : "/patterns/herbs-bg.svg";
  const accentCircle = isPatient ? "bg-[#8B4513]/30" : "bg-[#8B4513]/30";
  const accentCircle2 = isPatient ? "bg-[#CD853F]/20" : "bg-[#CD853F]/20";
  const accentCircle3 = isPatient ? "bg-[#DEB887]/20" : "bg-[#DEB887]/20";

  return (
    <div className="h-screen w-full flex relative overflow-hidden bg-gradient-to-br from-ayurveda-chandana/30 via-ayurveda-haldi/20 to-ayurveda-kumkum/20">
      {/* Main background with multiple layers */}
      <div className="fixed inset-0">
        {/* Simple, clean gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B4513]/20 via-[#CD853F]/15 to-[#DEB887]/20 animate-gradient-slow"></div>

        {/* Single, subtle mandala pattern */}
        <div className="absolute inset-0 bg-[url('/patterns/mandala-bg.svg')] bg-repeat-x bg-center opacity-5 animate-spin-very-slow"></div>

        {/* Main decorative gradient */}
        <div className="absolute top-1/2 left-1/2 w-[1200px] h-[1200px] bg-gradient-to-r from-[#8B4513]/10 to-[#CD853F]/10 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>

        {/* Subtle corner decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[url('/patterns/corner-mandala.svg')] bg-no-repeat bg-contain opacity-5"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[url('/patterns/corner-mandala.svg')] bg-no-repeat bg-contain opacity-5 rotate-180"></div>
        {isPatient ? (
          <>
            {/* Patient background image and overlay */}
            <img
              src="/patterns/herbs-bg.svg"
              alt="Herbs"
              className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none z-0"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B4513]/20 via-[#CD853F]/15 to-[#DEB887]/20 z-0"></div>
            {/* Patient logo/icon and slogan */}
            <div className="absolute left-10 top-24 flex flex-col items-start z-10">
              <img
                src="/patterns/lotus-bg.svg"
                alt="Lotus"
                className="w-16 h-16 mb-2 opacity-80"
              />
              <span className="text-2xl md:text-3xl font-bold text-[#8B4513] drop-shadow-sm">
                Nurture Your Wellness
              </span>
              <span className="text-base md:text-lg text-[#CD853F] mt-1 font-medium italic">
                "Your journey to health begins here"
              </span>
            </div>
          </>
        ) : (
          <>
            {/* Doctor background image and overlay */}
            <img
              src="/patterns/herbs-bg.svg"
              alt="Herbs"
              className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none z-0"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B4513]/20 via-[#CD853F]/15 to-[#DEB887]/20 z-0"></div>
            {/* Doctor logo/icon and slogan */}
            <div className="absolute left-10 top-24 flex flex-col items-start z-10">
              <img
                src="/patterns/mandala-small.svg"
                alt="Mandala"
                className="w-16 h-16 mb-2 opacity-80"
              />
              <span className="text-2xl md:text-3xl font-bold text-[#8B4513] drop-shadow-sm">
                Trusted Ayurveda Experts
              </span>
              <span className="text-base md:text-lg text-[#CD853F] mt-1 font-medium italic">
                "Care, Compassion & Healing Wisdom"
              </span>
            </div>
          </>
        )}
        {/* Dynamic gradient and pattern overlays */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${bgGradient}`}
        ></div>
        <div
          className={`absolute inset-0 bg-[url('${patternUrl}')] bg-repeat opacity-20`}
        ></div>
        {/* Accent blurred circles */}
        <div
          className={`absolute -top-40 -right-40 w-[600px] h-[600px] ${accentCircle} rounded-full filter blur-2xl`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-40 w-[600px] h-[600px] ${accentCircle2} rounded-full filter blur-2xl`}
        ></div>
        <div
          className={`absolute top-1/2 right-1/2 w-[700px] h-[700px] ${accentCircle3} rounded-full filter blur-2xl translate-x-1/2 -translate-y-1/2`}
        ></div>
        {/* Floating soft elements */}
        <div
          className={`absolute bottom-1/4 left-1/4 w-16 h-16 ${accentCircle} rounded-full animate-float-medium`}
        ></div>
        <div
          className={`absolute top-1/4 right-1/4 w-20 h-20 ${accentCircle2} rounded-full animate-float-slow`}
        ></div>
        <div
          className={`absolute bottom-3/4 right-1/3 w-12 h-12 ${accentCircle3} rounded-full animate-float-fast`}
        ></div>
        <div
          className={`absolute top-2/3 left-1/3 w-14 h-14 ${accentCircle2} rounded-full animate-float-medium`}
        ></div>
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

      {/* Left Side - Branding */}
      <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden">
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <img
              src="/logo/om-symbol.svg"
              alt="Om Symbol"
              className="w-32 h-32 mx-auto animate-float-slow"
            />
          </div>
          <h1 className="text-7xl font-display text-dosha-kapha mb-6 tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-[#8B4513] via-[#CD853F] to-[#DEB887] bg-clip-text text-transparent">
              AyurSutra
            </span>
          </h1>
          <p className="text-2xl text-gray-600/90 font-body tracking-wide mb-3">
            पञ्चकर्म चिकित्सा में आपका स्वागत है
          </p>
          <p className="text-xl text-gray-500/80 font-body italic">
            Welcome to the journey of Panchakarma healing
          </p>

          {/* Panchakarma Icons */}
          <div className="mt-12 grid grid-cols-5 gap-6">
            <img
              src="/public/treatments/vamana.svg"
              alt="Vamana"
              className="w-12 h-12 opacity-60 hover:opacity-100 transition-opacity"
            />
            <img
              src="/public/treatments/virechana.svg"
              alt="Virechana"
              className="w-12 h-12 opacity-60 hover:opacity-100 transition-opacity"
            />
            <img
              src="/public/treatments/basti.svg"
              alt="Basti"
              className="w-12 h-12 opacity-60 hover:opacity-100 transition-opacity"
            />
            <img
              src="/public/treatments/nasya.svg"
              alt="Nasya"
              className="w-12 h-12 opacity-60 hover:opacity-100 transition-opacity"
            />
            <img
              src="/public/treatments/raktamoksha.svg"
              alt="Raktamoksha"
              className="w-12 h-12 opacity-60 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/patterns/herbs-bg.svg')] bg-repeat opacity-5"></div>
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-white/10 to-transparent"></div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-2 relative">
        <div className="w-full max-w-md bg-[#FDF5E6]/90 backdrop-blur-lg rounded-2xl shadow-[0_8px_32px_rgba(139,69,19,0.15)] p-4 border border-[#DEB887]/30 hover:shadow-[0_8px_32px_rgba(139,69,19,0.25)] transition-all duration-300 relative overflow-hidden">
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br from-[#8B4513]/30 via-[#CD853F]/20 to-[#DEB887]/30 -z-10"></div>

          <h2 className="text-lg font-display text-dosha-kapha mb-3 text-center">
            Create Your Account
          </h2>

          {/* Role Switcher at Top */}
          <div className="flex justify-center mb-3">
            <div className="flex bg-ayurveda-chandana/10 rounded-full p-1 shadow-inner border border-ayurveda-chandana/20">
              <button
                type="button"
                className={`px-4 py-1.5 rounded-full font-medium transition-all duration-200 focus:outline-none text-sm ${
                  formData.userType === "patient"
                    ? "bg-gradient-to-r from-ayurveda-brahmi to-ayurveda-neem text-white shadow-md scale-105"
                    : "text-ayurveda-brahmi hover:bg-ayurveda-brahmi/10"
                }`}
                onClick={() =>
                  setFormData({ ...formData, userType: "patient" })
                }
              >
                रोगी / Patient
              </button>
              <button
                type="button"
                className={`px-4 py-1.5 rounded-full font-medium transition-all duration-200 focus:outline-none text-sm ${
                  formData.userType === "practitioner"
                    ? "bg-gradient-to-r from-ayurveda-kumkum to-ayurveda-haldi text-white shadow-md scale-105"
                    : "text-ayurveda-kumkum hover:bg-ayurveda-kumkum/10"
                }`}
                onClick={() =>
                  setFormData({ ...formData, userType: "practitioner" })
                }
              >
                वैद्य / Practitioner
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {/* Name */}
            <div className="space-y-0.5">
              <label className="text-xs font-semibold text-gray-700 tracking-wide">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-hover:text-ayurveda-kumkum transition-colors group-focus-within:text-ayurveda-kumkum" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-3 py-2 bg-white/70 backdrop-blur-md border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum hover:border-ayurveda-kumkum/50 transition-all duration-200 placeholder:text-gray-400 text-gray-700 text-sm"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 tracking-wide">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-hover:text-ayurveda-kumkum transition-colors group-focus-within:text-ayurveda-kumkum" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-3 py-2 bg-white/70 backdrop-blur-md border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum hover:border-ayurveda-kumkum/50 transition-all duration-200 placeholder:text-gray-400 text-gray-700 text-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 tracking-wide">
                Phone Number
              </label>
              <div className="relative group">
                <Phone className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-hover:text-ayurveda-kumkum transition-colors group-focus-within:text-ayurveda-kumkum" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-3 py-2 bg-white/70 backdrop-blur-md border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum hover:border-ayurveda-kumkum/50 transition-all duration-200 placeholder:text-gray-400 text-gray-700 text-sm"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 tracking-wide">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-hover:text-ayurveda-kumkum transition-colors group-focus-within:text-ayurveda-kumkum" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-9 py-2 bg-white/70 backdrop-blur-md border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum hover:border-ayurveda-kumkum/50 transition-all duration-200 placeholder:text-gray-400 text-gray-700 text-sm"
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

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 tracking-wide">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-hover:text-ayurveda-kumkum transition-colors group-focus-within:text-ayurveda-kumkum" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-9 py-2 bg-white/70 backdrop-blur-md border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-ayurveda-kumkum/20 focus:border-ayurveda-kumkum hover:border-ayurveda-kumkum/50 transition-all duration-200 placeholder:text-gray-400 text-gray-700 text-sm"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            {/* Signup Button */}
            <button
              onClick={handleSignup}
              className="w-full relative overflow-hidden bg-gradient-to-r from-[#8B4513] to-[#CD853F] text-[#FDF5E6] px-6 py-3 rounded-xl font-medium group shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#CD853F] to-[#DEB887] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <span className="text-base font-display block">
                  पंजीकरण करें
                </span>
                <span className="text-xs opacity-90">Create Your Account</span>
              </div>
              <div className="absolute inset-0 ring-2 ring-white/20 rounded-xl group-hover:ring-white/40 transition-all duration-300"></div>
            </button>

            {/* Divider with Panchakarma Elements */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#8B4513]/30 to-transparent"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="bg-[#FDF5E6] px-4 py-1 rounded-full">
                  <div className="text-center">
                    <p className="text-xs text-[#8B4513]/70 font-decorative">
                      पञ्चकर्म
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <img
                        src="/public/treatments/vamana.svg"
                        alt="Vamana"
                        className="w-3 h-3 opacity-40"
                      />
                      <img
                        src="/public/treatments/virechana.svg"
                        alt="Virechana"
                        className="w-3 h-3 opacity-40"
                      />
                      <img
                        src="/public/treatments/basti.svg"
                        alt="Basti"
                        className="w-3 h-3 opacity-40"
                      />
                      <img
                        src="/public/treatments/nasya.svg"
                        alt="Nasya"
                        className="w-3 h-3 opacity-40"
                      />
                      <img
                        src="/public/treatments/raktamoksha.svg"
                        alt="Raktamoksha"
                        className="w-3 h-3 opacity-40"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Login Options */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center px-4 py-3 bg-white/70 backdrop-blur-md border-2 border-gray-100 rounded-xl hover:border-ayurveda-kumkum/50 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#4285F4]/10 to-[#34A853]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                <span className="text-gray-600 group-hover:text-gray-800 transition-colors font-medium">
                  Google
                </span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 bg-white/70 backdrop-blur-md border-2 border-gray-100 rounded-xl hover:border-ayurveda-kumkum/50 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#1877f2]/10 to-[#3b5998]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-5 h-5 mr-2 bg-[#1877f2] rounded text-white text-xs flex items-center justify-center font-bold">
                  f
                </div>
                <span className="text-gray-600 group-hover:text-gray-800 transition-colors font-medium">
                  Facebook
                </span>
              </button>
            </div>

            {/* Switch to Login Link */}
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center space-x-1.5">
                <span className="text-gray-600 text-sm">
                  Already have an account?
                </span>
                <button
                  onClick={onSwitchToLogin}
                  className="text-ayurveda-kumkum hover:text-ayurveda-brahmi font-semibold transition-colors text-sm underline-offset-4 hover:underline"
                >
                  Log in here
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Privacy Policy - Positioned to not interfere with buttons */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-10">
        <div className="text-xs text-gray-500/70 backdrop-blur-sm bg-white/20 py-1.5 mx-auto inline-block px-4 rounded-full shadow-sm pointer-events-auto">
          By signing up, you agree to our{" "}
          <a
            href="#"
            className="text-ayurveda-kumkum hover:text-ayurveda-brahmi transition-colors font-medium"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-ayurveda-kumkum hover:text-ayurveda-brahmi transition-colors font-medium"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
