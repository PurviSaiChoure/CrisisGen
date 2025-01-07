import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Facebook, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-black/90 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading text-blue-500 font-semibold text-lg mb-4">DisasterResponse</h3>
            <p className="text-gray-400">Empowering communities with AI-powered disaster response solutions.</p>
          </div>
          
          <div>
            <h4 className="font-heading text-blue-500 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-blue-500 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-blue-500 transition-colors">Contact</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-blue-500 transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-blue-500 font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/action-plan" className="text-gray-400 hover:text-blue-500 transition-colors">Action Plans</Link></li>
              <li><Link to="/communication" className="text-gray-400 hover:text-blue-500 transition-colors">Templates</Link></li>
              <li><Link to="/insights" className="text-gray-400 hover:text-blue-500 transition-colors">Analytics</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-blue-500 font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              {[
                { Icon: Twitter, href: '#' },
                { Icon: Facebook, href: '#' },
                { Icon: Github, href: '#' },
                { Icon: Mail, href: '#' }
              ].map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  className="text-gray-400 hover:text-blue-500 transition-colors transform hover:scale-110"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} DisasterResponse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};