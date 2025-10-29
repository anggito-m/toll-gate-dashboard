"use client";

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion, press } from "framer-motion";
import TopNavigation from "./TopNavigation";
import SummaryCards from "./SummaryCards";
import LogsTable from "./LogsTable";
import MapPlaceholder from "./MapPlaceholder";
import LogDetailModal from "./LogDetailModal";
import ManualInputModal from "./ManualInputModal";
import GateControlModal from "./GateControlModal";
import axios from "axios";

// Fetch logs from server (replace with real API call if available)
// const fetchLogs = async () => {
//   try {
//     const response = await axios.get(
//       `${process.env.SERVER_ENDPOINT}/api/logs/recent`
//     );
//     return response.data.logs;
//   } catch (error) {
//     console.error("Error fetching logs:", error);
//     return [];
//   }
// };

// Mock data
const mockLogs = [
  // {
  //   id: 1,
  //   timestamp: "2024-01-15 14:30:25",
  //   gateId: "GATE-001",
  //   vehicleId: "ABC-123",
  //   dimensions: { length: 12.5, width: 2.5, height: 3.2 },
  //   weight: 15.5,
  //   status: "OK",
  //   photos: ["/truck-front-view.jpg"],
  //   sensorReadings: {
  //     weightSensor: 15.5,
  //     heightSensor: 3.2,
  //     lengthSensor: 12.5,
  //     widthSensor: 2.5,
  //   },
  // },
  // {
  //   id: 2,
  //   timestamp: "2024-01-15 14:28:15",
  //   gateId: "GATE-002",
  //   vehicleId: "XYZ-789",
  //   dimensions: { length: 18.2, width: 2.8, height: 4.1 },
  //   weight: 25.8,
  //   status: "Overload",
  //   photos: ["/overloaded-truck.jpg"],
  //   sensorReadings: {
  //     weightSensor: 25.8,
  //     heightSensor: 4.1,
  //     lengthSensor: 18.2,
  //     widthSensor: 2.8,
  //   },
  // },
  // {
  //   id: 3,
  //   timestamp: "2024-01-15 14:25:45",
  //   gateId: "GATE-003",
  //   vehicleId: "DEF-456",
  //   dimensions: { length: 22.0, width: 3.5, height: 3.8 },
  //   weight: 18.2,
  //   status: "Overdimension",
  //   photos: ["/oversized-truck.jpg"],
  //   sensorReadings: {
  //     weightSensor: 18.2,
  //     heightSensor: 3.8,
  //     lengthSensor: 22.0,
  //     widthSensor: 3.5,
  //   },
  // },
];
// const calculateSummary = (logs) => {
//   const totalVehicles = logs.length;
//   const overloadOverdimensionCount = logs.filter((log) => {
//     const statuses = [].concat(log.status || []);

//     return statuses.includes("Overload") || statuses.includes("Overdimension");
//   }).length;
//   return {
//     activeGates: new Set(logs.map((log) => log.gateId)).size, // unique gates
//     overloadOverdimensionCount,
//     avgProcessingTime: "2.3s", // keep this mocked unless you have real timing
//     totalVehicles,
//   };
// };

const calculateSummary = (logs) => {
  // If logs is a string, try parsing
  if (typeof logs === "string") {
    try {
      logs = JSON.parse(logs);
    } catch {
      console.warn("Invalid logs format");
      return {
        activeGates: 0,
        overloadOverdimensionCount: 0,
        avgProcessingTime: "0s",
        totalVehicles: 0,
      };
    }
  }

  if (!Array.isArray(logs)) {
    console.warn("Logs is not an array:", logs);
    return {
      activeGates: 0,
      overloadOverdimensionCount: 0,
      avgProcessingTime: "0s",
      totalVehicles: 0,
    };
  }

  const totalVehicles = logs.length;
  const overloadOverdimensionCount = logs.filter((log) => {
    const statuses = [].concat(log.status || []);
    return statuses.includes("Overload") || statuses.includes("Overdimension");
  }).length;

  return {
    activeGates: new Set(logs.map((log) => log.gateId)).size,
    overloadOverdimensionCount,
    avgProcessingTime: "2.3s",
    totalVehicles,
  };
};

const dataSummary = calculateSummary(mockLogs);

