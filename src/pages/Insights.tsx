import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Users, AlertTriangle, Clock } from 'lucide-react';

export const Insights = () => {
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
            <h1 className="text-3xl font-heading font-bold text-primary-light">Insights & Analytics</h1>
            <p className="text-neutral-light mt-2">Comprehensive analysis of disaster response data</p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Active Disasters', value: '12', icon: AlertTriangle, change: '+2 from last week' },
              { title: 'People Affected', value: '25,430', icon: Users, change: '+1,200 this month' },
              { title: 'Avg Response Time', value: '45 min', icon: Clock, change: '-5 min improvement' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-neutral-light text-sm">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-primary-light mt-1">{stat.value}</h3>
                    <p className="text-xs text-success-light mt-2">{stat.change}</p>
                  </div>
                  <stat.icon className="w-6 h-6 text-primary-light" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Analysis */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading font-bold text-primary-light">Disaster Trends</h2>
                <TrendingUp className="w-6 h-6 text-primary-light" />
              </div>
              <div className="h-64 flex items-center justify-center border border-white/10 rounded-xl">
                <BarChart3 className="w-8 h-8 text-neutral-light" />
                <span className="ml-2 text-neutral-light">Chart Placeholder</span>
              </div>
            </motion.div>

            {/* Distribution Analysis */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading font-bold text-primary-light">Resource Distribution</h2>
                <PieChart className="w-6 h-6 text-primary-light" />
              </div>
              <div className="h-64 flex items-center justify-center border border-white/10 rounded-xl">
                <PieChart className="w-8 h-8 text-neutral-light" />
                <span className="ml-2 text-neutral-light">Chart Placeholder</span>
              </div>
            </motion.div>
          </div>

          {/* Detailed Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
          >
            <h2 className="text-2xl font-heading font-bold text-primary-light mb-6">Response Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Resources Deployed', value: '1,234' },
                { label: 'Active Response Teams', value: '89' },
                { label: 'Evacuation Success Rate', value: '94%' },
                { label: 'Alert Response Rate', value: '98%' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-neutral-light">{stat.label}</p>
                  <p className="text-2xl font-bold text-primary-light mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};