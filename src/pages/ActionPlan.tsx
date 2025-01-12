import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, FileText, Download } from 'lucide-react';

interface ActionPlanForm {
  disasterType: string;
  location: string;
  severity: string;
  resources: string;
  population: string;
}

export const ActionPlan = () => {
  const [formData, setFormData] = useState<ActionPlanForm>({
    disasterType: '',
    location: '',
    severity: '',
    resources: '',
    population: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    // TODO: Implement action plan generation
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="pt-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h1 className="text-3xl font-heading font-bold text-primary-light">Action Plan Generator</h1>
            <p className="text-neutral-light mt-2">Generate detailed response plans for disaster situations</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-heading font-bold text-primary-light mb-6">Input Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-light">Disaster Type</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 focus:outline-none focus:border-primary-light"
                    value={formData.disasterType}
                    onChange={(e) => setFormData({...formData, disasterType: e.target.value})}
                  >
                    <option value="">Select Type</option>
                    <option value="flood">Flood</option>
                    <option value="earthquake">Earthquake</option>
                    <option value="wildfire">Wildfire</option>
                    <option value="hurricane">Hurricane</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-light">Location</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 focus:outline-none focus:border-primary-light"
                    placeholder="Enter affected location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-light">Severity Level</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 focus:outline-none focus:border-primary-light"
                    value={formData.severity}
                    onChange={(e) => setFormData({...formData, severity: e.target.value})}
                  >
                    <option value="">Select Severity</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-light">Available Resources</label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 focus:outline-none focus:border-primary-light h-24"
                    placeholder="List available resources..."
                    value={formData.resources}
                    onChange={(e) => setFormData({...formData, resources: e.target.value})}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className={`w-full rounded-xl p-4 flex items-center justify-center space-x-3 transition-all duration-300
                    ${isGenerating ? 
                      'bg-neutral cursor-not-allowed' : 
                      'bg-primary hover:bg-primary-dark text-white'
                    }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                      <span>Generating Plan...</span>
                    </div>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      <span>Generate Plan</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Generated Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading font-bold text-primary-light">Generated Plan</h2>
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors duration-300">
                  <Download className="w-5 h-5 text-primary-light" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-lg font-heading font-semibold text-primary-light mb-3">Immediate Actions</h3>
                  <ul className="space-y-3">
                    {['Evacuate affected areas', 'Set up emergency shelters', 'Deploy first responders'].map((action, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-neutral-light">
                        <AlertTriangle className="w-5 h-5 text-secondary-light flex-shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-lg font-heading font-semibold text-primary-light mb-3">Resource Allocation</h3>
                  <ul className="space-y-3">
                    {[
                      'Medical supplies: 500 units',
                      'Emergency food kits: 1000 units',
                      'Temporary shelters: 50 units'
                    ].map((resource, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-neutral-light">
                        <span className="block w-1.5 h-1.5 mt-2 rounded-full bg-primary-light flex-shrink-0" />
                        <span>{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};