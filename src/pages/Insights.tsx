import React from 'react';
import { motion } from 'framer-motion';

export const Insights = () => {
  return (
    <div className="pt-16 min-h-screen p-4">
      <h1 className="text-3xl font-bold text-emerald-500 mb-6">Insights & Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-black/50 p-6 rounded-lg"
        >
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Disaster Trends</h2>
          <div className="h-64 flex items-center justify-center border border-emerald-900/50 rounded-lg">
            <p className="text-gray-400">Chart Placeholder</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/50 p-6 rounded-lg"
        >
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="border border-emerald-900/50 rounded-lg p-4">
              <p className="text-sm text-gray-400">Active Disasters</p>
              <p className="text-2xl font-bold text-emerald-500">12</p>
            </div>
            <div className="border border-emerald-900/50 rounded-lg p-4">
              <p className="text-sm text-gray-400">People Affected</p>
              <p className="text-2xl font-bold text-emerald-500">25,430</p>
            </div>
            <div className="border border-emerald-900/50 rounded-lg p-4">
              <p className="text-sm text-gray-400">Response Time</p>
              <p className="text-2xl font-bold text-emerald-500">45 min</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};