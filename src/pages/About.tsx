import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Users, Brain, Globe, Award, Zap, 
  Target, BarChart, Clock, Heart, Lightbulb, 
  Workflow, Building, ArrowRight 
} from 'lucide-react';

export const About = () => {
  const features = [
    {
      icon: Shield,
      title: "AI-Powered Response",
      description: "Leveraging cutting-edge artificial intelligence to coordinate and optimize disaster response efforts in real-time.",
      color: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
    },
    {
      icon: Brain,
      title: "Smart Analysis",
      description: "Advanced algorithms process vast amounts of data to provide actionable insights and predictions for better decision-making.",
      color: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-400"
    },
    {
      icon: Clock,
      title: "Rapid Deployment",
      description: "Quick response systems that enable immediate action when disasters strike, minimizing impact and saving lives.",
      color: "bg-green-500/10 hover:bg-green-500/20 text-green-400"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Supporting disaster response efforts worldwide with localized solutions and cultural sensitivity.",
      color: "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400"
    }
  ];

  const stats = [
    { value: "98%", label: "Response Rate", icon: Zap },
    { value: "50+", label: "Countries Served", icon: Globe },
    { value: "24/7", label: "Support Available", icon: Clock },
    { value: "1M+", label: "Lives Impacted", icon: Heart }
  ];

  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "Dedicated to saving lives and minimizing disaster impact through technology."
    },
    {
      icon: Users,
      title: "Community-Focused",
      description: "Building resilient communities through collaboration and support."
    },
    {
      icon: Lightbulb,
      title: "Innovation-Led",
      description: "Constantly evolving our solutions with cutting-edge technology."
    },
    {
      icon: Heart,
      title: "Compassion-First",
      description: "Putting human needs at the center of everything we do."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="pt-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Hero Section */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-heading font-bold text-primary-light mb-4"
            >
              Revolutionizing Disaster Response
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-neutral-light max-w-3xl mx-auto"
            >
              Empowering communities and response teams with AI-driven solutions for faster, 
              smarter, and more effective disaster management.
            </motion.p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center"
              >
                <stat.icon className="w-8 h-8 text-primary-light mx-auto mb-3" />
                <h3 className="text-3xl font-bold text-primary-light mb-1">{stat.value}</h3>
                <p className="text-sm text-neutral-light">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`${feature.color} rounded-2xl p-6 border border-white/10 transition-all duration-300`}
              >
                <feature.icon className="w-10 h-10 mb-4" />
                <h3 className="text-xl font-heading font-bold mb-2">{feature.title}</h3>
                <p className="text-neutral-light leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
          >
            <h2 className="text-3xl font-heading font-bold text-primary-light mb-8 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary-light" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-primary-light mb-2">{value.title}</h3>
                  <p className="text-neutral-light">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-8 border border-white/10 text-center"
          >
            <h2 className="text-3xl font-heading font-bold text-primary-light mb-4">Join Our Mission</h2>
            <p className="text-neutral-light mb-6 max-w-2xl mx-auto">
              Be part of the revolution in disaster response. Whether you're an organization, developer, 
              or concerned citizen, there's a place for you in our community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl transition-colors duration-300 flex items-center gap-2">
                Partner with Us <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-colors duration-300 flex items-center gap-2">
                Learn More <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};