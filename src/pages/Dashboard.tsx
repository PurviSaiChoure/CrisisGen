import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Map from 'react-map-gl';
import { 
  AlertTriangle, FileText, Send, Users, Clock, 
  Shield, Activity, BarChart3, ArrowUp, ArrowDown,
  MapPin, Building, Radio, Bell, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const quickStats = [
  { 
    label: "Active Disasters",
    value: "12",
    change: "+2",
    trend: "up",
    icon: AlertTriangle,
    color: "text-orange-400",
    bg: "bg-orange-500/10"
  },
  { 
    label: "Response Teams",
    value: "45",
    change: "+5",
    trend: "up",
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  { 
    label: "Avg Response Time",
    value: "8.5m",
    change: "-2.3",
    trend: "down",
    icon: Clock,
    color: "text-green-400",
    bg: "bg-green-500/10"
  },
  { 
    label: "Resources Deployed",
    value: "1.2k",
    change: "+123",
    trend: "up",
    icon: Shield,
    color: "text-purple-400",
    bg: "bg-purple-500/10"
  }
];

const activeDisasters = [
  {
    name: "Flood in Southeast Asia",
    type: "Flood",
    severity: "Critical",
    location: "Vietnam, Cambodia",
    affectedPeople: "25,000+",
    timestamp: "2 hours ago",
    color: "bg-red-500/20 text-red-400"
  },
  {
    name: "Wildfire in California",
    type: "Fire",
    severity: "High",
    location: "Northern California, USA",
    affectedPeople: "12,000+",
    timestamp: "5 hours ago",
    color: "bg-orange-500/20 text-orange-400"
  },
  {
    name: "Earthquake in Japan",
    type: "Earthquake",
    severity: "Medium",
    location: "Osaka Region, Japan",
    affectedPeople: "8,000+",
    timestamp: "1 day ago",
    color: "bg-yellow-500/20 text-yellow-400"
  }
];

const recentAlerts = [
  {
    title: "Emergency Evacuation",
    location: "Coastal Region, Vietnam",
    type: "Critical",
    time: "10 minutes ago",
    icon: Bell,
    color: "text-red-400"
  },
  {
    title: "Resource Deployment",
    location: "Northern California",
    type: "Update",
    time: "25 minutes ago",
    icon: Send,
    color: "text-blue-400"
  },
  {
    title: "Situation Update",
    location: "Osaka, Japan",
    type: "Info",
    time: "1 hour ago",
    icon: Radio,
    color: "text-green-400"
  }
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedDisaster, setSelectedDisaster] = useState(null);

  const mainActions = [
    { 
      title: "Generate Summary", 
      icon: FileText, 
      onClick: () => navigate('/generate-summary'),
      color: "bg-gradient-to-r from-blue-500/80 to-blue-600/80 hover:from-blue-500/90 hover:to-blue-600/90",
      borderColor: "border-blue-400/20"
    },
    { 
      title: "Create Action Plan", 
      icon: AlertTriangle, 
      onClick: () => navigate('/action-plan'),
      color: "bg-gradient-to-r from-purple-500/80 to-purple-600/80 hover:from-purple-500/90 hover:to-purple-600/90",
      borderColor: "border-purple-400/20"
    },
    { 
      title: "Send Alert", 
      icon: Send, 
      onClick: () => navigate('/communication'),
      color: "bg-gradient-to-r from-rose-500/80 to-rose-600/80 hover:from-rose-500/90 hover:to-rose-600/90",
      borderColor: "border-rose-400/20"
    }
  ];

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
                    className={`${action.color} text-white px-6 py-3 rounded-xl 
                      flex items-center gap-2 transition-all duration-300 
                      hover:scale-105 active:scale-95 shadow-lg shadow-black/10
                      backdrop-blur-lg border ${action.borderColor}
                      hover:shadow-xl hover:shadow-black/20`}
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
              {quickStats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`${stat.bg} backdrop-blur-lg rounded-2xl p-4 border border-white/10`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    <span className={`text-xs font-medium flex items-center gap-1 ${
                      stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-primary-light">{stat.value}</h3>
                  <p className="text-sm text-neutral-light mt-1">{stat.label}</p>
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
              </div>
            </motion.div>

            {/* Activity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-heading font-bold text-primary-light">Response Activity</h2>
                <Activity className="w-5 h-5 text-primary-light" />
              </div>
              <div className="h-[200px] flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-neutral-light opacity-50" />
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
                      <span className={`px-2 py-1 rounded-full text-xs ${disaster.color}`}>
                        {disaster.severity}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-neutral-light">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {disaster.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {disaster.affectedPeople} affected
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {disaster.timestamp}
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
                {recentAlerts.map((alert, idx) => (
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