import React from 'react'
import { motion } from 'framer-motion'

export default function DashboardMetrics() {
  return (
    <motion.div
      className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-2 rounded-lg bg-gradient-to-br from-agri-green-light/10 to-agri-green/5">
          <h3 className="text-xl font-bold text-agri-green-dark">12</h3>
          <p className="text-xs text-gray-600 mt-1 font-medium">Today's Orders</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-gradient-to-br from-agri-blue-light/10 to-agri-blue/5">
          <h3 className="text-xl font-bold text-agri-blue">45</h3>
          <p className="text-xs text-gray-600 mt-1 font-medium">Active Products</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-gradient-to-br from-agri-yellow-light/10 to-agri-yellow/5">
          <h3 className="text-xl font-bold text-agri-orange">₹25K</h3>
          <p className="text-xs text-gray-600 mt-1 font-medium">Revenue</p>
        </div>
      </div>
    </motion.div>
  );
}
