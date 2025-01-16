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
    setSummary('');

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

  const renderSummarySection = (section: string) => {
    const [title, ...content] = section.split('\n');
    const titleText = title.replace(/^#+\s+/, '');
    const headingLevel = (title.match(/^#+/) || [''])[0].length;
    
    const sectionStyle = headingLevel === 1 
      ? "bg-gray-800/50 rounded-xl p-8 border border-gray-700"
      : "pl-8 py-6";

    return (
      <div className={sectionStyle}>
        <h3 className={`font-heading font-bold mb-6 ${
          headingLevel === 1 ? 'text-3xl text-primary-light' : 'text-2xl text-gray-300'
        }`}>
          {titleText}
        </h3>
        <div className="prose prose-invert prose-lg max-w-none">
          {content.filter(Boolean).map((paragraph, idx) => {
            if (paragraph.startsWith('*')) {
              return (
                <ul key={idx} className="list-disc pl-8 mb-6 text-gray-300 text-lg">
                  <li className="mb-3">{paragraph.replace(/^\*\s+/, '')}</li>
                </ul>
              );
            }
            return (
              <p key={idx} className="mb-6 text-gray-300 text-lg leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSummaryContent = () => {
    if (!summary) return null;

    const sections = summary.split(/(?=^#\s+)/m);
    return (
      <div className="space-y-10">
        {sections.filter(Boolean).map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            {renderSummarySection(section)}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto space-y-8"
        >
          {/* Input Form */}
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 shadow-xl">
            <h1 className="text-4xl font-heading font-bold text-primary-light mb-8 text-center">
              Disaster Summary Generator
            </h1>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/20 text-red-200 rounded-xl border border-red-500/30"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Disaster Type</label>
                <select
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 focus:ring-2 focus:ring-primary-light/50 focus:border-primary-light transition-colors"
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
                <label className="block text-sm font-medium text-gray-300">Location</label>
                <input
                  type="text"
                  placeholder="Enter location (e.g., California, USA)"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 focus:ring-2 focus:ring-primary-light/50 focus:border-primary-light transition-colors"
                  value={summaryFilters.location}
                  onChange={(e) => setSummaryFilters({...summaryFilters, location: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Timeframe</label>
                <select
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 focus:ring-2 focus:ring-primary-light/50 focus:border-primary-light transition-colors"
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
                className={`group relative w-full overflow-hidden rounded-xl p-4 font-medium text-lg transition-all duration-300
                  ${isLoading ? 
                    'bg-gray-600 cursor-not-allowed' : 
                    'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                  }`}
              >
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                      <span>Generating Summary...</span>
                    </>
                  ) : (
                    <>
                      <span className="transform group-hover:scale-105 transition-transform duration-300">
                        Generate Summary
                      </span>
                    </>
                  )}
                </span>
                {!isLoading && (
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                )}
              </button>
            </div>
          </div>

          {/* Summary Display */}
          {summary && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800/30 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 shadow-xl"
            >
              <h2 className="text-3xl font-heading font-bold text-primary-light mb-8">
                Disaster Summary Report
              </h2>
              {renderSummaryContent()}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GenerateSummary;