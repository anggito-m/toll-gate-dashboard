"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const LogsTable = ({ logs, onLogClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // --- Filtering ---
  const filteredLogs = logs.filter(
    (log) =>
      log.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.gateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Sorting ---
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "weight") {
      aValue = Number.parseFloat(aValue);
      bValue = Number.parseFloat(bValue);
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // --- Pagination ---
  const totalPages = Math.ceil(sortedLogs.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentLogs = sortedLogs.slice(indexOfFirst, indexOfLast);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      OK: "status-ok",
      Overload: "status-overload",
      Overdimension: "status-overdimension",
      "Manual Entry":
        "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium",
    };

    if (status.includes("Overload") && status.includes("Overdimension")) {
      return (
        <>
          {status.map((stat, index) => (
            <span key={index} className="status-overload-overdimension">
              {stat}
            </span>
          ))}
        </>
      );
    } else {
      return (
        <span
          className={
            statusClasses[status] ||
            "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium"
          }
        >
          {status}
        </span>
      );
    }
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Real-time Vehicle Logs
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset page on search
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-64"
              aria-label="Search vehicle logs"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                { label: "Timestamp", field: "timestamp" },
                { label: "Gate ID", field: "gateId" },
                { label: "Vehicle ID", field: "vehicleId" },
                { label: "Dimensions (L×W×H)", field: null },
                { label: "Weight (t)", field: "weight" },
                { label: "Status", field: "status" },
              ].map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    col.field ? "cursor-pointer hover:bg-gray-100" : ""
                  }`}
                  onClick={col.field ? () => handleSort(col.field) : undefined}
                  role={col.field ? "button" : undefined}
                  tabIndex={col.field ? 0 : undefined}
                  onKeyDown={(e) =>
                    col.field && e.key === "Enter" && handleSort(col.field)
                  }
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.label}</span>
                    {col.field && sortField === col.field && (
                      <svg
                        className={`w-4 h-4 ${
                          sortDirection === "asc" ? "transform rotate-180" : ""
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentLogs.map((log, index) => (
              <motion.tr
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onLogClick(log)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onLogClick(log)}
                aria-label={`View details for vehicle ${log.vehicleId}`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.timestamp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {log.gateId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.vehicleId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.dimensions.length}×{log.dimensions.width}×
                  {log.dimensions.height}m
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.weight}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(log.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLogClick(log);
                    }}
                    className="text-blue-600 hover:text-blue-900 focus:outline-none focus:underline"
                    aria-label={`View details for ${log.vehicleId}`}
                  >
                    View Details
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {sortedLogs.length === 0 && (
        <div className="p-8 text-center">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <p className="text-gray-500">
            No logs found matching your search criteria.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {sortedLogs.length > 0 && (
        <div className="flex justify-between items-center p-4 border-t border-gray-200">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

LogsTable.propTypes = {
  logs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      timestamp: PropTypes.string.isRequired,
      gateId: PropTypes.string.isRequired,
      vehicleId: PropTypes.string.isRequired,
      dimensions: PropTypes.shape({
        length: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
      }).isRequired,
      weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  onLogClick: PropTypes.func.isRequired,
};

export default LogsTable;
