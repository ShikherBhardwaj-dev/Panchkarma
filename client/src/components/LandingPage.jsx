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
  const [activeDosha, setActiveDosha] = React.useState("Vata");
  const [activeTreatment, setActiveTreatment] = React.useState("Vamana");

  // Function to handle treatment selection and scroll
  const handleTreatmentSelect = (treatmentName) => {
    setActiveTreatment(treatmentName);

    // Scroll to treatment details section
    const treatmentDetailsElement =
      document.getElementById("treatment-details");
    if (treatmentDetailsElement) {
      treatmentDetailsElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  // Function to handle dosha selection and scroll
  const handleDoshaSelect = (doshaName) => {
    setActiveDosha(doshaName);

    // Scroll to dosha details section
    const doshaDetailsElement = document.getElementById("dosha-details");
    if (doshaDetailsElement) {
      doshaDetailsElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  const treatments = [
    {
      name: "Vamana",
      sanskrit: "वमन",
      desc: "Therapeutic Emesis",
      icon: "/treatments/vamana.svg",
      image: "/treatments/vamana.jpg",
      details: `When there is congestion in the lungs causing repeated attacks of bronchitis, colds, cough, or asthma, the Ayurvedic treatment is therapeutic vomiting, vamana, to eliminate the kapha causing the excess mucus.

Oftentimes this also releases repressed emotions that have been held in the kapha areas of the lungs and stomach along with the accumulated dosha. Once the mucus is released, the patient will feel instantly relieved.`,
      benefits: [
        "Relief from chronic asthma",
        "Treats diabetes and chronic cold",
        "Helps with lymphatic congestion",
        "Improves chronic indigestion",
        "Reduces edema",
      ],
      results: [
        "Relaxation in lungs",
        "Free breathing",
        "Lightness in chest",
        "Clear thinking",
        "Clear voice",
        "Good appetite",
      ],
    },
    {
      name: "Virechana",
      sanskrit: "विरेचन",
      desc: "Purgation Therapy",
      icon: "/treatments/virechana.svg",
      image: "/treatments/virechana.jpg",
      details: `When excess bile, pitta, is secreted and accumulated in the gallbladder, liver, and small intestine, it tends to result in rashes, skin inflammation, acne, chronic attacks of fever, biliary vomiting, nausea, and jaundice. 

Purgatives help relieve the excess pitta causing the bile disturbance in the body. In fact, purgatives can completely cure the problem of excess pitta.`,
      benefits: [
        "Treats skin inflammation",
        "Helps with chronic fever",
        "Reduces biliary issues",
        "Balances pitta dosha",
        "Improves liver function",
      ],
    },
    {
      name: "Basti",
      sanskrit: "बस्ति",
      desc: "Enema Therapy",
      icon: "/treatments/basti.svg",
      image: "/treatments/basti.jpg",
      details: `Vata is a very active principle in pathogenesis. If we can control vata through the use of basti, we have gone a long way in going to the root cause of the vast majority of diseases. 

The medication administered rectally affects asthi dhatu (bone tissue). The mucus membrane of the colon is related to the outer covering of the bones, which nourishes them.`,
      benefits: [
        "Controls vata disorders",
        "Affects bone tissue health",
        "Balances elimination processes",
        "Helps with deep tissue healing",
        "Manages various vata conditions",
      ],
    },
    {
      name: "Nasya",
      sanskrit: "नस्य",
      desc: "Nasal Administration",
      icon: "/treatments/nasya.svg",
      image: "/treatments/nasya.jpg",
      details: `The nose is the doorway to the brain and consciousness. An excess of bodily humors accumulated in the sinus, throat, nose, or head areas is eliminated through the nose. 

Prana enters the body through breath taken in through the nose and maintains sensory and motor functions. It also governs mental activities, memory, and concentration.`,
      benefits: [
        "Treats prana disorders",
        "Relieves sinus congestion",
        "Helps with migraine headaches",
        "Improves sensory perception",
        "Enhances memory and concentration",
      ],
      procedure: [
        "Nasal massage with ghee",
        "Clockwise and counter-clockwise movements",
        "Regular morning and evening practice",
        "Gentle and careful application",
      ],
    },
    {
      name: "Rakta Moksha",
      sanskrit: "रक्त मोक्ष",
      desc: "Blood Purification",
      icon: "/treatments/raktamoksha.svg",
      image: "/treatments/raktamoksha.jpg",
      details: `Toxins present in the gastrointestinal tract are absorbed into the blood and circulated throughout the body. This condition, called toxemia, is the basic cause of repeated infections and certain circulatory conditions.

This treatment is particularly effective for skin disorders, enlarged liver, spleen, and gout. Pitta and blood have a very close relationship.`,
      benefits: [
        "Purifies blood",
        "Treats skin disorders",
        "Helps with liver enlargement",
        "Manages gout",
        "Stimulates immune system",
      ],
      restrictions: [
        "Sugar",
        "Salt",
        "Yogurt",
        "Sour-tasting foods",
        "Alcohol",
        "Fermented foods",
      ],
    },
  ];

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
      gradient: "from-brand-yellow to-brand-red",
    },
    {
      icon: TrendingUp,
      title: "प्रगति (Progress)",
      subtitle: "Wellness Tracking",
      description:
        "Monitor your journey through the five stages of Panchakarma",
      gradient: "from-brand-teal to-brand-sage-dark",
    },
    {
      icon: Bell,
      title: "स्मृति (Reminders)",
      subtitle: "Care Alerts",
      description:
        "Timely guidance for pre and post-therapy protocols (Purvakarma & Paschatkarma)",
      gradient: "from-brand-sage to-brand-teal",
    },
    {
      icon: Heart,
      title: "आरोग्य (Wellness)",
      subtitle: "Holistic Health",
      description: "Balance the three doshas - Vata, Pitta, and Kapha",
      gradient: "from-brand-red to-brand-yellow",
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
    <div className="min-h-screen bg-gradient-to-br from-ayurveda-chandana/20 via-ayurveda-haldi/10 to-ayurveda-kumkum/10 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/patterns/mandala-bg.svg')] opacity-5 pointer-events-none bg-repeat"></div>
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-md border-b border-sage-200/50 sticky top-0 z-50">
        {/* Scroll Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sage-100">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 via-red-500 to-teal-600 transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-2 rounded-full">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold font-display text-teal-700">
                आयुरसूत्र
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection("what-is-panchakarma")}
                className="text-sage-700 hover:text-teal-700 font-medium transition-colors cursor-pointer"
              >
                What is Panchkarma?
              </button>
              <button
                onClick={() => scrollToSection("benefits")}
                className="text-sage-700 hover:text-teal-700 font-medium transition-colors cursor-pointer"
              >
                Benefits
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-sage-700 hover:text-teal-700 font-medium transition-colors cursor-pointer"
              >
                Testimonials
              </button>
            </nav>

            {/* Action Button */}
            <button
              onClick={onGetStarted}
              className="bg-teal-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-800 transition-colors"
            >
              Begin Your Journey
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center pt-10 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Top Elements */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-ayurveda-chandana/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute top-0 left-0 w-[30rem] h-[30rem] bg-ayurveda-haldi/15 rounded-full blur-2xl -translate-y-1/4 -translate-x-1/4"></div>

        {/* Main Hero Content */}
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
          <div className="flex flex-col items-center max-w-3xl w-full relative z-10 text-center">
            {/* Sanskrit Blessing */}
            <div className="mb-12 animate-fade-in">
              <p className="text-xl text-brand-sage-dark font-decorative">
                ॐ सर्वे भवन्तु सुखिनः
              </p>
              <p className="text-sm text-brand-sage/80 mt-1">
                May All Beings Be Happy
              </p>
            </div>

            {/* Main Title */}
            <h1 className="leading-tight w-full animate-slide-up">
              <div className="text-6xl md:text-7xl lg:text-8xl font-display mb-4">
                <span className="bg-gradient-to-r from-brand-yellow via-brand-red to-brand-teal bg-clip-text text-transparent inline-block">
                  Discover Balance
                </span>
              </div>
              <div className="text-5xl md:text-6xl lg:text-7xl font-display text-brand-teal mt-2">
                Through Panchakarma
              </div>
            </h1>

            {/* Sanskrit Subtitle */}
            <div
              className="mt-8 text-xl text-brand-sage-dark font-decorative animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              हर्षश्च । सौख्यम् । आरोग्यम् ।
            </div>

            {/* Description */}
            <p
              className="mt-8 text-lg text-brand-sage-dark max-w-2xl leading-relaxed mx-auto animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              Experience the harmony of ancient Ayurvedic wisdom empowered by
              modern technology for a transformative healing journey.
            </p>

            {/* Action Button */}
            <div
              className="flex justify-center mt-12 animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              <button
                onClick={onGetStarted}
                className="group bg-gradient-to-r from-brand-teal to-brand-teal-dark text-white px-8 py-4 rounded-xl shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-300 flex items-center"
              >
                <div className="flex flex-col items-start">
                  <span className="text-lg font-medium">यात्रा आरंभ करें</span>
                  <span className="text-sm text-white/90">
                    Begin Your Journey
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div
              className="flex flex-wrap justify-center mt-16 gap-8 sm:gap-12 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-brand-sage-light/20 rounded-full">
                  <Users className="h-5 w-5 text-brand-sage-dark" />
                </div>
                <div>
                  <span className="text-brand-sage-dark font-medium block">
                    500+
                  </span>
                  <span className="text-sm text-brand-sage">Practitioners</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-brand-sage-light/20 rounded-full">
                  <Heart className="h-5 w-5 text-brand-sage-dark" />
                </div>
                <div>
                  <span className="text-brand-sage-dark font-medium block">
                    10,000+
                  </span>
                  <span className="text-sm text-brand-sage">Patients</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-brand-yellow/10 rounded-full">
                  <Star className="h-5 w-5 text-brand-yellow" />
                </div>
                <div>
                  <span className="text-brand-sage-dark font-medium block">
                    4.9/5
                  </span>
                  <span className="text-sm text-brand-sage">Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What is Panchakarma Section */}
        <div className="mt-24 relative overflow-hidden">
          {/* Scroll target positioned above the heading */}
          <div id="what-is-panchakarma" className="absolute -top-20"></div>

          {/* Decorative Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-ayurveda-chandana/8"></div>
            <div className="absolute inset-0 bg-[url('/patterns/herbs-bg.png')] opacity-5 animate-pulse-slow"></div>
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-ayurveda-haldi/8 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-ayurveda-kumkum/8 rounded-full blur-2xl transform translate-y-1/4 -translate-x-1/4"></div>
          </div>

          <div className="relative">
            <div className="text-center mb-16">
              <div className="inline-block relative">
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-[url('/patterns/mandala-small.svg')] opacity-10 animate-spin-slow"></div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display mb-4 relative">
                  <span
                    className="relative inline-block animate-fade-in-up"
                    style={{ animationDelay: "0.2s" }}
                  >
                    What is
                  </span>
                  <span
                    className="bg-gradient-to-r from-brand-red to-brand-teal bg-clip-text text-transparent relative inline-block animate-fade-in-up ml-2"
                    style={{ animationDelay: "0.4s" }}
                  >
                    Panchakarma?
                  </span>
                </h2>
              </div>
              <p
                className="text-xl text-brand-sage-dark font-decorative mt-2 opacity-0 animate-fade-in"
                style={{ animationDelay: "0.6s" }}
              >
                पंचकर्म चिकित्सा
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-brand-yellow via-brand-red to-brand-teal mx-auto mt-6 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose prose-lg max-w-none">
                <div
                  className="relative p-6 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-500 animate-fade-in-up"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-[url('/patterns/corner-mandala.svg')] opacity-20"></div>
                  <p className="text-lg text-brand-sage-dark leading-relaxed mb-6">
                    Panchakarma is a treatment program for the body, mind, and
                    consciousness that cleanses and rejuvenates. It is based on
                    Ayurvedic principles, every human is a unique phenomenon
                    manifested through the five basic elements of Ether, Air,
                    Fire, Water, and Earth.
                  </p>
                </div>

                <div
                  className="relative mt-8 p-8 rounded-2xl bg-gradient-to-br from-brand-sage-light/30 to-brand-sage-light/10 backdrop-blur-sm border border-brand-sage-light/20 transform hover:-translate-y-1 transition-all duration-500 animate-fade-in-up"
                  style={{ animationDelay: "0.6s" }}
                >
                  <div className="absolute -right-3 -top-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl">💫</span>
                  </div>
                  <p className="text-lg text-brand-sage-dark leading-relaxed">
                    The combination of these elements are three doshas
                    (tridosha):{" "}
                    <span className="font-medium text-brand-teal">Vata</span>,{" "}
                    <span className="font-medium text-brand-red">Pitta</span>,
                    and{" "}
                    <span className="font-medium text-brand-yellow">Kapha</span>
                    , and their balance is unique to each individual. When this
                    doshic balance is disturbed it creates disorder resulting in
                    disease.
                  </p>
                </div>

                <div
                  className="relative mt-8 p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-elevation-1 animate-fade-in-up"
                  style={{ animationDelay: "0.8s" }}
                >
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[url('/patterns/corner-mandala.svg')] opacity-20 transform rotate-180"></div>
                  <p className="text-lg text-brand-sage-dark leading-relaxed">
                    Panchakarma is done individually for each person with their
                    specific constitution and specific disorder in mind, thus it
                    requires close observation and supervision. Treatment starts
                    with pre-purification Measures of Snehan and Svedana, and
                    then cleansing methods – Shodanas, are applied.
                  </p>
                </div>
              </div>

              <div
                className="relative group animate-fade-in-up"
                style={{ animationDelay: "1s" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-yellow via-brand-red to-brand-teal rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transform group-hover:scale-105 transition-all duration-500"></div>
                <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-elevation-2 p-8 transform hover:-translate-y-2 transition-all duration-500">
                  {/* Five Elements Card */}
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-display text-brand-sage-dark">
                        The Five Elements
                      </h3>
                      <div className="w-12 h-12 bg-brand-sage-light/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl animate-spin-slow">🌀</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        {
                          element: "Ether",
                          icon: "🌌",
                          sanskrit: "आकाश",
                          color: "from-purple-500/20 to-purple-600/20",
                        },
                        {
                          element: "Air",
                          icon: "💨",
                          sanskrit: "वायु",
                          color: "from-blue-500/20 to-blue-600/20",
                        },
                        {
                          element: "Fire",
                          icon: "🔥",
                          sanskrit: "अग्नि",
                          color: "from-red-500/20 to-red-600/20",
                        },
                        {
                          element: "Water",
                          icon: "💧",
                          sanskrit: "जल",
                          color: "from-cyan-500/20 to-cyan-600/20",
                        },
                        {
                          element: "Earth",
                          icon: "🌍",
                          sanskrit: "पृथ्वी",
                          color: "from-green-500/20 to-green-600/20",
                        },
                      ].map((el, index) => (
                        <div
                          key={index}
                          className={`group relative overflow-hidden rounded-xl p-5 bg-gradient-to-br ${el.color} hover:scale-105 transform transition-all duration-300`}
                        >
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                          <div className="relative z-10">
                            <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                              {el.icon}
                            </div>
                            <div className="text-brand-sage-dark font-medium text-lg">
                              {el.element}
                            </div>
                            <div className="text-brand-red font-decorative text-lg mt-1 opacity-80">
                              {el.sanskrit}
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-brand-yellow via-brand-red to-brand-teal transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Essential Elements of Wellness */}
        <div className="mt-24 relative">
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-mandala-pattern opacity-5"></div>
          <div className="relative">
            {/* Section Title */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display mb-4 relative inline-block">
                <span className="relative">
                  Essential Elements
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[url('/patterns/mandala-small.png')] opacity-10"></div>
                </span>
                <span className="bg-gradient-to-r from-brand-red to-brand-teal bg-clip-text text-transparent">
                  {" "}
                  of Wellness
                </span>
              </h2>
              <p className="text-xl text-brand-sage-dark font-decorative mt-2">
                आरोग्य के मूल तत्व
              </p>
            </div>

            {/* Elements Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-6xl mx-auto px-4">
              {[
                {
                  name: "Snehana",
                  icon: "💧",
                  sanskrit: "स्नेहन",
                  desc: "Oil Therapy",
                },
                {
                  name: "Swedana",
                  icon: "💨",
                  sanskrit: "स्वेदन",
                  desc: "Steam Therapy",
                },
                {
                  name: "Basti",
                  icon: "🌏",
                  sanskrit: "बस्ति",
                  desc: "Enema Therapy",
                },
                { name: "Vamana", icon: "🌊", sanskrit: "वमन", desc: "Emesis" },
                {
                  name: "Virechana",
                  icon: "🌸",
                  sanskrit: "विरेचन",
                  desc: "Purgation",
                },
                {
                  name: "Nasya",
                  icon: "👃",
                  sanskrit: "नस्य",
                  desc: "Nasal Therapy",
                },
              ].map((element, index) => (
                <div
                  key={index}
                  className="group relative transform hover:-translate-y-2 transition-all duration-500"
                >
                  {/* Card with hover effects */}
                  <div className="relative bg-white rounded-2xl p-6 shadow-elevation-1 hover:shadow-elevation-3 transition-all duration-500 overflow-hidden">
                    {/* Icon Container */}
                    <div className="relative mb-4">
                      {/* Animated Background Circle */}
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow via-brand-red to-brand-teal rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-pulse"></div>

                      {/* Icon Circle */}
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-brand-sage-light/50 to-white flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
                        <span className="text-3xl relative z-10">
                          {element.icon}
                        </span>
                        {/* Hover Effect Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/20 via-brand-red/20 to-brand-teal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="text-center space-y-1">
                      <h3 className="font-medium text-lg text-brand-sage-dark group-hover:text-brand-red transition-colors duration-300">
                        {element.name}
                      </h3>
                      <p className="text-xl font-decorative text-brand-teal">
                        {element.sanskrit}
                      </p>
                      <p className="text-sm text-brand-sage">{element.desc}</p>
                    </div>

                    {/* Bottom Border Animation */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-brand-yellow via-brand-red to-brand-teal transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The Path to Purification */}
        <div className="mt-32 mb-20 relative">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-ayurveda-chandana/8"></div>
            <div className="absolute inset-0 bg-[url('/patterns/lotus-bg.png')] opacity-5"></div>
          </div>

          {/* Content Container */}
          <div className="relative">
            {/* Section Title */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display mb-4 relative inline-block">
                <span className="relative">
                  The Path to
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[url('/patterns/mandala-small.png')] opacity-10"></div>
                </span>
                <span className="bg-gradient-to-r from-brand-red to-brand-teal bg-clip-text text-transparent">
                  {" "}
                  Purification
                </span>
              </h2>
              <p className="text-xl text-brand-sage-dark font-decorative mt-2">
                शुद्धि का मार्ग
              </p>
              <p className="mt-4 text-lg text-brand-sage max-w-3xl mx-auto">
                Experience the transformative journey of Panchakarma through
                three essential phases, each designed to restore your body's
                natural balance and vitality.
              </p>
            </div>

            {/* Steps Timeline */}
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-stretch gap-8 relative">
                {/* Connecting Line */}
                <div className="hidden md:block absolute w-full h-1 top-28 left-0">
                  <div className="h-full bg-gradient-to-r from-brand-yellow via-brand-red to-brand-teal"></div>
                </div>

                {/* Steps */}
                {[
                  {
                    number: "1",
                    title: "Preparation",
                    sanskrit: "पूर्वकर्म",
                    desc: "Poorvakarma",
                    icon: "🌿",
                    color: "from-brand-yellow to-brand-red",
                    benefits: [
                      "Personalized diet planning",
                      "Lifestyle adjustments",
                      "Mental preparation",
                    ],
                    features: [
                      "Customized regimen",
                      "Daily routine setup",
                      "Preliminary therapies",
                    ],
                  },
                  {
                    number: "2",
                    title: "Main Therapies",
                    sanskrit: "प्रधानकर्म",
                    desc: "Pradhanakarma",
                    icon: "✨",
                    color: "from-brand-red to-brand-teal",
                    benefits: [
                      "Deep cleansing",
                      "Toxin elimination",
                      "Energy balancing",
                    ],
                    features: [
                      "Core treatments",
                      "Therapeutic procedures",
                      "Healing sessions",
                    ],
                  },
                  {
                    number: "3",
                    title: "Rejuvenation",
                    sanskrit: "पश्चात्कर्म",
                    desc: "Paschatkarma",
                    icon: "🌸",
                    color: "from-brand-teal to-brand-sage-dark",
                    benefits: [
                      "Restored vitality",
                      "Enhanced immunity",
                      "Sustained wellness",
                    ],
                    features: [
                      "Recovery support",
                      "Wellness maintenance",
                      "Follow-up care",
                    ],
                  },
                ].map((step, index) => (
                  <div key={index} className="flex-1 relative z-10 group">
                    {/* Step Card */}
                    <div className="h-full bg-white rounded-2xl p-8 shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                      {/* Top Section */}
                      <div className="relative mb-6">
                        {/* Icon Circle */}
                        <div className="relative">
                          <div
                            className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-4xl relative overflow-hidden group-hover:scale-110 transition-transform duration-500`}
                          >
                            {step.icon}
                            {/* Hover Animation */}
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                          </div>
                          {/* Number Badge */}
                          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white text-brand-teal text-lg font-bold flex items-center justify-center shadow-xl border-2 border-brand-teal">
                            {step.number}
                          </div>
                        </div>

                        {/* Title Section */}
                        <div className="text-center mt-4 space-y-2">
                          <h3 className="text-2xl font-medium text-brand-sage-dark group-hover:text-brand-teal transition-colors duration-300">
                            {step.title}
                          </h3>
                          <p className="text-xl font-decorative text-brand-red">
                            {step.sanskrit}
                          </p>
                          <p className="text-sm text-brand-sage">
                            ({step.desc})
                          </p>
                        </div>
                      </div>

                      {/* Content Sections */}
                      <div className="space-y-6">
                        {/* Benefits */}
                        <div className="space-y-2">
                          <h4 className="text-lg font-medium text-brand-teal mb-3">
                            Benefits
                          </h4>
                          {step.benefits.map((benefit, i) => (
                            <div
                              key={i}
                              className="flex items-center space-x-2 text-brand-sage-dark group-hover:transform group-hover:translate-x-2 transition-transform duration-300"
                              style={{ transitionDelay: `${i * 100}ms` }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-red"></div>
                              <p className="text-sm">{benefit}</p>
                            </div>
                          ))}
                        </div>

                        {/* Features */}
                        <div className="space-y-2">
                          <h4 className="text-lg font-medium text-brand-teal mb-3">
                            Features
                          </h4>
                          {step.features.map((feature, i) => (
                            <div
                              key={i}
                              className="flex items-center space-x-2 text-brand-sage-dark group-hover:transform group-hover:translate-x-2 transition-transform duration-300"
                              style={{ transitionDelay: `${(i + 3) * 100}ms` }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></div>
                              <p className="text-sm">{feature}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Border Animation */}
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-brand-yellow via-brand-red to-brand-teal transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Herbs Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-16 h-16 bg-brand-teal/10 rounded-full animate-float-slow"></div>
          <div className="absolute top-20 right-20 w-20 h-20 bg-brand-yellow/10 rounded-full animate-float-medium"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-brand-red/10 rounded-full animate-float-fast"></div>
        </div>
      </section>

      {/* Ayurvedic Wisdom Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/mandala-pattern.png')] opacity-5"></div>
        <div className="absolute inset-0 bg-ayurveda-haldi/8"></div>

        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative mb-16">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-display mb-4 relative inline-block">
              <span className="relative">
                Understanding
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[url('/patterns/mandala-small.png')] opacity-10"></div>
              </span>
              <span className="bg-gradient-to-r from-brand-red to-brand-teal bg-clip-text text-transparent">
                {" "}
                Ayurvedic Wisdom
              </span>
            </h2>
            <p className="text-xl text-brand-sage-dark font-decorative mt-2">
              आयुर्वेद ज्ञान
            </p>
          </div>
        </div>

        {/* Interactive Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tridosha Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-display text-brand-sage-dark mb-4">
                Ayurvedic Tridosha
              </h3>
              <p className="text-lg text-brand-sage max-w-3xl mx-auto">
                Understanding the imbalance of your unique body is the basis for
                treatment.
              </p>
            </div>

            {/* Dosha Icons */}
            <div className="flex justify-center gap-8 mb-12">
              {[
                { name: "Vata", icon: "🌪️", element: "Air & Ether" },
                { name: "Pitta", icon: "🔥", element: "Fire & Water" },
                { name: "Kapha", icon: "🌊", element: "Earth & Water" },
              ].map((dosha) => (
                <div
                  key={dosha.name}
                  className="text-center group cursor-pointer flex flex-col items-center min-w-[120px]"
                  onClick={() => handleDoshaSelect(dosha.name)}
                >
                  <div
                    className={`w-24 h-24 rounded-full bg-gradient-to-br from-brand-sage-light to-white flex items-center justify-center text-4xl mb-4 transform group-hover:scale-110 transition-all duration-300 shadow-elevation-2 group-hover:shadow-elevation-3 ${
                      activeDosha === dosha.name
                        ? "ring-2 ring-brand-teal ring-offset-2"
                        : ""
                    }`}
                  >
                    {dosha.icon}
                  </div>
                  <div className="space-y-1">
                    <h4
                      className={`text-xl font-medium group-hover:text-brand-teal transition-colors leading-tight ${
                        activeDosha === dosha.name
                          ? "text-brand-teal"
                          : "text-brand-sage-dark"
                      }`}
                    >
                      {dosha.name}
                    </h4>
                    <p className="text-sm text-brand-sage leading-tight">
                      {dosha.element}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dosha Content Area */}
            <div
              id="dosha-details"
              className="bg-white rounded-2xl p-8 shadow-elevation-2"
            >
              <div className="flex justify-center mb-8">
                {["Vata", "Pitta", "Kapha"].map((dosha, index) => (
                  <button
                    key={dosha}
                    onClick={() => setActiveDosha(dosha)}
                    className={`px-6 py-3 text-lg font-medium transition-all duration-300 relative
                      ${
                        activeDosha === dosha
                          ? "text-brand-teal"
                          : "text-brand-sage hover:text-brand-sage-dark"
                      }`}
                  >
                    {dosha}
                    {activeDosha === dosha && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-brand-yellow via-brand-red to-brand-teal"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Vata Content */}
              {activeDosha === "Vata" && (
                <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-medium text-brand-red mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-brand-red/10 flex items-center justify-center mr-2">
                          ⚠️
                        </span>
                        Out of Balance
                      </h4>
                      <ul className="space-y-2">
                        {[
                          "hypertension",
                          "constipation",
                          "weight loss",
                          "weakness",
                          "arthritis",
                          "prone to worry",
                          "insomnia",
                          "digestive challenges",
                        ].map((item, i) => (
                          <li
                            key={i}
                            className="flex items-center space-x-2 text-brand-sage-dark"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-red"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-medium text-brand-teal mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-brand-teal/10 flex items-center justify-center mr-2">
                          ✨
                        </span>
                        In Balance
                      </h4>
                      <ul className="space-y-2">
                        {[
                          "excellent agility",
                          "dry skin and hair",
                          "thin frame",
                          "creative",
                          "energetic",
                          "flexible",
                          "love excitement and new experiences",
                        ].map((item, i) => (
                          <li
                            key={i}
                            className="flex items-center space-x-2 text-brand-sage-dark"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-teal"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Pitta Content */}
              {activeDosha === "Pitta" && (
                <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-medium text-brand-red mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-brand-red/10 flex items-center justify-center mr-2">
                          ⚠️
                        </span>
                        Out of Balance
                      </h4>
                      <ul className="space-y-2">
                        {[
                          "hypertension",
                          "constipation",
                          "weight loss",
                          "weakness",
                          "arthritis",
                          "prone to worry",
                          "insomnia",
                          "digestive challenges",
                        ].map((item, i) => (
                          <li
                            key={i}
                            className="flex items-center space-x-2 text-brand-sage-dark"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-red"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-medium text-brand-teal mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-brand-teal/10 flex items-center justify-center mr-2">
                          ✨
                        </span>
                        In Balance
                      </h4>
                      <ul className="space-y-2">
                        {[
                          "excellent agility",
                          "dry skin and hair",
                          "thin frame",
                          "creative",
                          "energetic",
                          "flexible",
                          "love excitement and new experiences",
                        ].map((item, i) => (
                          <li
                            key={i}
                            className="flex items-center space-x-2 text-brand-sage-dark"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-teal"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Kapha Content */}
              {activeDosha === "Kapha" && (
                <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-medium text-brand-red mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-brand-red/10 flex items-center justify-center mr-2">
                          ⚠️
                        </span>
                        Out of Balance
                      </h4>
                      <ul className="space-y-2">
                        {[
                          "sleep excessively",
                          "overweight",
                          "suffer from asthma",
                          "depression",
                          "diabetes",
                          "resistance to change",
                          "stubbornness",
                        ].map((item, i) => (
                          <li
                            key={i}
                            className="flex items-center space-x-2 text-brand-sage-dark"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-red"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-medium text-brand-teal mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-brand-teal/10 flex items-center justify-center mr-2">
                          ✨
                        </span>
                        In Balance
                      </h4>
                      <ul className="space-y-2">
                        {[
                          "excellent stamina",
                          "large and soft eyes",
                          "strong build",
                          "thick hair",
                          "smooth skin",
                          "loyal",
                          "patient",
                          "steady",
                          "supportive",
                        ].map((item, i) => (
                          <li
                            key={i}
                            className="flex items-center space-x-2 text-brand-sage-dark"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-teal"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Panchakarma Treatments Section */}
          <div>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-display text-brand-sage-dark mb-4">
                Panchakarma Treatments
              </h3>
              <p className="text-lg text-brand-sage max-w-3xl mx-auto">
                Five primary treatments for deep cleansing and rejuvenation.
              </p>
            </div>

            {/* Treatment Icons */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {[
                { name: "Vamana", icon: "🌿", desc: "Therapeutic Emesis" },
                { name: "Virechana", icon: "🍃", desc: "Purgation Therapy" },
                { name: "Basti", icon: "💫", desc: "Medicated Enema" },
                { name: "Nasya", icon: "👃", desc: "Nasal Treatment" },
                {
                  name: "Rakta Moksha",
                  icon: "💉",
                  desc: "Blood Purification",
                },
              ].map((treatment) => (
                <div
                  key={treatment.name}
                  className="text-center group cursor-pointer flex flex-col items-center min-w-[140px]"
                  onClick={() => handleTreatmentSelect(treatment.name)}
                >
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-br from-brand-sage-light to-white flex items-center justify-center text-3xl mb-3 transform group-hover:scale-110 transition-all duration-300 shadow-elevation-1 group-hover:shadow-elevation-2 ${
                      activeTreatment === treatment.name
                        ? "ring-2 ring-brand-teal ring-offset-2"
                        : ""
                    }`}
                  >
                    {treatment.icon}
                  </div>
                  <div className="space-y-1">
                    <h4
                      className={`text-lg font-medium group-hover:text-brand-teal transition-colors leading-tight ${
                        activeTreatment === treatment.name
                          ? "text-brand-teal"
                          : "text-brand-sage-dark"
                      }`}
                    >
                      {treatment.name}
                    </h4>
                    <p className="text-sm text-brand-sage leading-tight">
                      {treatment.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Treatment Details */}
            <div
              id="treatment-details"
              className="bg-white rounded-2xl p-8 shadow-elevation-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 p-6 bg-brand-sage-light/5 rounded-xl mb-6">
                  <h3 className="text-3xl font-display text-brand-sage-dark">
                    Treatment Details
                  </h3>
                  <p className="text-gray-500">
                    Select a treatment to learn more about its benefits and
                    procedures.
                  </p>

                  {/* Treatment List */}
                  <div className="space-y-4 mt-6">
                    {[
                      {
                        name: "Vamana",
                        sanskrit: "वमन",
                        desc: "Therapeutic Emesis",
                        icon: "/treatments/vamana.svg",
                        details: `When there is congestion in the lungs causing repeated attacks of bronchitis, colds, cough, or asthma, the Ayurvedic treatment is therapeutic vomiting, vamana, to eliminate the kapha causing the excess mucus.

Oftentimes this also releases repressed emotions that have been held in the kapha areas of the lungs and stomach along with the accumulated dosha. Once the mucus is released, the patient will feel instantly relieved.`,
                        benefits: [
                          "Relief from chronic asthma",
                          "Treats diabetes and chronic cold",
                          "Helps with lymphatic congestion",
                          "Improves chronic indigestion",
                          "Reduces edema",
                        ],
                        results: [
                          "Relaxation in lungs",
                          "Free breathing",
                          "Lightness in chest",
                          "Clear thinking",
                          "Clear voice",
                          "Good appetite",
                        ],
                      },
                      {
                        name: "Virechana",
                        sanskrit: "विरेचन",
                        desc: "Purgation Therapy",
                        icon: "/treatments/virechana.svg",
                        details: `When excess bile, pitta, is secreted and accumulated in the gallbladder, liver, and small intestine, it tends to result in rashes, skin inflammation, acne, chronic attacks of fever, biliary vomiting, nausea, and jaundice. 

Purgatives help relieve the excess pitta causing the bile disturbance in the body. In fact, purgatives can completely cure the problem of excess pitta.`,
                        benefits: [
                          "Treats skin inflammation",
                          "Helps with chronic fever",
                          "Reduces biliary issues",
                          "Balances pitta dosha",
                          "Improves liver function",
                        ],
                      },
                      {
                        name: "Basti",
                        sanskrit: "बस्ति",
                        desc: "Enema Therapy",
                        icon: "/treatments/basti.svg",
                        details: `Vata is a very active principle in pathogenesis. If we can control vata through the use of basti, we have gone a long way in going to the root cause of the vast majority of diseases. 

The medication administered rectally affects asthi dhatu (bone tissue). The mucus membrane of the colon is related to the outer covering of the bones, which nourishes them.`,
                        benefits: [
                          "Controls vata disorders",
                          "Affects bone tissue health",
                          "Balances elimination processes",
                          "Helps with deep tissue healing",
                          "Manages various vata conditions",
                        ],
                      },
                      {
                        name: "Nasya",
                        sanskrit: "नस्य",
                        desc: "Nasal Administration",
                        icon: "/treatments/nasya.svg",
                        details: `The nose is the doorway to the brain and consciousness. An excess of bodily humors accumulated in the sinus, throat, nose, or head areas is eliminated through the nose. 

Prana enters the body through breath taken in through the nose and maintains sensory and motor functions. It also governs mental activities, memory, and concentration.`,
                        benefits: [
                          "Treats prana disorders",
                          "Relieves sinus congestion",
                          "Helps with migraine headaches",
                          "Improves sensory perception",
                          "Enhances memory and concentration",
                        ],
                        procedure: [
                          "Nasal massage with ghee",
                          "Clockwise and counter-clockwise movements",
                          "Regular morning and evening practice",
                          "Gentle and careful application",
                        ],
                      },
                      {
                        name: "Rakta Moksha",
                        sanskrit: "रक्त मोक्ष",
                        desc: "Blood Purification",
                        icon: "/treatments/raktamoksha.svg",
                        details: `Toxins present in the gastrointestinal tract are absorbed into the blood and circulated throughout the body. This condition, called toxemia, is the basic cause of repeated infections and certain circulatory conditions.

This treatment is particularly effective for skin disorders, enlarged liver, spleen, and gout. Pitta and blood have a very close relationship.`,
                        benefits: [
                          "Purifies blood",
                          "Treats skin disorders",
                          "Helps with liver enlargement",
                          "Manages gout",
                          "Stimulates immune system",
                        ],
                        restrictions: [
                          "Sugar",
                          "Salt",
                          "Yogurt",
                          "Sour-tasting foods",
                          "Alcohol",
                          "Fermented foods",
                        ],
                      },
                    ].map((treatment) => (
                      <button
                        key={treatment.name}
                        onClick={() => setActiveTreatment(treatment.name)}
                        className={`w-full text-left p-6 transition-all duration-300 mb-2 relative group ${
                          activeTreatment === treatment.name
                            ? "bg-white shadow-md rounded-xl"
                            : "hover:bg-white hover:shadow-sm hover:rounded-xl"
                        }`}
                      >
                        {/* Highlight bar */}
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all duration-300 ${
                            activeTreatment === treatment.name
                              ? "bg-brand-teal h-full"
                              : "bg-transparent group-hover:bg-brand-sage-light h-4/5 group-hover:h-full my-auto"
                          }`}
                        ></div>

                        <div className="flex items-center space-x-6">
                          {/* Treatment Icon */}
                          <div
                            className={`w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                              activeTreatment === treatment.name
                                ? "bg-brand-teal shadow-lg"
                                : "bg-brand-sage-light/20 group-hover:bg-brand-teal/10"
                            }`}
                          >
                            <img
                              src={treatment.icon}
                              alt={treatment.name}
                              className={`w-full h-full object-contain p-3 transition-transform duration-300 ${
                                activeTreatment === treatment.name
                                  ? "scale-110"
                                  : "group-hover:scale-110"
                              }`}
                            />
                          </div>

                          {/* Treatment Info */}
                          <div className="flex-1">
                            <h4
                              className={`text-xl font-medium transition-colors duration-300 ${
                                activeTreatment === treatment.name
                                  ? "text-brand-teal"
                                  : "text-brand-sage-dark group-hover:text-brand-teal"
                              }`}
                            >
                              {treatment.name}
                            </h4>
                            <p className="text-sm text-brand-sage mt-1">
                              {treatment.desc}
                            </p>
                          </div>

                          {/* Sanskrit Name */}
                          <div
                            className={`text-xl font-decorative transition-colors duration-300 self-center ${
                              activeTreatment === treatment.name
                                ? "text-brand-teal"
                                : "text-brand-sage group-hover:text-brand-teal"
                            }`}
                          >
                            {treatment.sanskrit}
                          </div>
                        </div>

                        {/* Bottom border that shows on hover */}
                        <div
                          className={`absolute bottom-0 left-1 right-1 h-px transition-all duration-300 ${
                            activeTreatment === treatment.name
                              ? "bg-transparent"
                              : "bg-gray-100 group-hover:bg-transparent"
                          }`}
                        ></div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Treatment Information Display */}
                <div className="bg-white rounded-xl p-6 space-y-6 shadow-sm">
                  {activeTreatment ? (
                    treatments.find((t) => t.name === activeTreatment) && (
                      <div className="animate-fade-in">
                        <h3 className="text-2xl font-display text-brand-sage-dark mb-4">
                          {
                            treatments.find((t) => t.name === activeTreatment)
                              .sanskrit
                          }
                          <span className="block text-lg text-brand-teal">
                            {
                              treatments.find((t) => t.name === activeTreatment)
                                .name
                            }
                          </span>
                        </h3>

                        {/* Treatment Image */}
                        <div className="mb-6 overflow-hidden rounded-lg shadow-lg">
                          <img
                            src={
                              treatments.find((t) => t.name === activeTreatment)
                                .image
                            }
                            alt={
                              treatments.find((t) => t.name === activeTreatment)
                                .name
                            }
                            className="w-full h-56 object-cover transform hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        <div className="prose prose-sage max-w-none">
                          <p className="text-brand-sage-dark leading-relaxed">
                            {
                              treatments.find((t) => t.name === activeTreatment)
                                .details
                            }
                          </p>

                          {/* Benefits */}
                          <div className="mt-6">
                            <h4 className="text-lg font-medium text-brand-teal mb-3">
                              Benefits
                            </h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {treatments
                                .find((t) => t.name === activeTreatment)
                                .benefits.map((benefit, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center space-x-2 text-brand-sage-dark"
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-teal"></div>
                                    <span className="text-sm">{benefit}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>

                          {/* Procedure or Results or Restrictions based on treatment */}
                          {treatments.find((t) => t.name === activeTreatment)
                            .procedure && (
                            <div className="mt-6">
                              <h4 className="text-lg font-medium text-brand-teal mb-3">
                                Procedure
                              </h4>
                              <ul className="space-y-2">
                                {treatments
                                  .find((t) => t.name === activeTreatment)
                                  .procedure.map((step, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center space-x-2 text-brand-sage-dark"
                                    >
                                      <div className="w-5 h-5 rounded-full bg-brand-teal/10 flex items-center justify-center text-sm text-brand-teal">
                                        {index + 1}
                                      </div>
                                      <span className="text-sm">{step}</span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}

                          {treatments.find((t) => t.name === activeTreatment)
                            .results && (
                            <div className="mt-6">
                              <h4 className="text-lg font-medium text-brand-teal mb-3">
                                Expected Results
                              </h4>
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {treatments
                                  .find((t) => t.name === activeTreatment)
                                  .results.map((result, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center space-x-2 text-brand-sage-dark"
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></div>
                                      <span className="text-sm">{result}</span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}

                          {treatments.find((t) => t.name === activeTreatment)
                            .restrictions && (
                            <div className="mt-6">
                              <h4 className="text-lg font-medium text-brand-red mb-3">
                                Dietary Restrictions
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {treatments
                                  .find((t) => t.name === activeTreatment)
                                  .restrictions.map((restriction, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-sm"
                                    >
                                      {restriction}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="text-center text-brand-sage py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-sage-light/20 flex items-center justify-center">
                        <span className="text-2xl">🌿</span>
                      </div>
                      <p>Select a treatment to view details</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-ayurveda-chandana/8"></div>
          <div className="absolute inset-0 bg-[url('/patterns/lotus-bg.png')] opacity-5"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            {/* Sanskrit Title */}
            <div className="mb-4">
              <p className="text-xl text-brand-red font-decorative">
                आयुर्वेद के मूल तत्व
              </p>
              <p className="text-sm text-gray-500">Foundations of Ayurveda</p>
            </div>

            <h2 className="text-5xl md:text-6xl font-display text-brand-sage-dark mb-6 relative">
              <span className="relative inline-block">
                Essential Elements of
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[url('/patterns/mandala-small.png')] opacity-10"></div>
              </span>
              <span className="bg-gradient-to-r from-brand-red to-brand-teal bg-clip-text text-transparent">
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
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-brand-red"></div>
              <div className="mx-4">
                <div className="w-8 h-8 bg-om-symbol opacity-50"></div>
              </div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-brand-red"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group relative">
                  {/* Card Background with Border Animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-yellow/30 via-brand-red/30 to-brand-teal/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-brand-sage-light/10 h-full flex flex-col overflow-hidden">
                    {/* Feature Icon */}
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-lotus flex items-center justify-center mb-4 group-hover:scale-105 transition-transform relative`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lotus"></div>
                    </div>

                    {/* Feature Content */}
                    <div className="space-y-2">
                      <h3 className="font-display text-xl text-brand-sage-dark group-hover:text-brand-red transition-colors">
                        {feature.title}
                      </h3>
                      <h4 className="text-base font-medium text-brand-red">
                        {feature.subtitle}
                      </h4>
                      <p className="text-gray-600 leading-relaxed font-body text-sm">
                        {feature.description}
                      </p>
                    </div>

                    {/* Hover Decoration */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-brand-yellow via-brand-red to-brand-teal transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
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
          <div className="absolute inset-0 bg-ayurveda-kumkum/8"></div>
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
                  <p className="text-xl text-brand-red font-decorative">
                    आरोग्य पथ
                  </p>
                  <p className="text-sm text-gray-500">Path to Wellness</p>
                </div>

                <h2 className="text-4xl md:text-5xl font-decorative text-brand-sage-dark mb-6">
                  The Path to
                  <span className="bg-gradient-to-r from-brand-red to-brand-yellow bg-clip-text text-transparent animate-shimmer">
                    {" "}
                    Wellness
                  </span>
                </h2>

                <div className="relative mb-8">
                  <p className="text-xl text-gray-600 font-body relative z-10">
                    <span className="block mb-4 group">
                      <span className="inline-block text-2xl font-decorative text-brand-red">
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
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-yellow/5 rounded-full blur-2xl"></div>
                </div>

                {/* Benefits List */}
                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="group flex items-start space-x-4 p-3 rounded-lg hover:bg-white/50 transition-colors duration-300"
                    >
                      <div className="relative">
                        <CheckCircle className="h-6 w-6 text-brand-red group-hover:text-brand-yellow transition-colors duration-300" />
                        <div className="absolute inset-0 bg-brand-red/20 blur-lg group-hover:bg-brand-yellow/20 transition-colors duration-300 opacity-0 group-hover:opacity-100"></div>
                      </div>
                      <div>
                        <span className="text-gray-700 text-lg group-hover:text-brand-sage-dark transition-colors duration-300">
                          {benefit}
                        </span>
                        {/* Subtle line decoration */}
                        <div className="h-px w-0 group-hover:w-full bg-gradient-to-r from-brand-red to-transparent transition-all duration-500"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={onGetStarted}
                className="mt-8 bg-gradient-to-r from-brand-teal to-brand-yellow text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-brand-teal-dark hover:to-brand-yellow-dark transform hover:scale-105 transition-all duration-200 shadow-xl"
              >
                Sign Up
              </button>
            </div>

            {/* Mock Dashboard Preview */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gradient-to-r from-brand-sage-light/50 to-brand-teal/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-brand-sage-dark">
                      Wellness Progress
                    </div>
                    <div className="text-2xl font-bold text-brand-teal">
                      85%
                    </div>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-brand-teal to-brand-yellow h-3 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-brand-sage-light/10 rounded-lg p-3">
                    <div className="text-xs text-brand-sage mb-1">
                      Next Session
                    </div>
                    <div className="font-medium text-brand-sage-dark">
                      Abhyanga
                    </div>
                    <div className="text-xs text-brand-sage">
                      Sep 8, 10:00 AM
                    </div>
                  </div>
                  <div className="bg-brand-sage-light/10 rounded-lg p-3">
                    <div className="text-xs text-brand-sage mb-1">
                      Wellness Score
                    </div>
                    <div className="font-medium text-brand-sage-dark">
                      8.5/10
                    </div>
                    <div className="text-xs text-brand-teal">
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
          <div className="absolute inset-0 bg-ayurveda-haldi/10"></div>
          <div className="absolute inset-0 bg-[url('/patterns/herbs-bg.png')] opacity-5"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            {/* Sanskrit Title with Decorative Elements */}
            <div className="inline-block relative">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-mandala-pattern opacity-10"></div>
              <h2 className="text-4xl md:text-5xl font-decorative text-brand-sage-dark mb-4">
                <span className="relative">
                  प्रशंसा
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent"></span>
                </span>
                <span className="bg-gradient-to-r from-brand-red to-brand-yellow bg-clip-text text-transparent animate-shimmer">
                  {" "}
                  Testimonials
                </span>
              </h2>
            </div>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body relative">
              <span className="block mb-2 text-brand-red font-decorative">
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
                <div className="absolute inset-0 bg-gradient-to-r from-brand-yellow via-brand-red to-brand-teal rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

                <div className="relative bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-brand-sage-light/10 flex flex-col h-full overflow-hidden">
                  {/* Rating Stars with Animation */}
                  <div className="flex items-center mb-4 space-x-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-brand-yellow fill-current transform group-hover:scale-110 transition-transform duration-300"
                        style={{ transitionDelay: `${i * 50}ms` }}
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <div className="relative mb-6 flex-grow">
                    <div className="absolute -top-2 -left-2 text-4xl text-brand-red/20 font-decorative">
                      "
                    </div>
                    <p className="text-gray-700 font-body text-base leading-relaxed relative z-10 pl-4">
                      {testimonial.text}
                    </p>
                    <div className="absolute -bottom-2 -right-2 text-4xl text-brand-red/20 font-decorative">
                      "
                    </div>
                  </div>

                  {/* Author Info with Hover Effects */}
                  <div className="flex items-center mt-auto pt-4 border-t border-brand-sage-light/10">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-r from-brand-sage-dark to-brand-teal rounded-lotus flex items-center justify-center text-white text-base font-medium transform group-hover:rotate-12 transition-transform duration-300">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lotus"></div>
                    </div>

                    <div className="ml-4 min-w-0 flex-1">
                      <div className="font-display text-lg text-brand-sage-dark truncate group-hover:text-brand-red transition-colors duration-300">
                        {testimonial.name}
                      </div>
                      <div className="text-base font-medium text-brand-red truncate">
                        {testimonial.role}
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {testimonial.specialty}
                      </div>
                    </div>
                  </div>

                  {/* Decorative Bottom Border */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-brand-yellow via-brand-red to-brand-teal transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-sage-dark to-brand-teal relative overflow-hidden">
        <div className="absolute inset-0 bg-mandala-pattern opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-decorative text-white mb-6">
            आरम्भ करें
            <span className="block text-brand-yellow">
              Begin Your Healing Journey
            </span>
          </h2>
          <p className="text-xl text-brand-sage-light mb-8 max-w-2xl mx-auto font-body">
            Join our growing संघ (community) of practitioners and seekers on the
            path to holistic wellness through the ancient wisdom of Panchakarma.
          </p>
          <div className="flex justify-center">
            <button
              onClick={onGetStarted}
              className="bg-white/90 backdrop-blur-sm text-brand-sage-dark px-8 py-4 rounded-lotus font-display text-lg hover:bg-white transform hover:scale-105 transition-all duration-200 shadow-xl border border-white/20"
            >
              साइन अप करें
              <span className="block text-sm">Sign Up</span>
            </button>
          </div>
          <div className="mt-8 text-brand-sage-light">
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
      <footer className="bg-gradient-to-b from-brand-sage-dark to-gray-900 text-gray-300 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-lotus-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-brand-red to-brand-yellow p-2 rounded-lotus">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-display text-white">
                    आयुरसूत्र
                  </span>
                  <span className="block text-sm text-brand-sage-light">
                    AyurSutra
                  </span>
                </div>
              </div>
              <p className="text-brand-sage-light mb-4 font-body">
                "आरोग्यं परमं भाग्यं" <br />
                <span className="text-sm text-gray-400">
                  Health is the greatest blessing
                </span>
              </p>
            </div>

            <div>
              <h3 className="text-white font-display mb-4">सेवाएं</h3>
              <h4 className="text-sm text-brand-sage-light mb-2">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Panchakarma Tracking
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Dosha Analysis
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Treatment Protocols
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Wellness Calendar
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-display mb-4">सहायता</h3>
              <h4 className="text-sm text-brand-sage-light mb-2">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Knowledge Base
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Vaidya Connect
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Training Videos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Community Forum
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-display mb-4">संपर्क</h3>
              <h4 className="text-sm text-brand-sage-light mb-2">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    About Our Mission
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Ayurvedic Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Join Our Team
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Privacy Promise
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-brand-sage-light/20 mt-8 pt-8 text-center">
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <span className="text-brand-sage-light text-sm px-3 py-1 border border-brand-sage-light/20 rounded-lotus">
                HIPAA Compliant
              </span>
              <span className="text-brand-sage-light text-sm px-3 py-1 border border-brand-sage-light/20 rounded-lotus">
                ISO 27001 Certified
              </span>
              <span className="text-brand-sage-light text-sm px-3 py-1 border border-brand-sage-light/20 rounded-lotus">
                NABH Standards
              </span>
            </div>
            <p className="text-sm text-gray-400">
              &copy; 2025 आयुरसूत्र | AyurSutra. सर्वाधिकार सुरक्षित | All
              rights reserved. <br />
              <span className="text-brand-sage-light">
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
