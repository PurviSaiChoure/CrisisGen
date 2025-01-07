import React from 'react';
import { motion } from 'framer-motion';
import Map from 'react-map-gl';
import { AlertTriangle, FileText, Send } from 'lucide-react';

export const Dashboard = () => {
  return (
    <div className="pt-16 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 card"
        >
          <h2 className="text-2xl font-bold text-blue-500 mb-4 font-heading">Active Disasters</h2>
          <div className="space-y-4">
            {[
              { name: 'Flood in Southeast Asia', severity: 'High', type: 'Flood' },
              { name: 'Wildfire in California', severity: 'Critical', type: 'Fire' },
              { name: 'Earthquake in Japan', severity: 'Medium', type: 'Earthquake' }
            ].map((disaster, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glassmorphism p-4 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-blue-400 font-semibold font-heading">{disaster.name}</h3>
                    <p className="text-gray-400 text-sm">Type: {disaster.type}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    disaster.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                    disaster.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {disaster.severity}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card h-[400px]"
          >
            <h2 className="text-2xl font-bold text-blue-500 mb-4 font-heading">Disaster Map</h2>
            <Map
              initialViewState={{
                longitude: -100,
                latitude: 40,
                zoom: 3.5
              }}
              style={{width: '100%', height: '300px'}}
              mapStyle="mapbox://styles/mapbox/dark-v11"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h2 className="text-2xl font-bold text-blue-500 mb-4 font-heading">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="btn-primary flex items-center justify-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Generate Summary</span>
              </button>
              <button className="btn-warning flex items-center justify-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Create Action Plan</span>
              </button>
              <button className="btn-success flex items-center justify-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Send Alert</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};