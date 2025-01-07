import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, FileText, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  const features = [
    {
      icon: <MapPin className="h-6 w-6 text-blue-500" />,
      title: "Real-time Disaster Tracking",
      description: "Monitor disasters as they unfold with our advanced mapping system"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: "Coordinated Response",
      description: "Connect with NGOs, government agencies, and volunteers"
    },
    {
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      title: "Action Plan Generator",
      description: "AI-powered response plans tailored to each situation"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-blue-500" />,
      title: "Communication Templates",
      description: "Quick and effective message templates for emergency communications"
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?auto=format&fit=crop&q=80')] bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-[var(--primary-blue)] mb-6 font-heading"
          >
            AI-Powered Disaster Response
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-[var(--accent-grey)] mb-8 max-w-2xl mx-auto"
          >
            Empowering communities with real-time disaster management and response coordination
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-x-4"
          >
            <Link
              to="/dashboard"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>View Current Disasters</span>
              <MapPin className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-black/70">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-blue-500 mb-12 font-heading"
          >
            Key Features
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card hover:scale-105"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-blue-400 mb-2 font-heading">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Segments */}
      <section className="py-20 bg-emerald-950/70">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-blue-500 mb-12 font-heading"
          >
            Who We Serve
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['For Citizens', 'For NGOs', 'For Governments'].map((segment, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glassmorphism p-8 text-center cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <h3 className="text-2xl font-semibold text-blue-400 mb-4 font-heading">{segment}</h3>
                <p className="text-gray-400">Tailored solutions and resources specifically designed for {segment.toLowerCase()}.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};