const Dashboard = ({ user, onLogout }) => {
  const [logs, setLogs] = useState(mockLogs);
  const [summary, setSummary] = useState(dataSummary);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [showGateControl, setShowGateControl] = useState(false);

  // Connect to backend via WebSocket
  useEffect(() => {
    const ws = new WebSocket(
      window.location.protocol === "https:"
        ? `${import.meta.env.VITE_WEBSOCKET_ENDPOINT}`
        : "ws://localhost:3000"
    );

    ws.onopen = () => {
      console.log("Connected to WebSocket backend");
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type == "initial") {
          const newLog = msg.data;
          setLogs(newLog);
          setSummary(calculateSummary(newLog));
          console.log("Initial logs received via WebSocket:", newLog);
          return newLog;
        }

        if (msg.type == "update") {
          const newLog = msg.data;
          console.log("New log received via WebSocket:", newLog);
          setLogs((prev) =>
            Array.isArray(prev) ? [...prev, newLog] : [newLog]
          );

          setSummary((prev) => ({
            ...calculateSummary([newLog, ...logs]),
            totalVehicles: prev.totalVehicles + 1,
            overloadOverdimensionCount:
              newLog.status === "Overload" || newLog.status === "Overdimension"
                ? prev.overloadOverdimensionCount + 1
                : prev.overloadOverdimensionCount,
          }));
        }

        // How many vehicle in logs
        console.log("Total Vehicles:", logs.length);
        console.log("Current Summary:", summary);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    return () => {
      ws.close();
    };
  }, []);
  // // Simulate real-time updates
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // Simulate new log entry
  //     const newLog = {
  //       id: Date.now(),
  //       timestamp: new Date().toLocaleString(),
  //       gateId: `GATE-${String(Math.floor(Math.random() * 10) + 1).padStart(
  //         3,
  //         "0"
  //       )}`,
  //       vehicleId: `${String.fromCharCode(
  //         65 + Math.floor(Math.random() * 26)
  //       )}${String.fromCharCode(
  //         65 + Math.floor(Math.random() * 26)
  //       )}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${
  //         Math.floor(Math.random() * 900) + 100
  //       }`,
  //       dimensions: {
  //         length: (Math.random() * 10 + 10).toFixed(1),
  //         width: (Math.random() * 1 + 2).toFixed(1),
  //         height: (Math.random() * 1.5 + 2.5).toFixed(1),
  //       },
  //       weight: (Math.random() * 15 + 10).toFixed(1),
  //       status: ["OK", "Overload", "Overdimension"][
  //         Math.floor(Math.random() * 3)
  //       ],
  //       photos: ["/placeholder-meinv.png"],
  //       sensorReadings: {
  //         weightSensor: (Math.random() * 15 + 10).toFixed(1),
  //         heightSensor: (Math.random() * 1.5 + 2.5).toFixed(1),
  //         lengthSensor: (Math.random() * 10 + 10).toFixed(1),
  //         widthSensor: (Math.random() * 1 + 2).toFixed(1),
  //       },
  //     };

  //     setLogs((prev) => [newLog, ...prev.slice(0, 9)]);
  //     setSummary((prev) => ({
  //       ...prev,
  //       totalVehicles: prev.totalVehicles + 1,
  //       overloadOverdimensionCount:
  //         newLog.status === "Overload" || newLog.status === "Overdimension"
  //           ? prev.overloadOverdimensionCount + 1
  //           : prev.overloadOverdimensionCount,
  //     }));
  //   }, 10000); // Update every 10 seconds

  //   return () => clearInterval(interval);
  // }, []);

  const handleLogClick = (log) => {
    setSelectedLog(log);
  };

  const handleManualSubmit = (data) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      gateId: data.gateId,
      vehicleId: data.plateNumber,
      dimensions: {
        length: Number.parseFloat(data.length),
        width: Number.parseFloat(data.width),
        height: Number.parseFloat(data.height),
      },
      weight: Number.parseFloat(data.weight),
      status: "Manual Entry",
      photos: ["/placeholder-4xigo.png"],
      sensorReadings: {
        weightSensor: Number.parseFloat(data.weight),
        heightSensor: Number.parseFloat(data.height),
        lengthSensor: Number.parseFloat(data.length),
        widthSensor: Number.parseFloat(data.width),
      },
    };

    setLogs((prev) => [newLog, ...prev]);
    setShowManualInput(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation
        user={user}
        onLogout={onLogout}
        onManualInput={() => setShowManualInput(true)}
        onGateControl={() => setShowGateControl(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SummaryCards summary={summary} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <LogsTable logs={logs} onLogClick={handleLogClick} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <MapPlaceholder />
          </motion.div>
        </div>
      </main>

      {/* Modals */}
      {selectedLog && (
        <LogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}

      {showManualInput && (
        <ManualInputModal
          onClose={() => setShowManualInput(false)}
          onSubmit={handleManualSubmit}
        />
      )}

      {showGateControl && (
        <GateControlModal
          onClose={() => setShowGateControl(false)}
          userRole={user.role}
        />
      )}
    </div>
  );
};

Dashboard.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Dashboard;
