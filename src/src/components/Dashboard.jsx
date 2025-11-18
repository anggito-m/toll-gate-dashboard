"use client";

import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { motion, press } from "framer-motion";
import TopNavigation from "./TopNavigation";
import SummaryCards from "./SummaryCards";
import LogsTable from "./LogsTable";
import MapPlaceholder from "./MapPlaceholder";
import LogDetailModal from "./LogDetailModal";
import ManualInputModal from "./ManualInputModal";
import GateControlModal from "./GateControlModal";
import { getWebSocket } from "../../utils/ws.js";
import axios from "axios";
import dayjs from "dayjs";

const mockLogs = [];

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
    // pastikan log.status selalu berupa array
    const statuses =
      typeof log.status === "string"
        ? log.status.split(",") // ubah jadi array ['Overload', 'Overdimension']
        : [].concat(log.status || []);

    return statuses.includes("Overload") || statuses.includes("Overdimension");
  }).length;
  const durations = logs.map((log) => {
    const start = dayjs(log.waktu_mulai);
    const end = dayjs(log.waktu_selesai);
    return end.diff(start, "second"); // selisih dalam detik
  });

  // Hitung rata-ratas
  const total = durations.reduce((a, b) => a + b, 0);
  const avgProcessingTime = Math.round(total / durations.length * 100)/100;

  return {
    activeGates: new Set(logs.map((log) => log.gateId)).size,
    overloadOverdimensionCount,
    avgProcessingTime: avgProcessingTime > 0 ? `${avgProcessingTime}s` : "N/A",
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
  const wsRef = useRef(null);
  const reconnectRef = useRef({ timeoutId: null, interval: 1000 });

  // Connect to backend via WebSocket
  useEffect(() => {
    console.log("WebSocket useEffect MOUNTED");

    // jika sudah ada koneksi, jangan buat lagi
    if (wsRef.current) {
      console.log("WebSocket already exists, skipping creation");
      return;
    }

    const maxInterval = 10000;

    function connect() {
      console.log("🔌 Connecting to WebSocket...");

      const url =
        window.location.protocol === "https:"
          ? import.meta.env.VITE_WEBSOCKET_ENDPOINT
          : "ws://localhost:3000";

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("🟢 WebSocket connected");
        // reset reconnect interval
        reconnectRef.current.interval = 1000;
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === "initial") {
            // msg.data diharapkan array
            const initialLogs = Array.isArray(msg.data) ? msg.data : [msg.data];
            setLogs(initialLogs);
            setSummary(calculateSummary(initialLogs));
            console.log("Initial logs received via WebSocket:", initialLogs);
            return;
          }

          if (msg.type === "update") {
            const newLog = Array.isArray(msg.data) ? msg.data[0] : msg.data;

            if (!newLog) return;

            // gunakan functional update yang aman: pastikan prev array
            setLogs((prev) => {
              const prevArr = Array.isArray(prev) ? prev : [];

              // cegah duplicate berdasarkan id (atau properti unik lain)
              const exists = prevArr.some((r) => r.id === newLog.id);
              if (exists) {
                return prevArr;
              }

              const next = [...prevArr, newLog];

              // update summary segera berdasarkan next array
              setSummary(calculateSummary(next));

              return next;
            });
          }
        } catch (err) {
          console.error("WS JSON parse error:", err, "raw:", event.data);
        }
      };

      ws.onclose = (ev) => {
        console.warn("🔴 WebSocket disconnected:", ev.reason || ev.code);
        wsRef.current = null;
        attemptReconnect();
      };

      ws.onerror = (error) => {
        console.error("⚠️ WebSocket error:", error);
        // close socket to trigger onclose & reconnect logic
        try {
          ws.close();
        } catch (e) {
          /* ignore */
        }
      };
    }

    function attemptReconnect() {
      clearTimeout(reconnectRef.current.timeoutId);

      const wait = reconnectRef.current.interval;
      console.log(`Reconnecting in ${wait} ms...`);

      reconnectRef.current.timeoutId = setTimeout(() => {
        reconnectRef.current.interval = Math.min(
          Math.floor(reconnectRef.current.interval * 1.5),
          maxInterval
        );
        connect();
      }, wait);
    }

    // konek pertama kali
    connect();

    // cleanup saat unmount
    return () => {
      console.log("Cleanup: closing WS and clearing reconnect");
      clearTimeout(reconnectRef.current.timeoutId);
      if (wsRef.current) {
        try {
          wsRef.current.onopen = null;
          wsRef.current.onmessage = null;
          wsRef.current.onclose = null;
          wsRef.current.onerror = null;
          wsRef.current.close();
        } catch (e) {
          /* ignore */
        }
        wsRef.current = null;
      }
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

    // setLogs((prev) => [newLog, ...prev]);
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
          token={user.token}
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
