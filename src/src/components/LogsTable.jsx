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
  const filteredLogs = logs.filter((log) => {
    const nomorKendaraan = log.nomorKendaraan?.toLowerCase() || "";
    const gateName = log.gateName?.toLowerCase() || "";
    const statuses = Array.isArray(log.status)
      ? log.status.map((s) => s?.toLowerCase() || "")
      : [];

    const search = searchTerm.toLowerCase();

    return (
      nomorKendaraan.includes(search) ||
      gateName.includes(search) ||
      statuses.some((s) => s.includes(search))
    );
  });

  // --- Sorting ---
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    // Null/undefined handling
    if (aValue == null) aValue = "";
    if (bValue == null) bValue = "";

    // Convert arrays (like status) to strings for comparison
    if (Array.isArray(aValue)) aValue = aValue.join(" ");
    if (Array.isArray(bValue)) bValue = bValue.join(" ");

    // Convert objects to string (just in case)
    if (typeof aValue === "object") aValue = JSON.stringify(aValue);
    if (typeof bValue === "object") bValue = JSON.stringify(bValue);

    // Numeric sort for weight
    if (sortField === "weight") {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    }

    // Case-insensitive compare
    if (typeof aValue === "string") aValue = aValue.toLowerCase();
    if (typeof bValue === "string") bValue = bValue.toLowerCase();

    // Directional sorting
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
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
    if (!status) return null;

    // Pastikan status selalu array
    let statusList = Array.isArray(status) ? status : [status];

    // 🔧 Tangani kasus string JSON atau format aneh seperti '{"Overload"}'
    statusList = statusList
      .map((s) => {
        if (typeof s === "string") {
          try {
            // Coba parse JSON jika berbentuk seperti '{"Overload"}'
            const parsed = JSON.parse(s);
            // Jika hasilnya string, gunakan string itu
            if (typeof parsed === "string") return parsed;
            // Jika hasilnya array, ambil isinya
            if (Array.isArray(parsed)) return parsed.join(", ");
            return String(parsed);
          } catch {
            // Jika gagal parse, bersihkan karakter khusus
            return s.replace(/[{}"\\]/g, "").trim();
          }
        }
        return String(s).trim();
      })
      .flatMap((s) => s.split(",").map((x) => x.trim())) // pisah jika 'a,b'
      .filter(Boolean); // hapus string kosong

    // 🔥 Jika ada kombinasi Overload dan Overdimension
    if (
      statusList.includes("Overload") &&
      statusList.includes("Overdimension")
    ) {
      return (
        <>
          {statusList.map((stat, index) => (
            <span key={index} className="status-overload-overdimension">
              {stat}
            </span>
          ))}
        </>
      );
    }

    // Kelas status normal
    const statusClasses = {
      OK: "status-ok",
      Overload: "status-overload",
      Overdimension: "status-overdimension",
      "Manual Entry":
        "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium",
    };

    return statusList.map((stat, index) => (
      <span
        key={index}
        className={
          statusClasses[stat] ||
          "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium"
        }
      >
        {stat}
      </span>
    ));
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
                { label: "Gate Name", field: "gateName" },
                { label: "Nomor Kendaraan", field: "nomorKendaraan" },
                { label: "Dimensions (L×W×H)", field: null },
                { label: "Weight (g)", field: "weight" },
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
                aria-label={`View details for vehicle ${log.nomorKendaraan}`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.timestamp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {log.gateName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.nomorKendaraan}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log?.sensorReadings?.length &&
                  log?.sensorReadings?.width &&
                  log?.sensorReadings?.height
                    ? `${log.sensorReadings.length}×${log.sensorReadings.width}×${log.sensorReadings.height}m`
                    : "N/A"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.sensorReadings.weight || "N/A"}
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
                    aria-label={`View details for ${log.nomorKendaraan}`}
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
    }).isRequired
  ).isRequired,
  onLogClick: PropTypes.func.isRequired,
};

export default LogsTable;
