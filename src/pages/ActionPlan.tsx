import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, FileText, Download, Clock, Users, Shield, 
  ArrowRight, Loader, Share2, Building, MapPin, AlertCircle 
} from 'lucide-react';

interface ActionPlanForm {
  disasterType: string;
  location: string;
  severity: string;
  resources: string;
  population: string;
}

interface ActionPlanResponse {
  disaster_type: string;
  immediate_actions: string[];
  resource_mobilization: string[];
  long_term_measures: string[];
  stakeholders: string[];
  recommendations: string[];
}

const API_URL = 'http://localhost:5000';

const severityLevels = [
  { value: 'low', label: 'Low', color: 'bg-green-500/20 text-green-400' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500/20 text-yellow-400' },
  { value: 'high', label: 'High', color: 'bg-orange-500/20 text-orange-400' },
  { value: 'critical', label: 'Critical', color: 'bg-red-500/20 text-red-400' }
];

const disasterTypes = [
  { value: 'flood', label: 'Flood', icon: AlertCircle },
  { value: 'earthquake', label: 'Earthquake', icon: AlertTriangle },
  { value: 'wildfire', label: 'Wildfire', icon: AlertCircle },
  { value: 'hurricane', label: 'Hurricane', icon: AlertCircle },
  { value: 'tsunami', label: 'Tsunami', icon: AlertCircle },
  { value: 'drought', label: 'Drought', icon: AlertCircle },
  { value: 'landslide', label: 'Landslide', icon: AlertTriangle },
  { value: 'volcanic_eruption', label: 'Volcanic Eruption', icon: AlertTriangle }
];

export const ActionPlan = () => {
  const [formData, setFormData] = useState<ActionPlanForm>({
    disasterType: '',
    location: '',
    severity: '',
    resources: '',
    population: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [actionPlan, setActionPlan] = useState<ActionPlanResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkServer = async () => {
        try {
            const response = await fetch(`${API_URL}/health`);
            if (response.ok) {
                setServerStatus('online');
            } else {
                setServerStatus('offline');
            }
        } catch (error) {
            console.error('Server health check failed:', error);
            setServerStatus('offline');
        }
    };

    checkServer();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');

    try {
        console.log('Attempting to connect to server...'); // Debug log

        const requestData = {
            disasterType: formData.disasterType || 'Unknown disaster',
            location: formData.location || 'Unspecified location',
            severity: formData.severity || 'Medium',
            resources: formData.resources || 'Limited resources',
            population: formData.population || 'Unknown population'
        };

        console.log('Sending request with data:', requestData);

        const response = await fetch(`${API_URL}/generate-action-plan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response:', errorText);
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);

        if (data.status === 'success') {
            setActionPlan(data.action_plan);
            setError('');
        } else {
            throw new Error(data.error || 'Failed to generate action plan');
        }
    } catch (error) {
        console.error('Error details:', error);
        setError(error instanceof Error ? error.message : 'Failed to connect to the server');
    } finally {
        setIsGenerating(false);
    }
  };

  const renderPlanSection = (
    title: string, 
    items: string[], 
    icon: React.ElementType,
    bgColor: string = 'bg-white/5'
  ) => (
    <div className={`${bgColor} rounded-xl p-4 border border-white/10 hover:border-primary/30 transition-colors duration-300`}>
      <h3 className="text-lg font-heading font-semibold text-primary-light mb-4 flex items-center">
        {React.createElement(icon, { className: "w-5 h-5 mr-2" })}
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start space-x-3 text-neutral-light bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors duration-300"
          >
            <span className="w-2 h-2 mt-2 rounded-full bg-primary-light flex-shrink-0" />
            <span>{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );

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

          {serverStatus === 'offline' && (
            <div className="bg-red-500/10 text-red-200 p-4 rounded-xl border border-red-500/20 mb-4">
                Server appears to be offline. Please try again later.
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 text-red-200 p-4 rounded-xl border border-red-500/20"
            >
              {error}
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-heading font-bold text-primary-light mb-6">Plan Generator</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Disaster Type Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-light">Disaster Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {disasterTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, disasterType: type.value })}
                        className={`p-3 rounded-xl border transition-all duration-300 flex items-center space-x-2
                          ${formData.disasterType === type.value 
                            ? 'bg-primary/20 border-primary-light text-primary-light' 
                            : 'bg-white/5 border-white/10 text-neutral-light hover:bg-white/10'}`}
                      >
                        <type.icon className="w-4 h-4" />
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-light">Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-gray-300 focus:outline-none focus:border-primary-light"
                      placeholder="Enter affected location..."
                    />
                    <MapPin className="w-5 h-5 text-neutral-light absolute left-3 top-3.5" />
                  </div>
                </div>

                {/* Severity Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-light">Severity Level</label>
                  <div className="flex space-x-2">
                    {severityLevels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, severity: level.value })}
                        className={`flex-1 p-3 rounded-xl border transition-all duration-300
                          ${formData.severity === level.value 
                            ? `${level.color} border-current` 
                            : 'bg-white/5 border-white/10 text-neutral-light hover:bg-white/10'}`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resources Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-light">Available Resources</label>
                  <textarea
                    value={formData.resources}
                    onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 focus:outline-none focus:border-primary-light h-24"
                    placeholder="List available resources..."
                  />
                </div>

                {/* Population Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-light">Affected Population</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.population}
                      onChange={(e) => setFormData({ ...formData, population: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-gray-300 focus:outline-none focus:border-primary-light"
                      placeholder="Estimated number of people affected..."
                    />
                    <Users className="w-5 h-5 text-neutral-light absolute left-3 top-3.5" />
                  </div>
            </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className={`w-full rounded-xl p-4 flex items-center justify-center space-x-3 transition-all duration-300
                    ${isGenerating 
                      ? 'bg-neutral cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary-dark text-white'}`}
                >
                  {isGenerating ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                      <span>Generating Plan...</span>
            </div>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Generate Action Plan</span>
                    </>
                  )}
                </button>
          </form>
        </motion.div>

            {/* Action Plan Display */}
        <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 flex flex-col"
            >
              {/* Plan Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-heading font-bold text-primary-light">
                    {actionPlan ? actionPlan.disaster_type : 'Action Plan'}
                  </h2>
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors duration-300">
                      <Download className="w-5 h-5 text-primary-light" />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors duration-300">
                      <Share2 className="w-5 h-5 text-primary-light" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Plan Content */}
              <div className="p-6 space-y-6 flex-grow overflow-y-auto custom-scrollbar">
                {actionPlan ? (
                  <>
                    {renderPlanSection('Immediate Actions', actionPlan.immediate_actions, AlertTriangle, 'bg-red-500/10')}
                    {renderPlanSection('Resource Mobilization', actionPlan.resource_mobilization, Shield, 'bg-blue-500/10')}
                    {renderPlanSection('Long-term Measures', actionPlan.long_term_measures, Clock, 'bg-green-500/10')}
                    {renderPlanSection('Key Stakeholders', actionPlan.stakeholders, Users, 'bg-yellow-500/10')}
                    {renderPlanSection('Recommendations', actionPlan.recommendations, FileText, 'bg-purple-500/10')}
                  </>
                ) : (
                  <div className="text-center text-neutral-light">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Generate an action plan to see the response strategy</p>
            </div>
                )}
            </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};