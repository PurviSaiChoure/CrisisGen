import React from 'react';
import { motion } from 'framer-motion';

export const Contact = () => {
  return (
    <div className="pt-16 min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-emerald-500 mb-6">Contact Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/50 p-6 rounded-lg"
          >
            <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Get in Touch</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input type="text" className="input-field w-full" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input type="email" className="input-field w-full" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <select className="input-field w-full">
                  <option>General Inquiry</option>
                  <option>Partnership Opportunity</option>
                  <option>Technical Support</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea className="input-field w-full h-32" placeholder="Your message"></textarea>
              </div>
              <button type="submit" className="btn-primary w-full">Send Message</button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/50 p-6 rounded-lg"
          >
            <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Contact Information</h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-emerald-400 font-medium">Address</h3>
                <p>123 Emergency Response Street</p>
                <p>Crisis Management District</p>
                <p>Response City, RC 12345</p>
              </div>
              <div>
                <h3 className="text-emerald-400 font-medium">Email</h3>
                <p>info@disasterresponse.com</p>
                <p>support@disasterresponse.com</p>
              </div>
              <div>
                <h3 className="text-emerald-400 font-medium">Emergency Contact</h3>
                <p>24/7 Hotline: +1 (555) 911-0000</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};