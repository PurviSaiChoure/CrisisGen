import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, FileText, MessageSquare, ArrowRight, Shield, Globe, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  const features = [
    {
      icon: MapPin,
      title: "Real-time Tracking",
      description: "Monitor disasters as they unfold with advanced AI-powered mapping"
    },
    {
      icon: Shield,
      title: "Rapid Response",
      description: "Generate instant action plans and coordinate emergency efforts"
    },
    {
      icon: Activity,
      title: "Live Analytics",
      description: "Get real-time insights and predictive analysis for better decisions"
    },
    {
      icon: MessageSquare,
      title: "Smart Communications",
      description: "Automated alerts and communication templates for quick deployment"
    }
  ];

  const segments = [
    {
      title: "For Citizens",
      description: "Stay informed and prepared with real-time alerts and guidance",
      link: "/dashboard",
      color: "primary"
    },
    {
      title: "For NGOs",
      description: "Coordinate relief efforts and resource allocation efficiently",
      link: "/dashboard",
      color: "secondary"
    },
    {
      title: "For Governments",
      description: "Comprehensive disaster management and response coordination",
      link: "/dashboard",
      color: "success"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[url('/disaster-bg.jpg')] bg-cover bg-center opacity-20" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-heading">
              AI-Powered
              <span className="text-primary-light"> Disaster Response</span>
            </h1>
            <p className="text-xl text-neutral-light max-w-3xl mx-auto">
              Empowering communities with real-time disaster management and intelligent response coordination
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link 
                to="/dashboard" 
                className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl 
                transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-primary/25"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/about" 
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl 
                transition-all duration-300 flex items-center border border-white/20 hover:border-white/40"
              >
                <span>Learn More</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <Globe className="w-12 h-12 text-primary-light opacity-50" />
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary-light mb-4 font-heading">
              Intelligent Response System
            </h2>
            <p className="text-neutral-light max-w-2xl mx-auto">
              Cutting-edge features powered by artificial intelligence to streamline disaster response
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="p-3 bg-primary/20 rounded-xl w-fit mb-4">
                  <feature.icon className="w-6 h-6 text-primary-light" />
                </div>
                <h3 className="text-xl font-heading font-bold text-primary-light mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-light">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Segments */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-primary-light mb-4 font-heading">
              Tailored Solutions
            </h2>
            <p className="text-neutral-light max-w-2xl mx-auto">
              Specialized features designed for different stakeholders in disaster response
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {segments.map((segment, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <h3 className="text-2xl font-heading font-bold text-primary-light mb-4">
                  {segment.title}
                </h3>
                <p className="text-neutral-light mb-6">
                  {segment.description}
                </p>
                <Link
                  to={segment.link}
                  className="inline-flex items-center text-primary-light hover:text-primary transition-colors duration-300"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-lg rounded-2xl p-12 border border-white/10 text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-6 font-heading">
              Ready to Get Started?
            </h2>
            <p className="text-neutral-light max-w-2xl mx-auto mb-8">
              Join our platform and be part of the next generation of disaster response
            </p>
            <Link
              to="/dashboard"
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl 
              transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-primary/25 mx-auto w-fit"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};