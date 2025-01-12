import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Download, Send } from 'lucide-react';

interface MessageTemplate {
  type: string;
  audience: string;
  details: string;
}

export const Communication = () => {
  const [template, setTemplate] = useState<MessageTemplate>({
    type: '',
    audience: '',
    details: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    // TODO: Implement template generation
    setTimeout(() => {
      setGeneratedMessage('EMERGENCY ALERT: Flash flood warning in effect for [Location]. Immediate evacuation required for all residents in [Affected Areas]. Emergency shelters are available at [Shelter Locations]. For assistance, call [Emergency Number].');
      setIsGenerating(false);
    }, 2000);
  };

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
            <h1 className="text-3xl font-heading font-bold text-primary-light">Communication Templates</h1>
            <p className="text-neutral-light mt-2">Generate effective emergency communication messages</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Template Generator Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-2xl font-heading font-bold text-primary-light mb-6">Template Generator</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-light">Message Type</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 focus:outline-none focus:border-primary-light"
                    value={template.type}
                    onChange={(e) => setTemplate({...template, type: e.target.value})}
                  >
                    <option value="">Select Type</option>
                    <option value="emergency">Emergency Alert</option>
                    <option value="evacuation">Evacuation Notice</option>
                    <option value="update">Status Update</option>
                    <option value="resource">Resource Request</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-light">Target Audience</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 focus:outline-none focus:border-primary-light"
                    value={template.audience}
                    onChange={(e) => setTemplate({...template, audience: e.target.value})}
                  >
                    <option value="">Select Audience</option>
                    <option value="public">General Public</option>
                    <option value="emergency">Emergency Services</option>
                    <option value="ngos">NGOs</option>
                    <option value="government">Government Officials</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-light">Key Details</label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-300 focus:outline-none focus:border-primary-light h-32"
                    placeholder="Enter specific details to include..."
                    value={template.details}
                    onChange={(e) => setTemplate({...template, details: e.target.value})}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className={`w-full rounded-xl p-4 flex items-center justify-center space-x-3 transition-all duration-300
                    ${isGenerating ? 
                      'bg-neutral cursor-not-allowed' : 
                      'bg-primary hover:bg-primary-dark text-white'
                    }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                      <span>Generating Template...</span>
                    </div>
                  ) : (
                    <>
                      <MessageSquare className="w-5 h-5" />
                      <span>Generate Template</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Generated Message */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading font-bold text-primary-light">Generated Message</h2>
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors duration-300">
                  <Download className="w-5 h-5 text-primary-light" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-lg font-heading font-semibold text-primary-light mb-3">Preview</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {generatedMessage || 'Generated message will appear here...'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <button className="flex items-center justify-center space-x-2 bg-primary/20 hover:bg-primary/30 text-primary-light rounded-xl p-4 transition-colors duration-300">
                    <Mail className="w-5 h-5" />
                    <span>Send Email</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 bg-secondary/20 hover:bg-secondary/30 text-secondary-light rounded-xl p-4 transition-colors duration-300">
                    <MessageSquare className="w-5 h-5" />
                    <span>Send SMS</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 bg-success/20 hover:bg-success/30 text-success-light rounded-xl p-4 transition-colors duration-300">
                    <Send className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};