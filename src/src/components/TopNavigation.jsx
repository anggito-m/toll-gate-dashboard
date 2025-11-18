"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import logo from "../../public/Logo.svg";

const TopNavigation = ({ user, onLogout, onManualInput, onGateControl }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-11 h-11 text-white" />
              {/* <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 86 86"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 13.4375C0 6.01328 6.01328 0 13.4375 0H72.5625C79.9867 0 86 6.01328 86 13.4375V61.8125C86 66.2133 83.8836 70.1102 80.625 72.5625V80.625C80.625 83.598 78.223 86 75.25 86H69.875C66.902 86 64.5 83.598 64.5 80.625V75.25H21.5V80.625C21.5 83.598 19.098 86 16.125 86H10.75C7.77695 86 5.375 83.598 5.375 80.625V72.5625C2.11641 70.1102 0 66.2133 0 61.8125V13.4375ZM21.8191 25.5648L18.8125 37.625H67.1875L64.1809 25.5648C63.5762 23.1797 61.4262 21.5 58.957 21.5H27.043C24.5738 21.5 22.4238 23.1797 21.8359 25.5648H21.8191ZM21.5 53.75C21.5 52.3245 20.9337 50.9573 19.9257 49.9493C18.9177 48.9413 17.5505 48.375 16.125 48.375C14.6995 48.375 13.3323 48.9413 12.3243 49.9493C11.3163 50.9573 10.75 52.3245 10.75 53.75C10.75 55.1755 11.3163 56.5427 12.3243 57.5507C13.3323 58.5587 14.6995 59.125 16.125 59.125C17.5505 59.125 18.9177 58.5587 19.9257 57.5507C20.9337 56.5427 21.5 55.1755 21.5 53.75ZM69.875 59.125C71.3005 59.125 72.6677 58.5587 73.6757 57.5507C74.6837 56.5427 75.25 55.1755 75.25 53.75C75.25 52.3245 74.6837 50.9573 73.6757 49.9493C72.6677 48.9413 71.3005 48.375 69.875 48.375C68.4495 48.375 67.0823 48.9413 66.0743 49.9493C65.0663 50.9573 64.5 52.3245 64.5 53.75C64.5 55.1755 65.0663 56.5427 66.0743 57.5507C67.0823 58.5587 68.4495 59.125 69.875 59.125Z"
                  fill="white"
                />
              </svg> */}
            </div>
            {/* Vertical Flex */}
            <div className="flex flex-col leading-tight">
              <h3 className="text-sm text-gray-300">SMART OOTD</h3>
              <h1 className="text-xl font-bold">Toll Gate Monitor</h1>
            </div>
          </div>

          {/* System Status */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">System Online</span>
            </div>
            <div className="text-sm text-gray-300">
              Last Update: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Action Buttons and User Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onManualInput}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Open manual input form"
            >
              Manual Input
            </button>

            <button
              onClick={onGateControl}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Open gate control panel"
            >
              Gate Control
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label="User menu"
                aria-expanded={showUserMenu}
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:block text-sm">{user.username}</span>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>

              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Handle profile action
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

TopNavigation.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
  onManualInput: PropTypes.func.isRequired,
  onGateControl: PropTypes.func.isRequired,
};

export default TopNavigation;
