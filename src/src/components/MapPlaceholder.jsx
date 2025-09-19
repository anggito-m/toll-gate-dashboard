"use client";
import { motion } from "framer-motion";

const MapPlaceholder = () => {
  // Gate dibuat seperti jalur tol horizontal
  const gates = [
    { id: "GATE-001", name: "Lane 1", status: "active" },
    { id: "GATE-002", name: "Lane 2", status: "active" },
    { id: "GATE-003", name: "Lane 3", status: "maintenance" },
    { id: "GATE-004", name: "Lane 4", status: "offline" },
  ];

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Toll Gate Layout
      </h3>

      <div className="relative bg-gray-100 rounded-lg h-80 overflow-hidden">
        {/* Road background */}
        <div className="absolute inset-0 bg-gray-300">
          <div className="absolute inset-y-0 left-0 right-0 m-auto h-1 bg-yellow-400"></div>
        </div>

        {/* Gates in horizontal row */}
        <div className="absolute inset-0 flex items-center justify-center space-x-6">
          {gates.map((gate, index) => (
            <motion.div
              key={gate.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group flex flex-col items-center"
            >
              {/* Gate building shape */}
              <div className="w-14 h-20 bg-white rounded-md shadow-md flex items-center justify-center">
                <div
                  className={`w-5 h-5 rounded-full border-2 border-white shadow-lg ${
                    gate.status === "active"
                      ? "bg-green-500"
                      : gate.status === "maintenance"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  <div
                    className={`absolute inset-0 rounded-full animate-ping ${
                      gate.status === "active"
                        ? "bg-green-400"
                        : gate.status === "maintenance"
                        ? "bg-yellow-400"
                        : "bg-red-400"
                    }`}
                  ></div>
                </div>
              </div>

              {/* Gate label */}
              <div className="mt-2 text-xs font-medium text-gray-700">
                {gate.name}
              </div>

              {/* Tooltip */}
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                <div className="font-medium">{gate.name}</div>
                <div className="text-gray-300">{gate.id}</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        {/* Legend */}
        <div className="absolute bottom-1 left-4 bg-white rounded-lg shadow-lg p-2">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Gate Status
          </h4>
          <div className="space-y-1">
            {Array.from(new Set(gates.map((g) => g.status))).map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 ${
                    status === "active"
                      ? "bg-green-500"
                      : status === "maintenance"
                      ? "bg-yellow-500"
                      : status === "offline"
                      ? "bg-red-500"
                      : "bg-gray-500"
                  } rounded-full`}
                ></div>
                <span className="text-xs text-gray-600">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPlaceholder;
