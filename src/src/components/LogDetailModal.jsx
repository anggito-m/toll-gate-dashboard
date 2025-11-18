"use client";

import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import axios from "axios";

const LogDetailModal = ({ log, onClose }) => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [fileExists, setFileExists] = React.useState(false);

  const rememberMe = localStorage.getItem("rememberMe") === "true";

  // Load token dari localStorage atau sessionStorage
  const token = rememberMe
    ? localStorage.getItem("authToken")
    : sessionStorage.getItem("authToken");

  console.log("LogDetailModal log prop:", log);
  console.log("authToken from localStorage:", token);

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

  const handleGenerateReport = async (logData) => {
    try {
      setIsGenerating(true);

      // Request generate report (atau ambil yang sudah ada)
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/reports/generate`,
        logData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { file } = response.data;
      setFileExists(file.exists);

      // Download file
      try {
        const downloadResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_ENDPOINT}${file.path}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
            timeout: 5000, // 5 detik timeout
          }
        );

        // Jika sampai sini, berarti axios berhasil download
        const url = window.URL.createObjectURL(
          new Blob([downloadResponse.data])
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.name);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        alert(
          file.exists
            ? "Report sudah ada dan berhasil didownload!"
            : "Report berhasil dibuat dan didownload!"
        );
      } catch (downloadError) {
        // Error saat download bisa karena IDM interrupt atau timeout
        // Tapi report tetap berhasil dibuat, jadi anggap sukses
        console.warn(
          "Download interrupted (possibly by IDM):",
          downloadError.message
        );
        alert(
          file.exists
            ? "Report sudah ada dan siap didownload!"
            : "Report berhasil dibuat! (Download mungkin diambil alih oleh IDM)"
        );
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Gagal generate/download report");
    } finally {
      setIsGenerating(false);
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

  const getStatusColor = (status) => {
    if (!status) return "text-gray-600 bg-gray-100";

    let statusList = [];

    // Pastikan status dalam bentuk array
    if (Array.isArray(status)) {
      statusList = status;
    } else if (typeof status === "string") {
      statusList = [status];
    }

    // Tangani jika formatnya seperti ['{"Overload"}'] atau ['{"Overload", "Overdimension"}']
    statusList = statusList.flatMap((item) => {
      if (typeof item === "string") {
        // Hilangkan karakter { } [ ] dan tanda kutip ganda
        const cleaned = item.replace(/[\{\}\[\]"]+/g, "").trim();

        // Pisahkan jika ada lebih dari satu status di dalam string
        return cleaned.split(",").map((s) => s.trim());
      }
      return item;
    });

    // Setelah dibersihkan, statusList bisa misalnya jadi ['Overload', 'Overdimension']
    const hasOK = statusList.includes("OK");
    const hasOverload = statusList.includes("Overload");
    const hasOverdimension = statusList.includes("Overdimension");
    const hasManual = statusList.includes("Manual Entry");

    // Tentukan warna berdasarkan kombinasi status
    const res = hasOK
      ? "text-green-600 bg-green-100"
      : (hasOverload || hasOverdimension) && statusList.length < 2
      ? "text-yellow-600 bg-yellow-100"
      : hasOverload && hasOverdimension
      ? "text-red-600 bg-red-100"
      : hasManual
      ? "text-blue-600 bg-blue-100"
      : "text-gray-600 bg-gray-100";

    return res;
  };

  const statusArray = Object.values(log.status);
  // Check log.status type
  console.log("Log Status Type:", typeof log.status);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
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
              id="modal-title"
              className="text-xl font-semibold text-gray-900"
            >
              Vehicle Log Details
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {log.vehicleId} • {log.timestamp}
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

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Status */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Status
                </h3>
                <div
                  className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(
                    log.status
                  )}`}
                >
                  {console.log(log.status)}
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      log.status.includes("OK")
                        ? "bg-green-500"
                        : log.status.includes("Overload") &&
                          log.status.includes("Overdimension")
                        ? "bg-red-500"
                        : (log.status.includes("Overdimension") ||
                            log.status.includes("Overload")) &&
                          log.status.length < 2
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  {/* Join log status */}
                  {statusArray.join(" ")}
                </div>
              </div>

              {/* Vehicle Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Vehicle Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Vehicle Number:
                    </span>
                    <span className="text-sm text-gray-900">
                      {log.nomorKendaraan}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Gate ID:
                    </span>
                    <span className="text-sm text-gray-900">
                      {log.gateName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Timestamp:
                    </span>
                    <span className="text-sm text-gray-900">
                      {log.timestamp}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dimensions Uji Kir */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Pengukuran Uji KIR
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {log.uji_kir.length}cm
                    </div>
                    <div className="text-sm text-gray-600">Length</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {log.uji_kir.width}cm
                    </div>
                    <div className="text-sm text-gray-600">Width</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {log.uji_kir.height}cm
                    </div>
                    <div className="text-sm text-gray-600">Height</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {log.uji_kir.weight}kg
                    </div>
                    <div className="text-sm text-gray-600">Weight</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Photos and Sensor Data */}
            <div className="space-y-6">
              {/* Photos */}
              {/* <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Vehicle Photos</h3>
                <div className="grid grid-cols-1 gap-4">
                  {log.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Vehicle ${log.vehicleId} photo ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        Photo {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Sensor Readings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Sensor Readings
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Weight Sensor:
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900">
                        {log.sensorReadings.weight}kg
                      </span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Height Sensor:
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900">
                        {log.sensorReadings.height}cm
                      </span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Length Sensor:
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900">
                        {log.sensorReadings.length}cm
                      </span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Width Sensor:
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900">
                        {log.sensorReadings.width}cm
                      </span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
            <button
              onClick={() => {
                // Handle export functionality
                handleGenerateReport(log);
              }}
              disabled={isGenerating}
              className="btn-primary"
            >
              {isGenerating ? "Generating..." : "Export Report"}
            </button>
            {/* {(log.status.includes("Overload") ||
              log.status.includes("Overdimension")) && (
              <button
                onClick={() => {
                  // Handle flag for review
                  console.log("Flagging for review:", log);
                }}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Flag for Review
              </button>
            )} */}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

LogDetailModal.propTypes = {
  log: PropTypes.shape({
    id: PropTypes.number.isRequired,
    timestamp: PropTypes.string.isRequired,
    gateName: PropTypes.string,
    vehicleId: PropTypes.string.isRequired,
    nomorKendaraan: PropTypes.string,
    uji_kir: PropTypes.shape({
      length: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    }).isRequired,
    status: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    classDimensions: PropTypes.shape({
      length: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    }).isRequired,
    sensorReadings: PropTypes.shape({
      weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      length: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    }).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LogDetailModal;
