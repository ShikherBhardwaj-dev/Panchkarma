import React, { useState } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import TherapyScheduling from "./components/TherapyScheduling";
import Notifications from "./components/Notifications";
import Progress from "./components/Progress";
import FloatingActionButton from "./components/FloatingActionButton";
import Footer from "./components/Footer";
import AuthContainer from "./components/auth/AuthContainer";
import LandingPage from "./components/LandingPage";
import PractitionerHomePage from "./components/PractitionerHomePage";
import { useAppData } from "./hooks/useAppData";
import ChatbotWidget from "./components/Dashboard/ChatbotWidget"; // ✅ import chatbot

const App = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [isMenuSticky, setIsMenuSticky] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showLanding, setShowLanding] = useState(true);

  const {
    notifications,
    setNotifications,
    therapySessions,
    patientProgress,
    feedbackData,
  } = useAppData();

  // ✅ Called after login/signup success
  const handleAuthSuccess = (userData) => {
    setUser({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      userType: userData.userType,
    });
    setIsAuthenticated(true);
    setShowLanding(false);
  };

  // ✅ Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setActiveTab("dashboard");
    setShowLanding(true);
  };

  // ✅ When "Get Started" is clicked on landing page
  const handleGetStarted = () => {
    setShowLanding(false);
  };

  // ✅ Utility: Get current role
  const getUserRole = () => {
    return user?.userType || "patient";
  };

  // ✅ Render tab contents
  const renderActiveTab = () => {
    const userRole = getUserRole();

    switch (activeTab) {
      case "dashboard":
        if (userRole === "practitioner") {
          return <PractitionerHomePage user={user} />;
        }
        return (
          <Dashboard
            userRole={userRole}
            patientProgress={patientProgress}
            notifications={notifications}
            user={user}
          />
        );

      case "scheduling":
        return (
          <TherapyScheduling
            userRole={userRole}
            user={user}
            therapySessions={therapySessions}
          />
        );

      case "notifications":
        return (
          <Notifications
            notifications={notifications}
            setNotifications={setNotifications}
            currentUserId={user?._id}
            currentUserEmail={user?.email}
            userType={user?.userType}
          />
        );

      case "progress":
        return (
          <Progress
            patientProgress={patientProgress}
            feedbackData={feedbackData}
          />
        );

      default:
        if (userRole === "practitioner") {
          return <PractitionerHomePage user={user} />;
        }
        return (
          <Dashboard
            userRole={userRole}
            patientProgress={patientProgress}
            notifications={notifications}
            user={user}
          />
        );
    }
  };

  // ✅ Show landing page first
  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // ✅ Show login/signup if not authenticated
  if (!isAuthenticated) {
    return (
      <AuthContainer
        onAuthSuccess={handleAuthSuccess}
        onBackToLanding={() => setShowLanding(true)}
      />
    );
  }

  // ✅ Main application after login/signup
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        userRole={getUserRole()}
        notifications={notifications}
        user={user}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <main>{renderActiveTab()}</main>
      </div>

      {/* ✅ Floating chatbot widget available everywhere */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatbotWidget />
      </div>

      <FloatingActionButton
        showQuickMenu={showQuickMenu}
        setShowQuickMenu={setShowQuickMenu}
        isMenuSticky={isMenuSticky}
        setIsMenuSticky={setIsMenuSticky}
      />

      <Footer />
    </div>
  );
};

export default App;
