import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [subsOpen, setSubsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const profileRef = useRef(null);
  const subsRef = useRef(null);

  // Close profile and subs dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (subsRef.current && !subsRef.current.contains(e.target)) {
        setSubsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close sidebar when a link is clicked
  const handleSidebarLinkClick = () => {
    setSidebarOpen(false);
  };

  // Get user from localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const isLoggedIn = !!user;

  return (
    <>
      <nav className="bg-slate-800 text-sky-400 p-4 flex items-center justify-between fixed top-0 left-0 w-full z-50 shadow-md">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/home">MyISP</Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6 text-lg font-light">
          <Link to="/about" className="hover:text-sky-400">
            About
          </Link>
          <Link to="/contact" className="hover:text-sky-400">
            Contact
          </Link>
          <Link to="/locations" className="hover:text-sky-400">
            Locations
          </Link>

          {/* Subscriptions Dropdown */}
          <div className="relative" ref={subsRef}>
            <button
              onClick={() => setSubsOpen(!subsOpen)}
              className="bg-slate-800 text-gray-400 hover:text-sky-600 p-1 rounded-md"
            >
              Subscriptions
            </button>
            {subsOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 text-sky-400 rounded-md shadow-lg z-30">
                <Link
                  to="/subscriptions/fiber"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setSubsOpen(false)}
                >
                  Fiber Network
                </Link>
                <Link
                  to="/subscriptions/residential"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setSubsOpen(false)}
                >
                  Residential
                </Link>
                <Link
                  to="/subscriptions/corporate"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setSubsOpen(false)}
                >
                  Corporate
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-4">
          {/* Profile Icon */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="bg-slate-800 text-gray-400 hover:text-sky-600 p-1 rounded-full"
            >
              <FaUser className="w-6 h-6" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 text-sky-400 rounded-md shadow-lg z-30 p-2">
                {isLoggedIn ? (
                  <>
                    <div className="px-4 py-2 border-b border-sky-700 mb-2">
                      <div className="font-semibold text-indigo-300">
                        {user.username}
                      </div>
                      <div className="text-xs text-sky-300">Logged in</div>
                    </div>
                    <div className="px-4 py-2 border-b border-sky-700 mb-2">
                      <Link
                        to="/status"
                        className="font-semibold text-indigo-300"
                        onClick={() => setProfileOpen(!profileOpen)}
                      >
                        Status
                      </Link>
                    </div>
                    <div className="px-4 py-2 border-b border-sky-700 mb-2">
                      <Link
                        to="/profile/subscription"
                        className="font-semibold text-indigo-300"
                        onClick={() => setProfileOpen(false)}
                      >
                        Manage Subscription
                      </Link>
                    </div>

                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-slate-800 rounded"
                      onClick={() => {
                        localStorage.removeItem("user");
                        setProfileOpen(false);
                        window.location.reload();
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-slate-800 rounded"
                      onClick={() => setProfileOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-slate-800 rounded"
                      onClick={() => setProfileOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Hamburger Toggle (Mobile Only) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-white text-2xl"
            aria-label="Toggle Menu"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-50 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-800 text-white z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col mt-20 px-6 space-y-6 font-light text-lg">
          <Link
            to="/about"
            onClick={handleSidebarLinkClick}
            className="hover:text-sky-400"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={handleSidebarLinkClick}
            className="hover:text-sky-400"
          >
            Contact
          </Link>
          <Link
            to="/locations"
            onClick={handleSidebarLinkClick}
            className="hover:text-sky-400"
          >
            Locations
          </Link>

          <div>
            <p className="text-sky-300 mb-2 font-semibold">Subscriptions</p>
            <Link
              to="/subscriptions/fiber"
              onClick={handleSidebarLinkClick}
              className="block pl-4 hover:text-sky-400 mb-1"
            >
              Fiber Network
            </Link>
            <Link
              to="/subscriptions/residential"
              onClick={handleSidebarLinkClick}
              className="block pl-4 hover:text-sky-400 mb-1"
            >
              Residential
            </Link>
            <Link
              to="/subscriptions/corporate"
              onClick={handleSidebarLinkClick}
              className="block pl-4 hover:text-sky-400"
            >
              Corporate
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
