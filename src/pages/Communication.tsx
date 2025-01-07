import React from 'react';
import { motion } from 'framer-motion';

export const Communication = () => {
  return (
    <div className="pt-16 min-h-screen p-4">
      <h1 className="text-3xl font-bold text-emerald-500 mb-6">Communication Templates</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 p-6 rounded-lg"
        >
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Template Generator</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message Type</label>
              <select className="input-field w-full">
                <option>Emergency Alert</option>
                <option>Evacuation Notice</option>
                <option>Status Update</option>
                <option>Resource Request</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Target Audience</label>
              <select className="input-field w-full">
                <option>General Public</option>
                <option>Emergency Services</option>
                <option>NGOs</option>
                <option>Government Officials</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Key Details</label>
              <textarea className="input-field w-full h-32" placeholder="Enter specific details to include"></textarea>
            </div>
            <button type="submit" className="btn-primary w-full">Generate Template</button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/50 p-6 rounded-lg"
        >
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Generated Message</h2>
          <div className="space-y-4">
            <div className="border border-emerald-900/50 rounded-lg p-4">
              <h3 className="text-emerald-400 font-medium mb-2">Preview</h3>
              <p className="text-gray-300">
                EMERGENCY ALERT: Flash flood warning in effect for [Location]. Immediate evacuation required for all residents in [Affected Areas]. Emergency shelters are available at [Shelter Locations]. For assistance, call [Emergency Number].
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="btn-primary flex-1">Send Email</button>
              <button className="btn-primary flex-1">Send SMS</button>
              <button className="btn-primary flex-1">Download</button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};