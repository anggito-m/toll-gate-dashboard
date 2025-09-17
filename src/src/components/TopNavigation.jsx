"use client"

import { useState } from "react"
import PropTypes from "prop-types"
import { motion } from "framer-motion"

const TopNavigation = ({ user, onLogout, onManualInput, onGateControl }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 7h-8v6h8V7zm-2 4h-4V9h4v2zm4-4v10c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2zm-2 0H5v10h14V7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold">Toll Gate Monitor</h1>
          </div>

          {/* System Status */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">System Online</span>
            </div>
            <div className="text-sm text-gray-300">Last Update: {new Date().toLocaleTimeString()}</div>
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
                  <span className="text-sm font-medium">{user.username.charAt(0).toUpperCase()}</span>
                </div>
                <span className="hidden sm:block text-sm">{user.username}</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
                    <p className="text-sm font-medium text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      // Handle profile action
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      onLogout()
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
  )
}

TopNavigation.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
  onManualInput: PropTypes.func.isRequired,
  onGateControl: PropTypes.func.isRequired,
}

export default TopNavigation
