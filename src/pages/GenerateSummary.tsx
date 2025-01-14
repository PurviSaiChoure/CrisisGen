import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SummaryFilters {
  disasterType: string;
  location: string;
  timeframe: string;
}

const API_URL = 'http://127.0.0.1:5000';

export const GenerateSummary = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [summaryFilters, setSummaryFilters] = useState<SummaryFilters>({
    disasterType: '',
    location: '',
    timeframe: ''
  });
  const [summary, setSummary] = useState<string>('');

  const handleGenerateSummary = async () => {
    if (!summaryFilters.disasterType) {
      setError('Please select a disaster type');
      return;
    }

    setIsLoading(true);
    setError('');
    setSummary('');  // Clear previous summary

    try {
      const response = await fetch(`${API_URL}/generate-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(summaryFilters),
      });

      const data = await response.json();

      if (data.status === 'success' && data.summary) {
        setSummary(data.summary);
      } else {
        setError(data.error || 'Failed to generate summary');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSummaryContent = () => {
    if (!summary) return null;

    const sections = summary.split(/(?=#\s+)/); // Split on markdown headers

    return (
      <div className="mt-8 space-y-6">
        {sections.map((section, idx) => {
          const [title, ...content] = section.split('\n');
          return (
            <div key={idx} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-heading font-bold text-primary-light mb-4">
                {title.replace(/^#\s+/, '')}
              </h3>
              <div className="prose prose-invert max-w-none">
                {content.map((paragraph, pIdx) => (
                  <p key={pIdx} className="text-gray-300 whitespace-pre-wrap">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h1 className="text-3xl font-heading font-bold text-primary-light mb-8 text-center">
              Generate Disaster Summary
            </h1>

            {error && (
              <div className="mb-6 p-4 bg-secondary/20 text-secondary-light rounded-xl border border-secondary/30">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-light">Disaster Type</label>
                <select
                  className="w-full input-field"
                  value={summaryFilters.disasterType}
                  onChange={(e) => setSummaryFilters({...summaryFilters, disasterType: e.target.value})}
                >
                  <option value="">Select Disaster Type</option>
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
                  placeholder="Enter location"
                  className="w-full input-field"
                  value={summaryFilters.location}
                  onChange={(e) => setSummaryFilters({...summaryFilters, location: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-light">Timeframe</label>
                <select
                  className="w-full input-field"
                  value={summaryFilters.timeframe}
                  onChange={(e) => setSummaryFilters({...summaryFilters, timeframe: e.target.value})}
                >
                  <option value="">Select Timeframe</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>

              <button 
                onClick={handleGenerateSummary}
                disabled={isLoading}
                className={`w-full rounded-xl p-4 flex items-center justify-center space-x-3 transition-all duration-300
                  ${isLoading ? 
                    'bg-neutral cursor-not-allowed' : 
                    'bg-primary hover:bg-primary-dark text-white'
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                    <span>Generating Summary...</span>
                  </div>
                ) : (
                  <span>Generate Summary</span>
                )}
              </button>
            </div>
          </div>

          {/* Summary Display */}
          {summary && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
            >
              <h2 className="text-2xl font-heading font-bold text-primary-light mb-6">
                Generated Summary
              </h2>
              {renderSummaryContent()}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
