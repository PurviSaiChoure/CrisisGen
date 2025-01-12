import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Building } from 'lucide-react';

export const Contact = () => {
  const contactInfo = [
    { icon: Phone, title: "Emergency Hotline", info: "+1 (555) 911-0000" },
    { icon: Mail, title: "Email", info: "support@disasterresponse.com" },
    { icon: MapPin, title: "Headquarters", info: "123 Emergency Response St, RC 12345" }
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
            <h1 className="text-3xl font-heading font-bold text-primary-light">Contact Us</h1>
            <p className="text-neutral-light mt-2">Get in touch with our team for support or inquiries</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-heading font-bold text-primary-light mb-6">Send Message</h2>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-light">Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-gray-300 focus:outline-none focus:border-primary-light"
                      placeholder="Your name"
                    />
                    <Building className="w-5 h-5 text-neutral-light absolute left-3 top-3.5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-light">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-gray-300 focus:outline-none focus:border-primary-light"
                      placeholder="your@email.com"
                    />
                    <Mail className="w-5 h-5 text-neutral-light absolute left-3 top-3.5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-light">Subject</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 focus:outline-none focus:border-primary-light">
                    <option value="">Select Subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="support">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-light">Message</label>
                  <div className="relative">
                    <textarea
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-gray-300 focus:outline-none focus:border-primary-light h-32"
                      placeholder="Your message..."
                    />
                    <MessageSquare className="w-5 h-5 text-neutral-light absolute left-3 top-3.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl p-4 flex items-center justify-center space-x-2 transition-colors duration-300"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Quick Contact Cards */}
              {contactInfo.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/20 rounded-lg">
                      <item.icon className="w-6 h-6 text-primary-light" />
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-semibold text-primary-light">{item.title}</h3>
                      <p className="text-neutral-light mt-1">{item.info}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Map Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
              >
                <h2 className="text-2xl font-heading font-bold text-primary-light mb-4">Our Location</h2>
                <div className="h-64 bg-white/5 rounded-xl flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-neutral-light" />
                  <span className="ml-2 text-neutral-light">Map Placeholder</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};