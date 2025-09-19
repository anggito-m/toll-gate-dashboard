"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-8 bg-white"
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="currentColor"
                viewBox="0 0 86 86"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 13.4375C0 6.01328 6.01328 0 13.4375 0H72.5625C79.9867 0 86 6.01328 86 13.4375V61.8125C86 66.2133 83.8836 70.1102 80.625 72.5625V80.625C80.625 83.598 78.223 86 75.25 86H69.875C66.902 86 64.5 83.598 64.5 80.625V75.25H21.5V80.625C21.5 83.598 19.098 86 16.125 86H10.75C7.77695 86 5.375 83.598 5.375 80.625V72.5625C2.11641 70.1102 0 66.2133 0 61.8125V13.4375ZM21.8191 25.5648L18.8125 37.625H67.1875L64.1809 25.5648C63.5762 23.1797 61.4262 21.5 58.957 21.5H27.043C24.5738 21.5 22.4238 23.1797 21.8359 25.5648H21.8191ZM21.5 53.75C21.5 52.3245 20.9337 50.9573 19.9257 49.9493C18.9177 48.9413 17.5505 48.375 16.125 48.375C14.6995 48.375 13.3323 48.9413 12.3243 49.9493C11.3163 50.9573 10.75 52.3245 10.75 53.75C10.75 55.1755 11.3163 56.5427 12.3243 57.5507C13.3323 58.5587 14.6995 59.125 16.125 59.125C17.5505 59.125 18.9177 58.5587 19.9257 57.5507C20.9337 56.5427 21.5 55.1755 21.5 53.75ZM69.875 59.125C71.3005 59.125 72.6677 58.5587 73.6757 57.5507C74.6837 56.5427 75.25 55.1755 75.25 53.75C75.25 52.3245 74.6837 50.9573 73.6757 49.9493C72.6677 48.9413 71.3005 48.375 69.875 48.375C68.4495 48.375 67.0823 48.9413 66.0743 49.9493C65.0663 50.9573 64.5 52.3245 64.5 53.75C64.5 55.1755 65.0663 56.5427 66.0743 57.5507C67.0823 58.5587 68.4495 59.125 69.875 59.125Z"
                  fill="white"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Login to your Account
            </h1>
            <p className="text-gray-600">
              Welcome back! Select method to login.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input-field"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                aria-describedby="username-error"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input-field pr-12"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Toggle password visibility"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  name="rememberMe"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="ml-2 text-sm text-gray-600">Remember Me</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="w-full btn-primary">
              Login
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-700">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-gray-700">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Blue Background with Graphics */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden"
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-blue-400/20 rounded-lg rotate-45"></div>
          <div className="absolute bottom-32 left-16 w-40 h-40 bg-blue-500/10 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-blue-400/20 rounded-lg rotate-12"></div>
        </div>

        {/* Central Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="w-48 h-48 bg-blue-500/30 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-16 h-16 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 86 86"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 13.4375C0 6.01328 6.01328 0 13.4375 0H72.5625C79.9867 0 86 6.01328 86 13.4375V61.8125C86 66.2133 83.8836 70.1102 80.625 72.5625V80.625C80.625 83.598 78.223 86 75.25 86H69.875C66.902 86 64.5 83.598 64.5 80.625V75.25H21.5V80.625C21.5 83.598 19.098 86 16.125 86H10.75C7.77695 86 5.375 83.598 5.375 80.625V72.5625C2.11641 70.1102 0 66.2133 0 61.8125V13.4375ZM21.8191 25.5648L18.8125 37.625H67.1875L64.1809 25.5648C63.5762 23.1797 61.4262 21.5 58.957 21.5H27.043C24.5738 21.5 22.4238 23.1797 21.8359 25.5648H21.8191ZM21.5 53.75C21.5 52.3245 20.9337 50.9573 19.9257 49.9493C18.9177 48.9413 17.5505 48.375 16.125 48.375C14.6995 48.375 13.3323 48.9413 12.3243 49.9493C11.3163 50.9573 10.75 52.3245 10.75 53.75C10.75 55.1755 11.3163 56.5427 12.3243 57.5507C13.3323 58.5587 14.6995 59.125 16.125 59.125C17.5505 59.125 18.9177 58.5587 19.9257 57.5507C20.9337 56.5427 21.5 55.1755 21.5 53.75ZM69.875 59.125C71.3005 59.125 72.6677 58.5587 73.6757 57.5507C74.6837 56.5427 75.25 55.1755 75.25 53.75C75.25 52.3245 74.6837 50.9573 73.6757 49.9493C72.6677 48.9413 71.3005 48.375 69.875 48.375C68.4495 48.375 67.0823 48.9413 66.0743 49.9493C65.0663 50.9573 64.5 52.3245 64.5 53.75C64.5 55.1755 65.0663 56.5427 66.0743 57.5507C67.0823 58.5587 68.4495 59.125 69.875 59.125Z"
                    fill="#0666F9"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Decorative Icons */}
        <div className="absolute top-32 right-24 w-16 h-16 bg-blue-400/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <svg
            className="w-8 h-8 text-white/80"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>

        <div className="absolute bottom-32 left-24 w-16 h-16 bg-blue-400/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <svg
            className="w-8 h-8 text-white/80"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
        </div>

        <div className="absolute top-1/2 right-16 w-16 h-16 bg-blue-400/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <svg
            className="w-8 h-8 text-white/80"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginPage;
