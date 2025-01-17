import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Search, Clock, Globe, AlertTriangle, 
  BookOpen, Download, Share2, Loader, ArrowRight, Users, Shield 
} from 'lucide-react';

interface SummaryFilters {
  disasterType: string;
  location: string;
  timeframe: string;
  scope: string;
  focus: string;
}

const API_URL = 'http://localhost:5000';

const disasterTypes = [
  { value: 'all', label: 'All Disasters', icon: AlertTriangle },
  { value: 'flood', label: 'Floods', icon: AlertTriangle },
  { value: 'earthquake', label: 'Earthquakes', icon: AlertTriangle },
  { value: 'wildfire', label: 'Wildfires', icon: AlertTriangle },
  { value: 'hurricane', label: 'Hurricanes', icon: AlertTriangle }
];

const timeframes = [
  { value: 'past_day', label: '24 Hours', icon: Clock },
  { value: 'past_week', label: 'Past Week', icon: Clock },
  { value: 'past_month', label: 'Past Month', icon: Clock },
  { value: 'past_year', label: 'Past Year', icon: Clock }
];

const scopes = [
  { value: 'local', label: 'Local', icon: Globe },
  { value: 'regional', label: 'Regional', icon: Globe },
  { value: 'national', label: 'National', icon: Globe },
  { value: 'global', label: 'Global', icon: Globe }
];

const focusAreas = [
  { value: 'impact', label: 'Impact Assessment', icon: AlertTriangle },
  { value: 'response', label: 'Response Efforts', icon: AlertTriangle },
  { value: 'recovery', label: 'Recovery Progress', icon: AlertTriangle },
  { value: 'lessons', label: 'Lessons Learned', icon: BookOpen }
];

// Add new interface for structured summary sections
interface StructuredSummary {
  overview: string;
  currentSituation: string;
  impactAssessment: string;
  responseEfforts: string;
  challenges: string;
  recommendations: string;
  sources: string[];
}

