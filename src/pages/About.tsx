import React from 'react';
import { motion } from 'framer-motion';

export const About = () => {
  return (
    <div className="pt-16 min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-emerald-500 mb-6">About DisasterResponse</h1>
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/50 p-6 rounded-lg"
          >
            <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Our Mission</h2>
            <p className="text-gray-300">
              DisasterResponse is dedicated to revolutionizing disaster management through AI-powered solutions. 
              We aim to save lives and minimize the impact of natural disasters by providing real-time response 
              coordination and resource management tools.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/50 p-6 rounded-lg"
          >
            <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Our Approach</h2>
            <p className="text-gray-300">
              By combining artificial intelligence with disaster management expertise, we provide:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>Real-time disaster monitoring and analysis</li>
              <li>AI-generated action plans and response strategies</li>
              <li>Automated communication systems for rapid response</li>
              <li>Resource optimization and allocation tools</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black/50 p-6 rounded-lg"
          >
            <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Join Us</h2>
            <p className="text-gray-300">
              We're always looking for partners, volunteers, and organizations to join our mission. 
              Whether you're an NGO, government agency, or concerned citizen, there's a place for 
              you in our community.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};