import React from "react";
import {
  Leaf,
  Heart,
  Calendar,
  TrendingUp,
  Bell,
  Users,
  Shield,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const LandingPage = ({ onGetStarted }) => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const [showFloatingNav, setShowFloatingNav] = React.useState(false);

  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowFloatingNav(scrollPosition > 600);

      // Calculate scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const progress = (scrollPosition / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const features = [
    {
      icon: Calendar,
      title: "दिनचर्या (Daily Routine)",
      subtitle: "Smart Scheduling",
      description:
        "Harmonize your therapy sessions with natural rhythms and biorhythms",
      gradient: "from-ayurveda-haldi to-ayurveda-kumkum",
    },
    {
      icon: TrendingUp,
      title: "प्रगति (Progress)",
      subtitle: "Wellness Tracking",
      description:
        "Monitor your journey through the five stages of Panchakarma",
      gradient: "from-ayurveda-brahmi to-ayurveda-neem",
    },
    {
      icon: Bell,
      title: "स्मृति (Reminders)",
      subtitle: "Care Alerts",
      description:
        "Timely guidance for pre and post-therapy protocols (Purvakarma & Paschatkarma)",
      gradient: "from-dosha-vata to-dosha-kapha",
    },
    {
      icon: Heart,
      title: "आरोग्य (Wellness)",
      subtitle: "Holistic Health",
      description: "Balance the three doshas - Vata, Pitta, and Kapha",
      gradient: "from-ayurveda-chandana to-ayurveda-triphala",
    },
  ];

  const benefits = [
    "Personalized Panchakarma protocols based on your Prakriti (body constitution)",
    "Track your journey through Purvakarma, Pradhana Karma, and Paschatkarma",
    "Dosha-specific dietary recommendations and lifestyle guidelines",
    "Seamless communication with your Vaidya (Ayurvedic practitioner)",
    "Monitor the balance of Vata, Pitta, and Kapha doshas",
    "Access your wellness journey anytime, anywhere with mobile support",
  ];

  const testimonials = [
    {
      name: "Vd. Rajesh Kumar",
      role: "वैद्य (Ayurvedic Physician)",
      specialty: "Panchakarma Specialist",
      text: "AyurSutra brings the wisdom of ancient Ayurveda into the digital age. The dosha tracking and Panchakarma progression monitoring have helped my patients achieve better balance in their healing journey.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "साधक (Wellness Seeker)",
      specialty: "Recovering from Vata imbalance",
      text: "The personalized care reminders based on my prakriti (constitution) and the detailed tracking of my dosha balance have transformed my healing experience. The app makes following the panchakarma protocol so much easier.",
      rating: 5,
    },
    {
      name: "Vd. Meera Patel",
      role: "आयुर्वेद केन्द्र निदेशक",
      specialty: "Director, Ayurveda Center",
      text: "Since implementing AyurSutra, we've seen remarkable improvements in patient adherence to their prescribed panchakarma regimens. The traditional wisdom combined with modern tracking is truly revolutionary.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ayurveda-chandana/20 via-ayurveda-haldi/10 to-ayurveda-kumkum/10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-ayurveda-chandana/20 sticky top-0 z-50">
        {/* Scroll Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-ayurveda-kumkum to-ayurveda-brahmi transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-ayurveda-brahmi to-ayurveda-neem p-2 rounded-lotus">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold font-display bg-gradient-to-r from-ayurveda-brahmi to-ayurveda-neem bg-clip-text text-transparent">
                आयुरसूत्र
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-700 hover:text-ayurveda-brahmi font-medium transition-colors cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("benefits")}
                className="text-gray-700 hover:text-ayurveda-brahmi font-medium transition-colors cursor-pointer"
              >
                Benefits
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-gray-700 hover:text-ayurveda-brahmi font-medium transition-colors cursor-pointer"
              >
                Testimonials
              </button>
            </nav>
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-ayurveda-brahmi to-ayurveda-neem text-white px-6 py-2 rounded-lotus font-medium hover:from-dosha-kapha hover:to-ayurveda-brahmi transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Begin Your Journey
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Mandala Background */}
        <div className="absolute inset-0 bg-mandala-pattern opacity-5 animate-spin-slow"></div>

        {/* Floating Herbs Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-16 h-16 bg-ayurveda-brahmi/10 rounded-full animate-float-slow"></div>
          <div className="absolute top-20 right-20 w-20 h-20 bg-ayurveda-haldi/10 rounded-full animate-float-medium"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-ayurveda-kumkum/10 rounded-full animate-float-fast"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            {/* Sanskrit Blessing */}
            <div className="mb-8">
              <p className="text-xl text-ayurveda-triphala font-decorative opacity-75">
                ॐ सर्वे भवन्तु सुखिनः
              </p>
              <p className="text-sm text-gray-500">May All Beings Be Happy</p>
            </div>

            <h1 className="text-5xl md:text-7xl font-display mb-6 relative">
              <span className="bg-gradient-to-r from-ayurveda-haldi via-ayurveda-kumkum to-ayurveda-brahmi bg-clip-text text-transparent animate-shimmer">
                Discover Balance
              </span>
              <br />
              <span className="text-dosha-kapha font-decorative relative">
                Through Panchakarma
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-base text-ayurveda-triphala font-normal">
                  पञ्चकर्म द्वारा
                </span>
              </span>
            </h1>

            <div className="relative">
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed font-body">
                <span className="block mb-4 group">
                  <span className="text-2xl font-decorative text-ayurveda-triphala">
                    हर्षश्च । सौख्यम् । आरोग्यम् ।
                  </span>
                  <span className="block text-base text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Joy • Comfort • Well-being
                  </span>
                </span>
                Experience the harmony of ancient Ayurvedic wisdom empowered by
                modern technology for a transformative healing journey.
              </p>

              {/* Decorative Divider */}
              <div className="w-24 h-1 bg-gradient-to-r from-ayurveda-kumkum to-ayurveda-haldi mx-auto mb-8"></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-dosha-kapha to-ayurveda-brahmi text-white px-10 py-4 rounded-xl font-display text-lg hover:from-ayurveda-brahmi hover:to-dosha-kapha transform hover:scale-102 transition-all duration-300 shadow-lg flex flex-col items-center group border border-white/10"
              >
                <span className="text-2xl mb-1.5 font-medium">
                  यात्रा आरंभ करें
                </span>
                <span className="text-base flex items-center text-white/95 tracking-wide">
                  Begin Your Journey
                  <ArrowRight className="ml-2.5 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="text-ayurveda-triphala hover:text-ayurveda-kumkum font-display text-lg flex flex-col items-center transition-colors">
                <span className="text-xl">प्रदर्शन</span>
                <span className="text-sm flex items-center">
                  Watch Demo
                  <div className="ml-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-lotus flex items-center justify-center shadow-md border border-ayurveda-chandana/20">
                    <div className="w-0 h-0 border-l-[6px] border-l-ayurveda-kumkum border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                  </div>
                </span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>500+ Practitioners</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>10,000+ Patients</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>4.9/5 Rating</span>
              </div>
            </div>

            {/* Floating Navigation */}
            <div
              className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
                showFloatingNav
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-ayurveda-chandana/20 flex items-center space-x-6">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("features");
                  }}
                  className="text-sm text-gray-600 hover:text-ayurveda-kumkum transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("benefits");
                  }}
                  className="text-sm text-gray-600 hover:text-ayurveda-kumkum transition-colors"
                >
                  Benefits
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("testimonials");
                  }}
                  className="text-sm text-gray-600 hover:text-ayurveda-kumkum transition-colors"
                >
                  Testimonials
                </button>
                <button
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-ayurveda-brahmi to-ayurveda-kumkum text-white px-4 py-1.5 rounded-full text-sm hover:from-ayurveda-kumkum hover:to-ayurveda-brahmi transition-all duration-300"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-ayurveda-chandana/10">
          <div className="absolute inset-0 bg-[url('/patterns/lotus-bg.png')] opacity-5"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            {/* Sanskrit Title */}
            <div className="mb-4">
              <p className="text-xl text-ayurveda-triphala font-decorative">
                आयुर्वेद के मूल तत्व
              </p>
              <p className="text-sm text-gray-500">Foundations of Ayurveda</p>
            </div>

            <h2 className="text-5xl md:text-6xl font-display text-dosha-kapha mb-6 relative">
              <span className="relative inline-block">
                Essential Elements of
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[url('/patterns/mandala-small.png')] opacity-10"></div>
              </span>
              <span className="bg-gradient-to-r from-ayurveda-kumkum to-dosha-kapha bg-clip-text text-transparent">
                {" "}
                Wellness
              </span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-body leading-relaxed">
              Experience the harmonious blend of ancient Panchakarma wisdom and
              modern healing practices.
            </p>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center my-8">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-ayurveda-kumkum"></div>
              <div className="mx-4">
                <img
                  src="/patterns/om-symbol.png"
                  alt="Om"
                  className="w-8 h-8 opacity-50"
                />
              </div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-ayurveda-kumkum"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group relative">
                  {/* Card Background with Border Animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-ayurveda-haldi/30 via-ayurveda-kumkum/30 to-ayurveda-brahmi/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-ayurveda-chandana/10 h-full flex flex-col overflow-hidden">
                    {/* Feature Icon */}
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-lotus flex items-center justify-center mb-4 group-hover:scale-105 transition-transform relative`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lotus"></div>
                    </div>

                    {/* Feature Content */}
                    <div className="space-y-2">
                      <h3 className="font-display text-xl text-dosha-kapha group-hover:text-ayurveda-kumkum transition-colors">
                        {feature.title}
                      </h3>
                      <h4 className="text-base font-medium text-ayurveda-triphala">
                        {feature.subtitle}
                      </h4>
                      <p className="text-gray-600 leading-relaxed font-body text-sm">
                        {feature.description}
                      </p>
                    </div>

                    {/* Hover Decoration */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-ayurveda-haldi via-ayurveda-kumkum to-ayurveda-brahmi transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-mandala-pattern bg-fixed opacity-5"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-ayurveda-chandana/5 via-transparent to-ayurveda-haldi/5"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              {/* Decorative Corner Elements */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[url('/patterns/corner-mandala.png')] opacity-20"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[url('/patterns/corner-mandala.png')] opacity-20 transform rotate-180"></div>

              {/* Content */}
              <div className="relative">
                {/* Sanskrit Title */}
                <div className="mb-4">
                  <p className="text-xl text-ayurveda-triphala font-decorative">
                    आरोग्य पथ
                  </p>
                  <p className="text-sm text-gray-500">Path to Wellness</p>
                </div>

                <h2 className="text-4xl md:text-5xl font-decorative text-dosha-kapha mb-6">
                  The Path to
                  <span className="bg-gradient-to-r from-ayurveda-kumkum to-ayurveda-haldi bg-clip-text text-transparent animate-shimmer">
                    {" "}
                    Wellness
                  </span>
                </h2>

                <div className="relative mb-8">
                  <p className="text-xl text-gray-600 font-body relative z-10">
                    <span className="block mb-4 group">
                      <span className="inline-block text-2xl font-decorative text-ayurveda-triphala">
                        संतुलन । शुद्धि । स्वास्थ्य
                      </span>
                      <span className="block text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        Balance • Purification • Health
                      </span>
                    </span>
                    Embrace the timeless wisdom of Ayurveda with modern tools
                    designed for your healing journey.
                  </p>
                  {/* Background Decoration */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-ayurveda-haldi/5 rounded-full blur-2xl"></div>
                </div>

                {/* Benefits List */}
                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="group flex items-start space-x-4 p-3 rounded-lg hover:bg-white/50 transition-colors duration-300"
                    >
                      <div className="relative">
                        <CheckCircle className="h-6 w-6 text-ayurveda-kumkum group-hover:text-ayurveda-haldi transition-colors duration-300" />
                        <div className="absolute inset-0 bg-ayurveda-kumkum/20 blur-lg group-hover:bg-ayurveda-haldi/20 transition-colors duration-300 opacity-0 group-hover:opacity-100"></div>
                      </div>
                      <div>
                        <span className="text-gray-700 text-lg group-hover:text-dosha-kapha transition-colors duration-300">
                          {benefit}
                        </span>
                        {/* Subtle line decoration */}
                        <div className="h-px w-0 group-hover:w-full bg-gradient-to-r from-ayurveda-kumkum to-transparent transition-all duration-500"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={onGetStarted}
                className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-xl"
              >
                Start Free Trial
              </button>
            </div>

            {/* Mock Dashboard Preview */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-700">
                      Wellness Progress
                    </div>
                    <div className="text-2xl font-bold text-green-600">85%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">
                      Next Session
                    </div>
                    <div className="font-medium">Abhyanga</div>
                    <div className="text-xs text-gray-600">Sep 8, 10:00 AM</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">
                      Wellness Score
                    </div>
                    <div className="font-medium">8.5/10</div>
                    <div className="text-xs text-green-600">
                      ↗ +0.8 this week
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-ayurveda-chandana/10 to-white/50"></div>
          <div className="absolute inset-0 bg-[url('/patterns/herbs-bg.png')] opacity-5"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            {/* Sanskrit Title with Decorative Elements */}
            <div className="inline-block relative">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-[url('/patterns/mandala-detailed.png')] opacity-10"></div>
              <h2 className="text-4xl md:text-5xl font-decorative text-dosha-kapha mb-4">
                <span className="relative">
                  प्रशंसा
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ayurveda-kumkum to-transparent"></span>
                </span>
                <span className="bg-gradient-to-r from-ayurveda-kumkum to-ayurveda-haldi bg-clip-text text-transparent animate-shimmer">
                  {" "}
                  Testimonials
                </span>
              </h2>
            </div>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body relative">
              <span className="block mb-2 text-ayurveda-triphala font-decorative">
                अनुभवी वैद्यों की राय
              </span>
              Join our growing community of Vaidyas and wellness seekers who
              have embraced the harmony of traditional wisdom and modern
              convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative transform hover:-translate-y-1 transition-all duration-500"
              >
                {/* Card Background with Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-ayurveda-haldi via-ayurveda-kumkum to-ayurveda-brahmi rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

                <div className="relative bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-ayurveda-chandana/10 flex flex-col h-full overflow-hidden">
                  {/* Rating Stars with Animation */}
                  <div className="flex items-center mb-4 space-x-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-ayurveda-haldi fill-current transform group-hover:scale-110 transition-transform duration-300"
                        style={{ transitionDelay: `${i * 50}ms` }}
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <div className="relative mb-6 flex-grow">
                    <div className="absolute -top-2 -left-2 text-4xl text-ayurveda-kumkum/20 font-decorative">
                      "
                    </div>
                    <p className="text-gray-700 font-body text-base leading-relaxed relative z-10 pl-4">
                      {testimonial.text}
                    </p>
                    <div className="absolute -bottom-2 -right-2 text-4xl text-ayurveda-kumkum/20 font-decorative">
                      "
                    </div>
                  </div>

                  {/* Author Info with Hover Effects */}
                  <div className="flex items-center mt-auto pt-4 border-t border-ayurveda-chandana/10">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-r from-dosha-kapha to-ayurveda-brahmi rounded-lotus flex items-center justify-center text-white text-base font-medium transform group-hover:rotate-12 transition-transform duration-300">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lotus"></div>
                    </div>

                    <div className="ml-4 min-w-0 flex-1">
                      <div className="font-display text-lg text-dosha-kapha truncate group-hover:text-ayurveda-kumkum transition-colors duration-300">
                        {testimonial.name}
                      </div>
                      <div className="text-base font-medium text-ayurveda-triphala truncate">
                        {testimonial.role}
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {testimonial.specialty}
                      </div>
                    </div>
                  </div>

                  {/* Decorative Bottom Border */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-ayurveda-haldi via-ayurveda-kumkum to-ayurveda-brahmi transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-ayurveda-brahmi to-dosha-kapha relative overflow-hidden">
        <div className="absolute inset-0 bg-mandala-pattern opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-decorative text-white mb-6">
            आरम्भ करें
            <span className="block text-ayurveda-haldi">
              Begin Your Healing Journey
            </span>
          </h2>
          <p className="text-xl text-ayurveda-chandana mb-8 max-w-2xl mx-auto font-body">
            Join our growing संघ (community) of practitioners and seekers on the
            path to holistic wellness through the ancient wisdom of Panchakarma.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="bg-white/90 backdrop-blur-sm text-ayurveda-brahmi px-8 py-4 rounded-lotus font-display text-lg hover:bg-white transform hover:scale-105 transition-all duration-200 shadow-xl border border-white/20"
            >
              प्रारंभ करें
              <span className="block text-sm">Start Free Trial</span>
            </button>
            <button className="border-2 border-ayurveda-chandana text-white px-8 py-4 rounded-lotus font-display text-lg hover:bg-white/10 transition-all duration-200">
              परिचय
              <span className="block text-sm">Schedule Demo</span>
            </button>
          </div>
          <div className="mt-8 text-ayurveda-chandana">
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                <span>Privacy Protected</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>30-Day Trial</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                <span>24/7 सहायता (Support)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-dosha-kapha to-gray-900 text-gray-300 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-lotus-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-ayurveda-kumkum to-ayurveda-haldi p-2 rounded-lotus">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-display text-white">
                    आयुरसूत्र
                  </span>
                  <span className="block text-sm text-ayurveda-chandana">
                    AyurSutra
                  </span>
                </div>
              </div>
              <p className="text-ayurveda-chandana mb-4 font-body">
                "आरोग्यं परमं भाग्यं" <br />
                <span className="text-sm text-gray-400">
                  Health is the greatest blessing
                </span>
              </p>
            </div>

            <div>
              <h3 className="text-white font-display mb-4">सेवाएं</h3>
              <h4 className="text-sm text-ayurveda-chandana mb-2">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-ayurveda-haldi transition-colors"
                  >
                    Panchakarma Tracking
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-ayurveda-haldi transition-colors"
                  >
                    Dosha Analysis
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-ayurveda-haldi transition-colors"
                  >
                    Treatment Protocols
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-ayurveda-haldi transition-colors"
                  >
                    Wellness Calendar
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-display mb-4">सहायता</h3>
              <h4 className="text-sm text-ayurveda-chandana mb-2">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-ayurveda-haldi transition-colors"
                  >
                    Knowledge Base
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-ayurveda-haldi transition-colors"
                  >
                    Vaidya Connect
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-ayurveda-haldi transition-colors"
                  >
                    Training Videos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-ayurveda-haldi transition-colors"
                  >
                    Community Forum
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-display mb-4">संपर्क</h3>
              <h4 className="text-sm text-ayurveda-chandana mb-2">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-ayurveda-haldi transition-colors"
                  >
                    About Our Mission
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-ayurveda-haldi transition-colors"
                  >
                    Ayurvedic Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-ayurveda-haldi transition-colors"
                  >
                    Join Our Team
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-ayurveda-haldi transition-colors"
                  >
                    Privacy Promise
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-ayurveda-chandana/20 mt-8 pt-8 text-center">
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <span className="text-ayurveda-chandana text-sm px-3 py-1 border border-ayurveda-chandana/20 rounded-lotus">
                HIPAA Compliant
              </span>
              <span className="text-ayurveda-chandana text-sm px-3 py-1 border border-ayurveda-chandana/20 rounded-lotus">
                ISO 27001 Certified
              </span>
              <span className="text-ayurveda-chandana text-sm px-3 py-1 border border-ayurveda-chandana/20 rounded-lotus">
                NABH Standards
              </span>
            </div>
            <p className="text-sm text-gray-400">
              &copy; 2025 आयुरसूत्र | AyurSutra. सर्वाधिकार सुरक्षित | All
              rights reserved. <br />
              <span className="text-ayurveda-chandana">
                Made with ❤️ for the global Ayurvedic community
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
