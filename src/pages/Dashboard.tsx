import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  AlertTriangle, FileText, Send, Users, Clock, 
  Shield, Activity, BarChart3, ArrowUp, ArrowDown,
  MapPin, Building, Radio, Bell, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { FeatureCollection, Feature, Point } from 'geojson';
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  quick_stats: {
    active_disasters: { value: number; change: string; trend: string };
    response_teams: { value: number; change: string; trend: string };
    avg_response_time: { value: string; change: string; trend: string };
    resources_deployed: { value: string; change: string; trend: string };
  };
  disaster_types: Array<{ type: string; count: number }>;
  affected_regions: Array<{ region: string; count: number }>;
}

interface MapData {
  type: string;
  features: Feature<Point>[];
}

interface RecentAlert {
  title: string;
  location: string;
  type: string;
  time: string;
  icon: any;
  color: string;
}

interface ActivityData {
  date: string;
  responses: number;
  alerts: number;
}

const defaultIcon = icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<RecentAlert[]>([]);
  const [activeDisasters, setActiveDisasters] = useState<any[]>([]);
  const [popupInfo, setPopupInfo] = useState<Feature<Point> | null>(null);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);

  const mainActions = [
    { 
      title: "Generate Summary", 
      icon: FileText, 
      onClick: () => navigate('/generate-summary'),
      color: "bg-gradient-to-r from-blue-500/40 to-blue-600/40 hover:from-blue-500/60 hover:to-blue-600/60",
      borderColor: "border-blue-400/30",
      shadow: "shadow-blue-500/20"
    },
    { 
      title: "Create Action Plan", 
      icon: AlertTriangle, 
      onClick: () => navigate('/action-plan'),
      color: "bg-gradient-to-r from-purple-500/40 to-purple-600/40 hover:from-purple-500/60 hover:to-purple-600/60",
      borderColor: "border-purple-400/30",
      shadow: "shadow-purple-500/20"
    },
    { 
      title: "Send Alert", 
      icon: Send, 
      onClick: () => navigate('/communication'),
      color: "bg-gradient-to-r from-rose-500/40 to-rose-600/40 hover:from-rose-500/60 hover:to-rose-600/60",
      borderColor: "border-rose-400/30",
      shadow: "shadow-rose-500/20"
    }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [mapResponse, statsResponse, alertsResponse] = await Promise.all([
          fetch('http://localhost:5002/api/dashboard/map-data'),
          fetch('http://localhost:5002/api/dashboard/stats'),
          fetch('http://localhost:5002/api/dashboard/recent-alerts')
        ]);

        const mapData = await mapResponse.json();
        const statsData = await statsResponse.json();
        const alertsData = await alertsResponse.json();

        setMapData(mapData);
        setDashboardStats(statsData);
        setActiveDisasters(mapData.features.map((feature: any) => ({
          name: feature.properties.name,
          status: feature.properties.status,
          country: feature.properties.country,
          type: feature.properties.type
        })));
        
        // Transform alerts data to match RecentAlert interface
        setRecentAlerts(alertsData.alerts.map((alert: any) => ({
          title: alert.title,
          location: alert.location,
          type: alert.type,
          time: alert.time,
          icon: alert.type === 'Critical' ? Bell : Radio,
          color: alert.type === 'Critical' ? 'text-red-400' : 'text-blue-400'
        })));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 3600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/dashboard/activity');
        const data = await response.json();
        setActivityData(data.activity);
      } catch (error) {
        console.error('Error fetching activity data:', error);
      }
    };

    fetchActivityData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="pt-20 px-6 max-w-8xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          {/* Top Action Bar */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-heading font-bold text-primary-light">Disaster Response Dashboard</h1>
                <p className="text-neutral-light">Real-time monitoring and response management</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {mainActions.map((action, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={action.onClick}
                    className={`${action.color} text-white/90 px-6 py-3 rounded-xl 
                      flex items-center gap-2 transition-all duration-300 
                      hover:scale-105 active:scale-95 
                      backdrop-blur-md border ${action.borderColor}
                      shadow-lg ${action.shadow} hover:shadow-xl
                      hover:text-white`}
                  >
                    <action.icon className="w-5 h-5" />
                    <span className="font-medium">{action.title}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboardStats && Object.entries(dashboardStats.quick_stats).map(([key, stat], idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`backdrop-blur-lg rounded-2xl p-4 border border-white/10 
                    ${key.includes('active') ? 'bg-orange-500/10' : 
                      key.includes('teams') ? 'bg-blue-500/10' : 
                      key.includes('time') ? 'bg-green-500/10' : 'bg-purple-500/10'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-6 h-6 ${
                      key.includes('active') ? 'text-orange-400' :
                      key.includes('teams') ? 'text-blue-400' :
                      key.includes('time') ? 'text-green-400' : 'text-purple-400'
                    }`}>
                      {key.includes('active') ? <AlertTriangle /> :
                       key.includes('teams') ? <Users /> :
                       key.includes('time') ? <Clock /> : <Shield />}
                    </div>
                    <span className={`text-xs font-medium flex items-center gap-1 
                      ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-primary-light">{stat.value}</h3>
                  <p className="text-sm text-neutral-light mt-1">
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Map Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
            >
              <div className="p-4 border-b border-white/10">
                <h2 className="text-xl font-heading font-bold text-primary-light">Disaster Map</h2>
              </div>
              <div className="p-4">
                <div className="h-[500px] rounded-xl overflow-hidden">
                  <MapContainer
                    center={[20, 0]}
                    zoom={2}
                    style={{ height: '100%', width: '100%' }}
                    className="rounded-xl"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {mapData?.features.map((feature, index) => (
                      <Marker
                        key={index}
                        position={[
                          feature.geometry.coordinates[1],
                          feature.geometry.coordinates[0]
                        ]}
                        icon={defaultIcon}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-medium text-gray-900">
                                {feature.properties ? feature.properties.name : 'Unknown Name'}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {feature.properties ? feature.properties.type : 'Unknown Type'}
                            </p>
                            <p className="text-sm text-gray-600">
                                {feature.properties ? feature.properties.country : 'Unknown Country'}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </div>
            </motion.div>

            {/* Activity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-heading font-bold text-primary-light">Response Activity</h2>
                  <p className="text-sm text-neutral-light">Last 7 days of response operations</p>
                </div>
                <Activity className="w-5 h-5 text-primary-light" />
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={activityData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: 'rgba(255,255,255,0.5)' }}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: 'rgba(255,255,255,0.5)' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px'
                      }}
                      labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="responses"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                      name="Responses"
                    />
                    <Line
                      type="monotone"
                      dataKey="alerts"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: '#ef4444', strokeWidth: 2 }}
                      name="Alerts"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Active Disasters */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
            >
              <div className="p-4 border-b border-white/10">
                <h2 className="text-xl font-heading font-bold text-primary-light">Active Disasters</h2>
              </div>
              <div className="p-4 space-y-4">
                {activeDisasters.map((disaster, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-primary-light">{disaster.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        disaster.status === 'alert' ? 'bg-red-500/20 text-red-400' :
                        disaster.status === 'ongoing' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {disaster.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-neutral-light">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {disaster.country}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {disaster.type}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Alerts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
            >
              <div className="p-4 border-b border-white/10">
                <h2 className="text-xl font-heading font-bold text-primary-light">Recent Alerts</h2>
              </div>
              <div className="p-4 space-y-4">
                {recentAlerts?.map((alert: RecentAlert, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-4 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  >
                    <div className={`p-2 rounded-lg ${alert.color} bg-opacity-20`}>
                      <alert.icon className={`w-5 h-5 ${alert.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-primary-light">{alert.title}</h3>
                      <p className="text-sm text-neutral-light">{alert.location}</p>
                      <span className="text-xs text-neutral-light">{alert.time}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-light" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};