export const GenerateSummary = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [summaryFilters, setSummaryFilters] = useState<SummaryFilters>({
    disasterType: '',
    location: '',
    timeframe: '',
    scope: '',
    focus: ''
  });
  const [summary, setSummary] = useState<string>('');
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [structuredSummary, setStructuredSummary] = useState<StructuredSummary | null>(null);

  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      setServerStatus(response.ok ? 'online' : 'offline');
    } catch (error) {
      setServerStatus('offline');
    }
  };

  const handleGenerateSummary = async () => {
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

      if (response.ok && data.status === 'success') {
        setSummary(data.summary);
        // Parse the markdown summary into structured sections
        parseStructuredSummary(data.summary);
      } else {
        throw new Error(data.error || 'Failed to generate summary');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  // Add function to parse summary into sections
  const parseStructuredSummary = (markdownContent: string) => {
    // This is a simple parser, adjust based on your actual markdown structure
    const sections = markdownContent.split(/(?=# )/);
    const structured: StructuredSummary = {
      overview: sections.find(s => s.includes('Overview'))?.replace('# Overview', '').trim() || '',
      currentSituation: sections.find(s => s.includes('Current Situation'))?.replace('# Current Situation', '').trim() || '',
      impactAssessment: sections.find(s => s.includes('Impact Assessment'))?.replace('# Impact Assessment', '').trim() || '',
      responseEfforts: sections.find(s => s.includes('Response Efforts'))?.replace('# Response Efforts', '').trim() || '',
      challenges: sections.find(s => s.includes('Challenges'))?.replace('# Challenges', '').trim() || '',
      recommendations: sections.find(s => s.includes('Recommendations'))?.replace('# Recommendations', '').trim() || '',
      sources: sections.find(s => s.includes('Sources'))?.replace('# Sources', '').trim().split('\n') || [],
    };
    setStructuredSummary(structured);
  };

  const renderSectionButtons = (
    title: string,
    options: Array<{ value: string; label: string; icon: React.ElementType }>,
    stateKey: keyof SummaryFilters
  ) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-neutral-light">{title}</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSummaryFilters({ ...summaryFilters, [stateKey]: option.value })}
            className={`p-3 rounded-xl border transition-all duration-300 flex items-center space-x-2
              ${summaryFilters[stateKey] === option.value 
                ? 'bg-primary/20 border-primary-light text-primary-light' 
                : 'bg-white/5 border-white/10 text-neutral-light hover:bg-white/10'}`}
          >
            <option.icon className="w-4 h-4" />
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Add new component for rendering summary sections
  const renderSummarySection = (title: string, content: string, icon: React.ElementType, bgColor: string = 'bg-white/5') => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgColor} rounded-xl p-6 border border-white/10`}
    >
      <h3 className="text-xl font-heading font-semibold text-primary-light mb-4 flex items-center gap-2">
        {React.createElement(icon, { className: "w-5 h-5" })}
        {title}
      </h3>
      <div className="prose prose-invert max-w-none">
        {content.split('\n').map((paragraph, idx) => (
          <p key={idx} className="text-neutral-light leading-relaxed mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </motion.div>
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
            <h1 className="text-3xl font-heading font-bold text-primary-light">Disaster Summary Generator</h1>
            <p className="text-neutral-light mt-2">Generate comprehensive summaries of disaster situations and responses</p>
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
              <h2 className="text-2xl font-heading font-bold text-primary-light mb-6">Summary Parameters</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleGenerateSummary(); }} className="space-y-4">
                {renderSectionButtons('Disaster Type', disasterTypes, 'disasterType')}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-light">Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={summaryFilters.location}
                      onChange={(e) => setSummaryFilters({ ...summaryFilters, location: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-gray-300 focus:outline-none focus:border-primary-light"
                      placeholder="Enter location..."
                    />
                    <Globe className="w-5 h-5 text-neutral-light absolute left-3 top-3.5" />
                  </div>
                </div>

                {renderSectionButtons('Timeframe', timeframes, 'timeframe')}
                {renderSectionButtons('Geographic Scope', scopes, 'scope')}
                {renderSectionButtons('Focus Area', focusAreas, 'focus')}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full rounded-xl p-4 flex items-center justify-center space-x-3 transition-all duration-300
                    ${isLoading 
                      ? 'bg-neutral cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary-dark text-white'}`}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                      <span>Generating Summary...</span>
                    </div>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      <span>Generate Summary</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Summary Display */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 flex flex-col"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-heading font-bold text-primary-light">Generated Summary</h2>
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

              <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
                {structuredSummary ? (
                  <div className="space-y-6">
                    {renderSummarySection('Overview', structuredSummary.overview, FileText, 'bg-blue-500/10')}
                    {renderSummarySection('Current Situation', structuredSummary.currentSituation, AlertTriangle, 'bg-red-500/10')}
                    {renderSummarySection('Impact Assessment', structuredSummary.impactAssessment, Users, 'bg-yellow-500/10')}
                    {renderSummarySection('Response Efforts', structuredSummary.responseEfforts, Shield, 'bg-green-500/10')}
                    {renderSummarySection('Challenges', structuredSummary.challenges, AlertTriangle, 'bg-orange-500/10')}
                    {renderSummarySection('Recommendations', structuredSummary.recommendations, BookOpen, 'bg-purple-500/10')}
                    
                    {/* Sources Section */}
                    <div className="bg-gray-500/10 rounded-xl p-6 border border-white/10">
                      <h3 className="text-xl font-heading font-semibold text-primary-light mb-4 flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Sources
                      </h3>
                      <ul className="space-y-2">
                        {structuredSummary.sources.map((source, idx) => (
                          <li key={idx} className="text-neutral-light">
                            {source}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-neutral-light">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Generate a summary to see the analysis</p>
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

export default GenerateSummary;