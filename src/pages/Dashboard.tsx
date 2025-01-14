import React from 'react';
import { motion } from 'framer-motion';
import Map from 'react-map-gl';
import { AlertTriangle, FileText, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();

  const handleGenerateSummary = () => {
    navigate('/generate-summary');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="pt-20 px-6 max-w-8xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-heading font-bold text-primary-light mb-6">
                Active Disasters
              </h2>
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
                    className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-primary-light font-medium">{disaster.name}</h3>
                        <p className="text-neutral-light text-sm mt-1">Type: {disaster.type}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        disaster.severity === 'Critical' ? 'bg-secondary/20 text-secondary-light' :
                        disaster.severity === 'High' ? 'bg-secondary-dark/20 text-secondary' :
                        'bg-neutral/20 text-neutral-light'
                      }`}>
                        {disaster.severity}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-heading font-bold text-primary-light mb-6">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button 
                  onClick={handleGenerateSummary}
                  className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl p-4 flex items-center justify-center space-x-3 transition-colors duration-300"
                >
                  <AlertTriangle className="w-5 h-5" />
                  <span>Generate Summary</span>
                </button>
                <button className="w-full bg-secondary hover:bg-secondary-dark text-white rounded-xl p-4 flex items-center justify-center space-x-3 transition-colors duration-300">
                  <FileText className="w-5 h-5" />
                  <span>Create Action Plan</span>
                </button>
                <button className="w-full bg-success hover:bg-success-dark text-white rounded-xl p-4 flex items-center justify-center space-x-3 transition-colors duration-300">
                  <Send className="w-5 h-5" />
                  <span>Send Alert</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Main Content - Map */}
          <div className="lg:col-span-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-heading font-bold text-primary-light mb-6">
                Disaster Map
              </h2>
              <div className="h-[600px] rounded-xl overflow-hidden">
                <Map
                  initialViewState={{
                    longitude: -100,
                    latitude: 40,
                    zoom: 3.5
                  }}
                  style={{width: '100%', height: '100%'}}
                  mapStyle="mapbox://styles/mapbox/dark-v11"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};