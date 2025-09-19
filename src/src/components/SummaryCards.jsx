"use client";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const SummaryCard = ({ title, value, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="card p-6"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div
        className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}
      >
        {icon}
      </div>
    </div>
  </motion.div>
);

const SummaryCards = ({ summary }) => {
  const cards = [
    {
      title: "Active Gates",
      value: summary.activeGates,
      color: "bg-blue-100",
      icon: (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 7h-8v6h8V7zm-2 4h-4V9h4v2zm4-4v10c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2zm-2 0H5v10h14V7z" />
        </svg>
      ),
    },
    {
      title: "Overload and Overdimension Alerts",
      value: summary.overloadOverdimensionCount,
      color: "bg-red-100",
      icon: (
        <svg
          className="w-6 h-6 text-red-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
      ),
    },
    {
      title: "Avg Processing Time",
      value: summary.avgProcessingTime,
      color: "bg-green-100",
      icon: (
        <svg
          className="w-6 h-6 text-green-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
          <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
        </svg>
      ),
    },
    {
      title: "Total Vehicles",
      value: summary.totalVehicles,
      color: "bg-purple-100",
      icon: (
        <svg
          className="w-6 h-6 text-purple-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <SummaryCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
};

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
  delay: PropTypes.number.isRequired,
};

SummaryCards.propTypes = {
  summary: PropTypes.shape({
    activeGates: PropTypes.number.isRequired,
    overloadOverdimensionCount: PropTypes.number.isRequired,
    avgProcessingTime: PropTypes.string.isRequired,
    totalVehicles: PropTypes.number.isRequired,
  }).isRequired,
};

export default SummaryCards;
