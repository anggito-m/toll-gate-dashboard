"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const ManualInputModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    gateId: "",
    plateNumber: "",
    length: "",
    width: "",
    height: "",
    weight: "",
  });

  const [errors, setErrors] = useState({});

  const gates = ["GATE-001", "GATE-002", "GATE-003", "GATE-004", "GATE-005"];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.gateId) newErrors.gateId = "Gate selection is required";
    if (!formData.plateNumber)
      newErrors.plateNumber = "Plate number is required";
    if (!formData.length || Number.parseFloat(formData.length) <= 0)
      newErrors.length = "Valid length is required";
    if (!formData.width || Number.parseFloat(formData.width) <= 0)
      newErrors.width = "Valid width is required";
    if (!formData.height || Number.parseFloat(formData.height) <= 0)
      newErrors.height = "Valid height is required";
    if (!formData.weight || Number.parseFloat(formData.weight) <= 0)
      newErrors.weight = "Valid weight is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="manual-input-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2
              id="manual-input-title"
              className="text-xl font-semibold text-gray-900"
            >
              Manual Vehicle Entry
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Enter vehicle details manually for processing
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Gate Selection */}
            <div>
              <label
                htmlFor="gateId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Gate *
              </label>
              <select
                id="gateId"
                name="gateId"
                value={formData.gateId}
                onChange={handleChange}
                className={`input-field ${
                  errors.gateId ? "border-red-500 focus:ring-red-500" : ""
                }`}
                aria-describedby={errors.gateId ? "gateId-error" : undefined}
              >
                <option value="">Choose a gate...</option>
                {gates.map((gate) => (
                  <option key={gate} value={gate}>
                    {gate}
                  </option>
                ))}
              </select>
              {errors.gateId && (
                <p
                  id="gateId-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.gateId}
                </p>
              )}
            </div>

            {/* Plate Number */}
            <div>
              <label
                htmlFor="plateNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Vehicle Plate Number *
              </label>
              <input
                id="plateNumber"
                name="plateNumber"
                type="text"
                value={formData.plateNumber}
                onChange={handleChange}
                className={`input-field ${
                  errors.plateNumber ? "border-red-500 focus:ring-red-500" : ""
                }`}
                placeholder="e.g., ABC-123"
                aria-describedby={
                  errors.plateNumber ? "plateNumber-error" : undefined
                }
              />
              {errors.plateNumber && (
                <p
                  id="plateNumber-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.plateNumber}
                </p>
              )}
            </div>

            {/* Dimensions Grid
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Dimensions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-2">
                    Length (m) *
                  </label>
                  <input
                    id="length"
                    name="length"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.length}
                    onChange={handleChange}
                    className={`input-field ${errors.length ? "border-red-500 focus:ring-red-500" : ""}`}
                    placeholder="12.5"
                    aria-describedby={errors.length ? "length-error" : undefined}
                  />
                  {errors.length && (
                    <p id="length-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.length}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-2">
                    Width (m) *
                  </label>
                  <input
                    id="width"
                    name="width"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.width}
                    onChange={handleChange}
                    className={`input-field ${errors.width ? "border-red-500 focus:ring-red-500" : ""}`}
                    placeholder="2.5"
                    aria-describedby={errors.width ? "width-error" : undefined}
                  />
                  {errors.width && (
                    <p id="width-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.width}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                    Height (m) *
                  </label>
                  <input
                    id="height"
                    name="height"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.height}
                    onChange={handleChange}
                    className={`input-field ${errors.height ? "border-red-500 focus:ring-red-500" : ""}`}
                    placeholder="3.2"
                    aria-describedby={errors.height ? "height-error" : undefined}
                  />
                  {errors.height && (
                    <p id="height-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.height}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (t) *
                  </label>
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.weight}
                    onChange={handleChange}
                    className={`input-field ${errors.weight ? "border-red-500 focus:ring-red-500" : ""}`}
                    placeholder="15.5"
                    aria-describedby={errors.weight ? "weight-error" : undefined}
                  />
                  {errors.weight && (
                    <p id="weight-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.weight}
                    </p>
                  )}
                </div>
              </div>
            </div> */}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Submit Entry
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

ManualInputModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ManualInputModal;
