"use client"
import { motion } from "framer-motion"

const MapPlaceholder = () => {
  const gates = [
    { id: "GATE-001", name: "North Gate", status: "active", x: 20, y: 30 },
    { id: "GATE-002", name: "South Gate", status: "active", x: 80, y: 70 },
    { id: "GATE-003", name: "East Gate", status: "maintenance", x: 70, y: 20 },
    { id: "GATE-004", name: "West Gate", status: "active", x: 30, y: 80 },
  ]

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Gate Locations</h3>

      <div className="relative bg-gray-100 rounded-lg h-80 overflow-hidden">
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#374151" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Roads */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 0 50 L 100 50" stroke="#6B7280" strokeWidth="2" opacity="0.6" />
          <path d="M 50 0 L 50 100" stroke="#6B7280" strokeWidth="2" opacity="0.6" />
        </svg>

        {/* Gate Markers */}
        {gates.map((gate, index) => (
          <motion.div
            key={gate.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${gate.x}%`, top: `${gate.y}%` }}
          >
            <div className="relative group">
              <div
                className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
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

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                <div className="font-medium">{gate.name}</div>
                <div className="text-gray-300">{gate.id}</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Gate Status</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Maintenance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Offline</span>
            </div>
          </div>
        </div>

        {/* Placeholder Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <p className="text-sm font-medium">Interactive Map</p>
            <p className="text-xs">Gate monitoring locations</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapPlaceholder
