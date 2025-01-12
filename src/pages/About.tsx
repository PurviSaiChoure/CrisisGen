import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Brain, Globe } from 'lucide-react';

export const About = () => {
  const features = [
    {
      icon: Shield,
      title: "Rapid Response",
      description: "Our AI-powered system enables quick and effective disaster response coordination."
    },
    {
      icon: Users,
      title: "Community Focus",
      description: "Bringing together citizens, NGOs, and government agencies for unified action."
    },
    {
      icon: Brain,
      title: "AI-Driven Insights",
      description: "Advanced algorithms provide real-time analysis and actionable recommendations."
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Supporting disaster response efforts worldwide with localized solutions."
    }
  ];

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
            <h1 className="text-3xl font-heading font-bold text-primary-light">About DisasterResponse</h1>
            <p className="text-neutral-light mt-2">Revolutionizing disaster management through AI-powered solutions</p>
          </div>

          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
          >
            <h2 className="text-2xl font-heading font-bold text-primary-light mb-4">Our Mission</h2>
            <p className="text-neutral-light leading-relaxed">
              DisasterResponse is dedicated to revolutionizing disaster management through cutting-edge AI technology. 
              We aim to save lives and minimize the impact of natural disasters by providing real-time response 
              coordination and resource management tools that empower communities and response teams.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <feature.icon className="w-8 h-8 text-primary-light mb-4" />
                <h3 className="text-xl font-heading font-bold text-primary-light mb-2">{feature.title}</h3>
                <p className="text-neutral-light">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
          >
            <h2 className="text-2xl font-heading font-bold text-primary-light mb-6">Join Our Mission</h2>
            <div className="space-y-4">
              <p className="text-neutral-light leading-relaxed">
                We're always looking for partners, volunteers, and organizations to join our mission. 
                Whether you're an NGO, government agency, or concerned citizen, there's a place for 
                you in our community.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-primary/20 hover:bg-primary/30 text-primary-light px-6 py-3 rounded-xl transition-colors duration-300">
                  Partner with Us
                </button>
                <button className="bg-secondary/20 hover:bg-secondary/30 text-secondary-light px-6 py-3 rounded-xl transition-colors duration-300">
                  Volunteer
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};