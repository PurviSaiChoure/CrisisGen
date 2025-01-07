import React from 'react';
import { motion } from 'framer-motion';

export const ActionPlan = () => {
  return (
    <div className="pt-16 min-h-screen p-4">
      <h1 className="text-3xl font-bold text-emerald-500 mb-6">Action Plan Generator</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 p-6 rounded-lg"
        >
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Input Details</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Disaster Type</label>
              <select className="input-field w-full">
                <option>Flood</option>
                <option>Earthquake</option>
                <option>Wildfire</option>
                <option>Hurricane</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <input type="text" className="input-field w-full" placeholder="Enter affected location" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Severity Level</label>
              <select className="input-field w-full">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full">Generate Plan</button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/50 p-6 rounded-lg"
        >
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Generated Plan</h2>
          <div className="space-y-4">
            <div className="border border-emerald-900/50 rounded-lg p-4">
              <h3 className="text-emerald-400 font-medium mb-2">Immediate Actions</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Evacuate affected areas</li>
                <li>Set up emergency shelters</li>
                <li>Deploy first responders</li>
              </ul>
            </div>
            <div className="border border-emerald-900/50 rounded-lg p-4">
              <h3 className="text-emerald-400 font-medium mb-2">Resource Allocation</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Medical supplies: 500 units</li>
                <li>Emergency food kits: 1000 units</li>
                <li>Temporary shelters: 50 units</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};