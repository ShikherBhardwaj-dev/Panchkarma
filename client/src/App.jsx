import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import PatientDashboard from "./components/Dashboard/PatientDashboard";
import PractitionerDashboard from "./components/Dashboard/PractitionerDashboard";
import TherapyScheduling from "./components/TherapyScheduling";
import Notifications from "./components/Notifications";
import WhatsAppTester from './components/Admin/WhatsAppTester';
import Progress from "./components/Progress";
import Footer from "./components/Footer";
import AuthContainer from "./components/auth/AuthContainer";
import LandingPage from "./components/LandingPage";
import PractitionerHomePage from "./components/PractitionerHomePage";
import { useAppData } from "./hooks/useAppData";
import ChatbotWidget from "./components/Dashboard/ChatbotWidget"; // ✅ import chatbot
import { ToastProvider } from "./contexts/ToastContext.jsx";
import ToastContainer from "./components/Toast";
import ErrorBoundary from './components/ErrorBoundary';

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
    console.log('App: user authenticated', userData);
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
          return <PractitionerDashboard user={user} />;
        }
        return (
          <PatientDashboard
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
            user={user}
          />
        );

      case 'admin-whatsapp':
        return <WhatsAppTester user={user} />;

      default:
        if (userRole === "practitioner") {
          return <PractitionerDashboard user={user} />;
        }
        return (
          <PatientDashboard
            patientProgress={patientProgress}
            notifications={notifications}
            user={user}
          />
        );
    }
  };

  // Wrap whole UI in ToastProvider so landing and auth pages can use useToast()
  // Poll inbox for unread messages and push into notifications
  const seenInboxIdsRef = useRef(new Set());
  useEffect(() => {
    if (!isAuthenticated || !user?._id || !setNotifications) return;

    let stopped = false;

    const fetchInbox = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/messages/inbox', {
          params: { userId: user._id, unreadOnly: true }
        });
        const msgs = res.data || [];
        // filter new
        const newMsgs = msgs.filter(m => !seenInboxIdsRef.current.has(m._id));
        if (newMsgs.length) {
          // push into notifications
          setNotifications((prev) => {
            const next = [...(prev || [])];
            newMsgs.forEach(m => {
              seenInboxIdsRef.current.add(m._id);
              next.unshift({
                id: m._id,
                type: 'chat',
                title: `Message from ${m.from?.name || m.from?.email}`,
                message: m.text,
                time: m.createdAt || new Date().toISOString(),
              });
            });
            return next;
          });
          console.log('App: inbox added', newMsgs.map(m=>m._id));
        }
      } catch (err) {
        console.error('App: inbox fetch error', err);
      }
    };

    // initial fetch and interval
    fetchInbox();
    const iv = setInterval(() => { if (!stopped) fetchInbox(); }, 4000);
    return () => { stopped = true; clearInterval(iv); };
  }, [isAuthenticated, user?._id, setNotifications]);
  return (
    <ToastProvider>
      {/* Render Landing, Auth or Main app depending on state */}
      {showLanding ? (
        <LandingPage onGetStarted={handleGetStarted} />
      ) : !isAuthenticated ? (
        <AuthContainer
          onAuthSuccess={handleAuthSuccess}
          onBackToLanding={() => setShowLanding(true)}
        />
      ) : (
  <ErrorBoundary>
  <div className="min-h-screen bg-[#FDF7E9]">
          <Header
            userRole={getUserRole()}
            notifications={notifications}
            setNotifications={setNotifications}
            setActiveTab={setActiveTab}
            user={user}
            onLogout={handleLogout}
          />

          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="w-full bg-[#FDF7E9]">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {renderActiveTab()}
            </main>
          </div>

          {/* ✅ Floating chatbot widget for logged-in users except practitioners */}
          {isAuthenticated && user?.userType !== "practitioner" && (
            <div className="fixed bottom-6 right-6 z-50">
              <ChatbotWidget user={user} />
            </div>
          )}

          <Footer />

  </div>
  </ErrorBoundary>
      )}

      {/* Toast container rendered once inside provider so toasts are visible on landing/auth */}
      <ToastContainer />
    </ToastProvider>
  );
};

export default App;
