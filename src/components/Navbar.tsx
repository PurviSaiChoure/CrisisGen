import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertTriangle, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <AlertTriangle className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold font-heading text-blue-500">DisasterResponse</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {[
              { path: '/dashboard', label: 'Dashboard' },
              { path: '/action-plan', label: 'Action Plan' },
              { path: '/communication', label: 'Communication' },
              { path: '/insights', label: 'Insights' },
              { path: '/about', label: 'About' },
              { path: '/contact', label: 'Contact' }
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`text-gray-300 hover:text-blue-500 transition-colors relative ${
                  location.pathname === path ? 'text-blue-500' : ''
                }`}
              >
                {label}
                {location.pathname === path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-blue-500 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-md"
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {[
                { path: '/dashboard', label: 'Dashboard' },
                { path: '/action-plan', label: 'Action Plan' },
                { path: '/communication', label: 'Communication' },
                { path: '/insights', label: 'Insights' },
                { path: '/about', label: 'About' },
                { path: '/contact', label: 'Contact' }
              ].map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`block py-2 text-gray-300 hover:text-blue-500 transition-colors ${
                    location.pathname === path ? 'text-blue-500' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};