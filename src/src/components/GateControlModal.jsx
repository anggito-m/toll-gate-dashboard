"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const GateControlModal = ({ onClose, userRole }) => {
  const [selectedGate, setSelectedGate] = useState("");
  const [action, setAction] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const gates = [
    { id: "GATE-001", name: "LANE 1", status: "open" },
    // { id: "GATE-002", name: "South Gate", status: "closed" },
    // { id: "GATE-003", name: "East Gate", status: "maintenance" },
    // { id: "GATE-004", name: "West Gate", status: "open" },
    // { id: "GATE-005", name: "Central Gate", status: "closed" },
  ];

  const canControlGates = userRole === "admin" || userRole === "operator";

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !showConfirmation) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && !showConfirmation) {
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
  }, [showConfirmation]);

  const handleGateAction = (gateId, actionType) => {
    if (!canControlGates) return;

    setSelectedGate(gateId);
    setAction(actionType);
    setShowConfirmation(true);
  };

  const confirmAction = async () => {
    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(`${action} gate ${selectedGate}`);

    setIsProcessing(false);
    setShowConfirmation(false);
    setSelectedGate("");
    setAction("");

    // Could show success message here
  };

  const cancelAction = () => {
    setShowConfirmation(false);
    setSelectedGate("");
    setAction("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "text-green-600 bg-green-100";
      case "closed":
        return "text-red-600 bg-red-100";
      case "maintenance":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return (
          <svg
            className="w-5 h-5 text-green-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        );
      case "closed":
        return (
          <svg
            className="w-5 h-5 text-red-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        );
      case "maintenance":
        return (
          <svg
            className="w-5 h-5 text-yellow-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-control-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2
              id="gate-control-title"
              className="text-xl font-semibold text-gray-900"
            >
              Emergency Gate Control
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {canControlGates
                ? "Control gate operations for emergency situations"
                : "You do not have permission to control gates"}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={showConfirmation}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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

        <div className="p-6">
          {!canControlGates ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11V12z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Access Restricted
              </h3>
              <p className="text-gray-600">
                You need administrator or operator privileges to control gates.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Current role: <span className="font-medium">{userRole}</span>
              </p>
            </div>
          ) : (
            <>
              {/* Gate Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gates.map((gate) => (
                  <motion.div
                    key={gate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {gate.name}
                        </h3>
                        <p className="text-sm text-gray-600">{gate.id}</p>
                      </div>
                      {getStatusIcon(gate.status)}
                    </div>

                    <div className="mb-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          gate.status
                        )}`}
                      >
                        {gate.status.charAt(0).toUpperCase() +
                          gate.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleGateAction(gate.id, "open")}
                        disabled={
                          gate.status === "open" ||
                          gate.status === "maintenance" ||
                          showConfirmation
                        }
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        aria-label={`Open ${gate.name}`}
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleGateAction(gate.id, "close")}
                        disabled={
                          gate.status === "closed" ||
                          gate.status === "maintenance" ||
                          showConfirmation
                        }
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        aria-label={`Close ${gate.name}`}
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Emergency Actions */}
              <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-lg font-medium text-red-900 mb-2">
                  Emergency Actions
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  Use these controls only in emergency situations. All actions
                  are logged and monitored.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      setSelectedGate("ALL");
                      setAction("open all");
                      setShowConfirmation(true);
                    }}
                    disabled={showConfirmation}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Open All Gates
                  </button>
                  <button
                    onClick={() => {
                      setSelectedGate("ALL");
                      setAction("close all");
                      setShowConfirmation(true);
                    }}
                    disabled={showConfirmation}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Close All Gates
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Confirm Action
                  </h3>
                  <p className="text-sm text-gray-600">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to <strong>{action}</strong>
                {selectedGate === "ALL" ? "?" : ` for ${selectedGate}?`}
              </p>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={cancelAction}
                  disabled={isProcessing}
                  className="btn-secondary disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  disabled={isProcessing}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

GateControlModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default GateControlModal;
