import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3 rounded-xl bg-white/10 backdrop-blur-lg 
      border border-white/20 hover:bg-white/20 transition-all duration-300 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-primary-light group-hover:text-white transition-colors duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-primary-light group-hover:text-white transition-colors duration-300" />
      )}
    </motion.button>
  );
}; 