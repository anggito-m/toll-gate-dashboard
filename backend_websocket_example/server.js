// server.js
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Function to generate random log
function generateLog() {
  const newLog = {
    id: Date.now(),
    timestamp: new Date().toLocaleString(),
    gateId: `GATE-${String(Math.floor(Math.random() * 10) + 1).padStart(
      3,
      "0"
    )}`,
    vehicleId: `${String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
    )}${String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
    )}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${
      Math.floor(Math.random() * 900) + 100
    }`,
    dimensions: {
      length: (Math.random() * 10 + 10).toFixed(1),
      width: (Math.random() * 1 + 2).toFixed(1),
      height: (Math.random() * 1.5 + 2.5).toFixed(1),
    },
    weight: (Math.random() * 15 + 10).toFixed(1),
    status: getRandomArray(["OK", "Overload", "Overdimension"]),
    photos: ["/placeholder-meinv.png"],
    sensorReadings: {
      weightSensor: (Math.random() * 15 + 10).toFixed(1),
      heightSensor: (Math.random() * 1.5 + 2.5).toFixed(1),
      lengthSensor: (Math.random() * 10 + 10).toFixed(1),
      widthSensor: (Math.random() * 1 + 2).toFixed(1),
    },
  };

  return newLog;
}

// WebSocket connection
wss.on("connection", (ws) => {
  console.log("Client connected!");

  // Send initial mock logs
  const initialLogs = [
    {
      id: 1,
      timestamp: "2024-01-15 14:30:25",
      gateId: "GATE-001",
      vehicleId: "ABC-123",
      dimensions: { length: 12.5, width: 2.5, height: 3.2 },
      weight: 15.5,
      status: ["OK"],
      photos: ["/truck-front-view.jpg"],
      sensorReadings: {
        weightSensor: 15.5,
        heightSensor: 3.2,
        lengthSensor: 12.5,
        widthSensor: 2.5,
      },
    },
    {
      id: 2,
      timestamp: "2024-01-15 14:28:15",
      gateId: "GATE-002",
      vehicleId: "XYZ-789",
      dimensions: { length: 18.2, width: 2.8, height: 4.1 },
      weight: 25.8,
      status: ["Overload"],
      photos: ["/overloaded-truck.jpg"],
      sensorReadings: {
        weightSensor: 25.8,
        heightSensor: 4.1,
        lengthSensor: 18.2,
        widthSensor: 2.8,
      },
    },
    {
      id: 3,
      timestamp: "2024-01-15 14:25:45",
      gateId: "GATE-003",
      vehicleId: "DEF-456",
      dimensions: { length: 22.0, width: 3.5, height: 3.8 },
      weight: 18.2,
      status: ["Overdimension", "Overload"],
      photos: ["/oversized-truck.jpg"],
      sensorReadings: {
        weightSensor: 18.2,
        heightSensor: 3.8,
        lengthSensor: 22.0,
        widthSensor: 3.5,
      },
    },
  ];

  ws.send(JSON.stringify({ type: "initial", data: initialLogs }));

  // Every 10s generate a new log and broadcast it
  const interval = setInterval(() => {
    const newLog = generateLog();
    ws.send(JSON.stringify({ type: "update", data: newLog }));
  }, 10000);

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

// HTTP route
app.get("/", (req, res) => {
  res.send("WebSocket mock logs server running 🚀");
});

server.listen(3000, () =>
  console.log("Server listening on http://localhost:3000")
);

function getRandomArray(items) {
  const singleOrDouble = Math.random() < 0.5 ? "single" : "double"; // 50:50

  if (singleOrDouble === "single") {
    // ---- 1 item bebas ----
    const rand = items[Math.floor(Math.random() * items.length)];
    return [rand];
  } else {
    // ---- 2 item hanya makan & minum ----
    const allowed = items.filter((i) => i !== "OK");
    //    acak urutannya
    return Math.random() < 0.5 ? allowed : [...allowed].reverse();
  }
}
