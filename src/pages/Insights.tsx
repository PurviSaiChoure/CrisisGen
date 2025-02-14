import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Users, AlertTriangle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const Insights = () => {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(30000); // 30 seconds

  const fetchInsightsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/insights');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result); // Debug log
      
      if (result.status === 'success' && result.data) {
        setData(result.data);
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="pt-20 px-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h1 className="text-3xl font-heading font-bold text-primary-light">
                <Users className="inline-block" /> User Insights
              </h1>
              <p className="text-neutral-light mt-2">Comprehensive analysis of disaster response data</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(data.quick_stats).map(([key, stat], idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-neutral-light text-sm">{key.replace(/_/g, ' ').toUpperCase()}</p>
                      <h3 className="text-3xl font-bold text-primary-light mt-1">{stat.value}</h3>
                      <p className={`text-xs ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'} mt-2`}>
                        {stat.change} {stat.trend === 'up' ? '↑' : '↓'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-heading font-bold text-primary-light">Monthly Trends</h2>
                  <TrendingUp className="w-6 h-6 text-primary-light" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.disaster_data.monthly_trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" name="Disasters" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Disaster Type Distribution */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-heading font-bold text-primary-light">Disaster Types</h2>
                  <PieChartIcon className="w-6 h-6 text-primary-light" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.disaster_data.type_distribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="type"
                        label={({ type, value }) => `${type}: ${value}`}
                      >
                        {data.disaster_data.type_distribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Regional Data */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-heading font-bold text-primary-light mb-6">Regional Distribution</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.disaster_data.regional_data.map((region, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-4">
                    <p className="text-sm text-neutral-light">{region.region}</p>
                    <p className="text-2xl font-bold text-primary-light mt-1">{region.disasters}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Status Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-heading font-bold text-primary-light mb-6">Status Distribution</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.disaster_data.status_distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="status"
                      label={({ status, value }) => `${status}: ${value}`}
                    >
                      {data.disaster_data.status_distribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Recent Disasters Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-heading font-bold text-primary-light mb-6">Recent Disasters Timeline</h2>
              <div className="space-y-4">
                {data.disaster_data.severity_timeline.map((event, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-4 flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-light">{event.name}</h3>
                      <p className="text-sm text-neutral-light">
                        {new Date(event.date).toLocaleDateString()} - {event.type} in {event.country}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Latest Disaster Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-heading font-bold text-primary-light mb-6">Latest Disasters</h2>
              <div className="space-y-4">
                {data.disaster_data.disaster_details.map((disaster, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-primary-light">{disaster.name}</h3>
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary-light">
                        {disaster.status}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-light mb-2">
                      {disaster.type} in {disaster.country}
                    </p>
                    <p className="text-sm text-neutral-light line-clamp-2">
                      {disaster.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <div>
              <h1>
                <AlertTriangle className="inline-block" /> Alert Information
              </h1>
            </div>
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