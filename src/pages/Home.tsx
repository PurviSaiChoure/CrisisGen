import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Users, FileText, MessageSquare, ArrowRight, Shield, 
  Globe, Activity, AlertTriangle, Zap, BarChart3, Heart, 
  Clock, Brain, Target, Send 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  const mainActions = [
    { 
      title: "Generate Summary", 
      icon: FileText, 
      path: '/generate-summary',
      color: "bg-gradient-to-r from-blue-500/40 to-blue-600/40 hover:from-blue-500/60 hover:to-blue-600/60",
      borderColor: "border-blue-400/30",
      shadow: "shadow-blue-500/20"
    },
    { 
      title: "Create Action Plan", 
      icon: AlertTriangle, 
      path: '/action-plan',
      color: "bg-gradient-to-r from-purple-500/40 to-purple-600/40 hover:from-purple-500/60 hover:to-purple-600/60",
      borderColor: "border-purple-400/30",
      shadow: "shadow-purple-500/20"
    },
    { 
      title: "Send Alert", 
      icon: Send, 
      path: '/communication',
      color: "bg-gradient-to-r from-rose-500/40 to-rose-600/40 hover:from-rose-500/60 hover:to-rose-600/60",
      borderColor: "border-rose-400/30",
      shadow: "shadow-rose-500/20"
    }
  ];

  const features = [
    {
      icon: MapPin,
      title: "Real-time Tracking",
      description: "Monitor disasters as they unfold with advanced AI-powered mapping",
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Leverage cutting-edge artificial intelligence for rapid response coordination",
      color: "from-purple-500/20 to-purple-600/20"
    },
    {
      icon: Activity,
      title: "Live Analytics",
      description: "Get real-time insights and predictive analysis for better decisions",
      color: "from-green-500/20 to-green-600/20"
    },
    {
      icon: MessageSquare,
      title: "Smart Communications",
      description: "Automated alerts and communication templates for quick deployment",
      color: "from-orange-500/20 to-orange-600/20"
    }
  ];

  const stats = [
    { value: "24/7", label: "Monitoring", icon: AlertTriangle },
    { value: "45s", label: "Response Time", icon: Zap },
    { value: "98%", label: "Accuracy", icon: BarChart3 },
    { value: "1M+", label: "Lives Protected", icon: Heart }
  ];

  const segments = [
    {
      icon: Users,
      title: "For Emergency Teams",
      description: "Coordinate response efforts with real-time data and AI assistance",
      link: "/dashboard",
      color: "from-primary/20 via-primary/10 to-transparent"
    },
    {
      icon: Globe,
      title: "For Organizations",
      description: "Manage resources and coordinate multi-agency responses efficiently",
      link: "/dashboard",
      color: "from-secondary/20 via-secondary/10 to-transparent"
    },
    {
      icon: Shield,
      title: "For Communities",
      description: "Stay informed and prepared with real-time alerts and guidance",
      link: "/dashboard",
      color: "from-success/20 via-success/10 to-transparent"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section with Action Buttons */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[url('/disaster-bg.jpg')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 font-heading bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-light to-secondary-light">
              AI-Powered
              <br />
              Disaster Response
            </h1>
            
            <p className="text-xl text-neutral-light max-w-3xl mx-auto leading-relaxed">
              Empowering communities with real-time disaster management and intelligent response coordination
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {mainActions.map((action, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    to={action.path}
                    className={`${action.color} text-white/90 px-8 py-4 rounded-xl 
                      flex items-center gap-3 transition-all duration-300
                      hover:scale-105 active:scale-95 
                      backdrop-blur-md border ${action.borderColor}
                      shadow-lg ${action.shadow} hover:shadow-xl
                      hover:text-white`}
                  >
                    <action.icon className="w-5 h-5" />
                    <span className="font-medium">{action.title}</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="flex flex-wrap justify-center gap-8 mt-16">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-primary-light" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-neutral-light">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 font-heading text-white drop-shadow-lg">
              Powerful Features
            </h2>
            <p className="text-neutral-light max-w-2xl mx-auto">
              Advanced tools and technologies for effective disaster response
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
                className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 
                hover:bg-white/10 transition-all duration-500 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 
                group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="p-3 bg-white/10 rounded-xl w-fit mb-4">
                    <feature.icon className="w-6 h-6 text-primary-light" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-primary-light mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-light">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Segments Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 font-heading text-white drop-shadow-lg">
            Who We Serve
            </h2>
            <p className="text-neutral-light max-w-2xl mx-auto">
              Tailored solutions for different stakeholders in disaster response
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {segments.map((segment, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 
                hover:bg-white/10 transition-all duration-500"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${segment.color} opacity-0 
                group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <segment.icon className="w-8 h-8 text-primary-light mb-4" />
                  <h3 className="text-2xl font-heading font-bold text-primary-light mb-4">
                    {segment.title}
                  </h3>
                  <p className="text-neutral-light mb-6">
                    {segment.description}
                  </p>
                  <Link
                    to={segment.link}
                    className="inline-flex items-center text-primary-light hover:text-white transition-colors duration-300"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
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
            className="relative bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-lg rounded-2xl p-12 
            border border-white/10 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 
            animate-pulse" style={{ animationDuration: '3s' }} />
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-6 font-heading">
                Ready to Get Started?
              </h2>
              <p className="text-neutral-light max-w-2xl mx-auto mb-8">
                Join our platform and be part of the next generation of disaster response
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl 
                transition-all duration-300 space-x-2 backdrop-blur-lg border border-white/20 hover:border-white/40 
                transform hover:-translate-y-1"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};