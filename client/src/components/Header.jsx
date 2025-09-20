import React, { useState, useEffect } from "react";
import { Bell, User, Leaf, LogOut, Settings } from "lucide-react";

// Import background patterns
const mandalaCorner = "/patterns/corner-mandala.svg";
const omSymbol = "/patterns/om-symbol.svg";

const Header = ({ userRole, notifications = [], user, onLogout, setNotifications, setActiveTab }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBell, setShowBell] = useState(false);

  useEffect(() => {
    console.log('Header: notifications prop length', notifications?.length);
  }, [notifications]);

  // Debug log when state changes
  useEffect(() => {
    console.log("Menu state changed:", showUserMenu);
  }, [showUserMenu]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById("user-dropdown");
      const button = document.getElementById("user-menu-button");
      if (
        dropdown &&
        button &&
        !dropdown.contains(event.target) &&
        !button.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    const handleClickOutsideBell = (e) => {
      const bellDropdown = document.getElementById('bell-dropdown');
      const bellButton = document.getElementById('bell-button');
      if (bellDropdown && bellButton && !bellDropdown.contains(e.target) && !bellButton.contains(e.target)) {
        setShowBell(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideBell);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutsideBell);
    };
  }, [showUserMenu]);

  const getUserDisplayName = () => {
    const name = user?.fullName || user?.name;
    if (name) {
      const names = name.split(" ");
      return names.length > 1 ? `${names[0]} ${names[1][0]}.` : names[0];
    }
    return "Guest";
  };

  const getUserRole = () => {
    return user?.userType || userRole || "patient";
  };

  return (
    <header className="bg-gradient-to-r from-amber-50 to-orange-50 shadow-md border-b border-amber-100 relative z-50">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-16 h-16 opacity-5">
        <img src={mandalaCorner} alt="" className="w-full h-full" />
      </div>
      <div className="absolute top-0 right-0 w-16 h-16 opacity-5 transform rotate-90">
        <img src={mandalaCorner} alt="" className="w-full h-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center group">
              <div className="relative">
                <Leaf className="h-10 w-10 text-primary-600 transform group-hover:scale-110 transition-transform" />
                <div className="absolute -top-1 -right-1 w-4 h-4 opacity-20">
                  <img src={omSymbol} alt="" className="w-full h-full" />
                </div>
              </div>
              <span className="text-2xl font-decorative text-amber-900 ml-3 tracking-wide">
                AyurSutra
              </span>
            </div>
            <span className="text-sm font-medium text-amber-800 px-4 py-1.5 bg-amber-100/60 rounded-full border border-amber-200/50">
              Panchakarma Management
            </span>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Admin quick button (visible when enabled via env or admin email) */}
            {((typeof process !== 'undefined' && process?.env?.REACT_APP_ENABLE_ADMIN === 'true') || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ENABLE_ADMIN === 'true') || user?.email === 'admin@local') && (
              <button
                className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm"
                onClick={() => setActiveTab('admin-whatsapp')}
              >
                Admin
              </button>
            )}
            {/* Role */}
            <span className="text-sm font-medium text-primary-800 px-4 py-1.5 bg-primary-100/60 rounded-full border border-primary-200/50 capitalize">
              {getUserRole()}
            </span>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowBell(!showBell)}
                className="p-2 hover:bg-amber-100/60 rounded-full transition-colors relative"
                id="bell-button"
              >
                <Bell className="h-6 w-6 text-amber-700 cursor-pointer group-hover:text-amber-900 transition-colors" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showBell && (
                <div
                  id="bell-dropdown"
                  style={{ position: 'fixed', top: '64px', right: '1rem', zIndex: 9999 }}
                  className="w-80 bg-white rounded-xl shadow-xl border py-2"
                >
                  <div className="px-4 py-2 text-sm font-semibold border-b">Notifications</div>
                  <div className="max-h-64 overflow-auto">
                    {notifications.slice(0,2).map((n) => (
                      <div key={n.id} className="px-4 py-3 flex items-start border-b last:border-b-0">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{n.title}</div>
                          <div className="text-xs text-gray-600">{n.message}</div>
                          <div className="text-xxs text-gray-400 mt-1">{new Date(n.time).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                    )}
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 border-t">
                    <button
                      onClick={() => { setActiveTab('notifications'); setShowBell(false); }}
                      className="text-sm text-amber-700 font-medium"
                    >
                      View all
                    </button>
                    <button
                      onClick={() => { setNotifications([]); setShowBell(false); }}
                      className="text-sm text-gray-500"
                    >
                      Mark all read
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                id="user-menu-button"
                className="flex items-center space-x-3 cursor-pointer hover:bg-amber-100/60 rounded-xl px-4 py-2 transition-colors"
                onClick={() => {
                  console.log("Profile button clicked"); // Debug log
                  setShowUserMenu(!showUserMenu);
                }}
              >
                <div className="relative">
                  <User className="h-8 w-8 text-amber-700 bg-amber-100 rounded-full p-1.5" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 opacity-10">
                    <img src={omSymbol} alt="" className="w-full h-full" />
                  </div>
                </div>
                <span className="text-sm font-medium text-amber-900">
                  {getUserDisplayName()}
                </span>
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <div
                  id="user-dropdown"
                  style={{
                    position: "fixed",
                    top: "80px",
                    right: "1rem",
                    zIndex: 9999,
                  }}
                  className="w-64 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-xl border border-amber-100 py-1"
                >
                  <div className="px-6 py-4 text-sm border-b border-amber-100/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
                      <img
                        src={mandalaCorner}
                        alt=""
                        className="w-full h-full"
                      />
                    </div>
                    <div className="font-semibold text-amber-900">
                      {user?.fullName || user?.name || "Guest"}
                    </div>
                    <div className="text-amber-700 mt-1">
                      {user?.email || "user@example.com"}
                    </div>
                    <div className="inline-block text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full capitalize mt-2">
                      {getUserRole()}
                    </div>
                  </div>

                  <div className="p-1">
                    <button
                      className="flex items-center w-full px-4 py-2.5 text-sm text-amber-800 hover:bg-amber-100/60 rounded-lg transition-colors"
                      onClick={() => {
                        setShowUserMenu(false);
                        // ⚙️ Future: settings handler
                      }}
                    >
                      <Settings className="h-4 w-4 mr-3 text-amber-600" />
                      Settings
                    </button>

                    <button
                      className="flex items-center w-full px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50/60 rounded-lg transition-colors"
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-3 text-primary-600" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
