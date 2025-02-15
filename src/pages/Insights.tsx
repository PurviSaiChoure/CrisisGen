import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Users, AlertTriangle, Clock, Globe, Activity, AlertCircle, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// Update interfaces to match actual API response
interface DisasterTrend {
  month: string;
  count: number;
}

interface DisasterType {
  type: string;
  count: number;
}

interface RegionalData {
  region: string;
  disasters: number;
}

interface StatusDistribution {
  status: string;
  count: number;
}

interface TimelineEvent {
  name: string;
  date: string;
  type: string;
  country: string;
}

interface DisasterDetail {
  name: string;
  type: string;
  country: string;
  status: string;
  description: string;
  date: string;
  url?: string;
  sources?: string[];
  primary_country?: string;
  glide?: string;
  vulnerable_groups?: string[];
  severity?: string;
}

interface InsightsData {
  disaster_data: {
    monthly_trends: DisasterTrend[];
    type_distribution: DisasterType[];
    regional_data: RegionalData[];
    status_distribution: StatusDistribution[];
    severity_timeline: TimelineEvent[];
    disaster_details: DisasterDetail[];
  };
  quick_stats: {
    active_disasters: { value: number; change: number; trend: string };
    people_affected: { value: number; change: number; trend: string };
    avg_response_time: { value: number; change: number; trend: string };
  };
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const Insights = () => {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(3600000); // 1 hour
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedFilter, setSelectedFilter] = useState<{
    type: string | null;
    region: string | null;
    status: string | null;
  }>({
    type: null,
    region: null,
    status: null
  });
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const fetchInsightsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/insights');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.status === 'success' && result.data) {
        setData(result.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(result.message || 'Failed to fetch insights data');
      }
    } catch (err) {
      console.error('Error fetching insights:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchInsightsData();
  }, []);

  // Set up periodic refresh
  useEffect(() => {
    const interval = setInterval(fetchInsightsData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Filter data based on selection
  const getFilteredData = (data: InsightsData) => {
    let filteredDisasters = data.disaster_data.disaster_details;

    if (selectedFilter.type) {
      filteredDisasters = filteredDisasters.filter(d => d.type === selectedFilter.type);
    }
    if (selectedFilter.region) {
      filteredDisasters = filteredDisasters.filter(d => d.country === selectedFilter.region);
    }
    if (selectedFilter.status) {
      filteredDisasters = filteredDisasters.filter(d => d.status === selectedFilter.status);
    }

    return {
      ...data,
      disaster_data: {
        disaster_details: filteredDisasters
      }
    };
  };

  // Loading state with better UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-light">Loading insights data...</p>
        </div>
      </div>
    );
  }

  // Error state with retry button
  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button 
            onClick={fetchInsightsData}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => console.error("Error caught by Boundary:", error, info.componentStack)}
      onReset={() => {
        setError(null);
        fetchInsightsData();
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header with Latest Disasters Carousel */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Latest Disaster Events</h1>
                <div className="text-sm text-gray-400">
                  Last Updated: {lastUpdated.toLocaleString()}
                </div>
              </div>
              
              <div className="relative">
                <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-4 pb-4">
                  {(() => {
                    const filteredData = getFilteredData(data);
                    return filteredData.disaster_data.disaster_details.map((disaster, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`flex-shrink-0 snap-center w-96 bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-400/30 transition-all duration-300 ${
                          expandedCard === idx ? 'h-auto' : 'h-[280px]'
                        }`}
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              disaster.status === 'ongoing' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {disaster.status}
                            </span>
                            <span className="text-sm text-gray-400">
                              {new Date(disaster.date).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-medium text-white mb-2">{disaster.name}</h3>
                          
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                              {disaster.type}
                            </span>
                            <span className="flex items-center text-sm text-gray-400">
                              <Globe className="w-4 h-4 mr-1" />
                              {disaster.country}
                            </span>
                          </div>
                          
                          <div className={`text-sm text-gray-300 ${expandedCard === idx ? '' : 'line-clamp-3'}`}>
                            {disaster.description}
                          </div>
                          
                          <div className="mt-auto pt-4">
                            <div className="flex items-center justify-between">
                              {disaster.sources && disaster.sources.length > 0 && (
                                <div className="text-xs text-gray-400">
                                  Source: {disaster.sources[0].substring(0, 30)}...
                                </div>
                              )}
                              
                              <button
                                onClick={() => setExpandedCard(expandedCard === idx ? null : idx)}
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center"
                              >
                                {expandedCard === idx ? (
                                  <>Show Less <ArrowUpRight className="w-4 h-4 ml-1 rotate-180" /></>
                                ) : (
                                  <>Read More <ArrowUpRight className="w-4 h-4 ml-1" /></>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ));
                  })()}
                </div>
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-gray-900 to-transparent w-8" />
                <div className="absolute inset-y-0 right-0 bg-gradient-to-l from-gray-900 to-transparent w-8" />
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* People Affected Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-blue-400/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider">People Affected</p>
                    <h3 className="text-3xl font-bold text-white mt-2">
                      {data.quick_stats.people_affected.value.toLocaleString()}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-lg ${data.quick_stats.people_affected.trend === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <span className={`text-sm ${data.quick_stats.people_affected.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {data.quick_stats.people_affected.trend === 'up' ? '↑' : '↓'} {data.quick_stats.people_affected.change}%
                  </span>
                  <span className="text-sm text-gray-400">vs last month</span>
          </div>
        </motion.div>

              {/* Response Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-blue-400/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-yellow-400" />
                    <span>Response Status</span>
                  </h2>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.disaster_data.status_distribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="count"
                        nameKey="status"
                      >
                        {data.disaster_data.status_distribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(17, 24, 39, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend
                        formatter={(value) => <span className="text-gray-300">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span>Monthly Disaster Trends</span>
                  </h2>
                  <div className="text-gray-400 text-sm">Last 12 months</div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.disaster_data.monthly_trends}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: '#9CA3AF' }}
                        strokeOpacity={0}
                      />
                      <YAxis
                        tick={{ fill: '#9CA3AF' }}
                        strokeOpacity={0}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(17, 24, 39, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          backdropFilter: 'blur(12px)'
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                        name="Disaster Count"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Disaster Type Distribution */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <PieChartIcon className="w-5 h-5 text-purple-400" />
                    <span>Disaster Type Distribution</span>
                  </h2>
                  <div className="text-gray-400 text-sm">Click to filter</div>
                </div>
                <div className="h-64 flex">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.disaster_data.type_distribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="count"
                        nameKey="type"
                        onClick={(entry) => setSelectedFilter(prev => ({
                          ...prev,
                          type: entry.type === selectedFilter.type ? null : entry.type
                        }))}
                      >
                        {data.disaster_data.type_distribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.type === selectedFilter.type ? '#EF4444' : COLORS[index % COLORS.length]}
                            className="cursor-pointer transition-all duration-300"
                          />
                        ))}
                      </Pie>
                      <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        formatter={(value) => <span className="text-gray-300">{value}</span>}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(17, 24, 39, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          backdropFilter: 'blur(12px)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Regional Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-green-400" />
                  <span>Regional Impact</span>
                </h2>
                <div className="text-gray-400 text-sm">Click regions to filter</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {data.disaster_data.regional_data.map((region, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedFilter(prev => ({
                      ...prev,
                      region: region.region === selectedFilter.region ? null : region.region
                    }))}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      region.region === selectedFilter.region 
                        ? 'bg-blue-500/20 border border-blue-400/50'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">{region.region}</span>
                      <span className="text-white font-semibold">{region.disasters}</span>
                    </div>
                    <div className="mt-2 h-1 bg-gray-700 rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                        style={{ width: `${(region.disasters / Math.max(...data.disaster_data.regional_data.map(r => r.disasters))) * 100}%` }}
                      />
            </div>
          </div>
                ))}
              </div>
            </motion.div>

            {/* Active Filters */}
            {(selectedFilter.type || selectedFilter.region || selectedFilter.status) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-3 items-center p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <span className="text-gray-400 text-sm">Active filters:</span>
                {selectedFilter.type && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-blue-500/20 rounded-full">
                    <span className="text-blue-400 text-sm">Type: {selectedFilter.type}</span>
                    <button
                      onClick={() => setSelectedFilter(prev => ({ ...prev, type: null }))}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      ×
                    </button>
                  </div>
                )}
                {selectedFilter.region && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-purple-500/20 rounded-full">
                    <span className="text-purple-400 text-sm">Region: {selectedFilter.region}</span>
                    <button
                      onClick={() => setSelectedFilter(prev => ({ ...prev, region: null }))}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      ×
                    </button>
                  </div>
                )}
                {selectedFilter.status && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-full">
                    <span className="text-green-400 text-sm">Status: {selectedFilter.status}</span>
                    <button
                      onClick={() => setSelectedFilter(prev => ({ ...prev, status: null }))}
                      className="text-green-400 hover:text-green-300"
                    >
                      ×
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setSelectedFilter({ type: null, region: null, status: null })}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Clear all
                </button>
              </motion.div>
            )}
        </motion.div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="text-center p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
        <h2 className="text-xl font-bold text-red-400 mb-4">Something went wrong:</h2>
        <p className="text-neutral-light mb-4">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl transition-colors duration-300"
        >
          Try again
        </button>
      </div>
    </div>
  );
};