import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Summary = () => {
  const location = useLocation();
  const { summary, filters } = location.state || {};

  console.log('Summary data in component:', summary);
  console.log('Filters in component:', filters);

  if (!summary) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-secondary-light">No summary data available</h1>
          <p className="text-neutral-light mt-2">Please generate a summary from the dashboard</p>
        </div>
      </div>
    );
  }

  const renderSection = (title: string, content: string | undefined) => {
    console.log(`Rendering section "${title}":`, content);
    
    if (!content?.trim()) {
      return null;
    }

    const paragraphs = content.split('\n').filter(p => p.trim());

    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
      >
        <h2 className="text-2xl font-heading font-bold text-primary-light mb-6 flex items-center">
          {title}
        </h2>
        <div className="prose prose-invert max-w-none">
          <div className="text-neutral-light leading-relaxed space-y-4">
            {paragraphs.map((paragraph, idx) => (
              <p key={idx} className="text-gray-300">{paragraph}</p>
            ))}
          </div>
        </div>
      </motion.section>
    );
  };

  const renderRecommendation = (title: string, content: string | undefined) => {
    console.log(`Rendering recommendation "${title}":`, content);
    
    if (!content?.trim()) {
      return null;
    }

    const items = content.split('\n').filter(item => item.trim());

    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
        <h3 className="text-xl font-heading font-bold text-primary-light mb-4">{title}</h3>
        <div className="prose prose-invert max-w-none">
          <ul className="space-y-3">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-neutral-light">
                <span className="block w-1.5 h-1.5 mt-2 rounded-full bg-primary-light flex-shrink-0" />
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="pt-20 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header Section */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h1 className="text-3xl font-heading font-bold text-primary-light mb-6">
              Disaster Summary Report
            </h1>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <span className="text-neutral-light text-sm block">Type</span>
                <span className="text-primary-light font-medium">{filters?.disasterType}</span>
              </div>
              {filters?.location && (
                <div className="bg-white/5 rounded-xl p-4">
                  <span className="text-neutral-light text-sm block">Location</span>
                  <span className="text-primary-light font-medium">{filters.location}</span>
                </div>
              )}
              {filters?.timeframe && (
                <div className="bg-white/5 rounded-xl p-4">
                  <span className="text-neutral-light text-sm block">Timeframe</span>
                  <span className="text-primary-light font-medium">{filters.timeframe}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            {renderSection("Current Situation", summary.currentSituation)}
            {renderSection("Affected Areas", summary.affectedAreas)}
            {renderSection("Environmental Impacts", summary.environmentalImpacts)}
            {renderSection("Ongoing Relief Efforts", summary.reliefEfforts)}
            
            {/* Recommendations Section */}
            {(summary.recommendations?.government || 
              summary.recommendations?.ngos || 
              summary.recommendations?.citizens) && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
              >
                <h2 className="text-2xl font-heading font-bold text-primary-light mb-6">Recommendations</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {renderRecommendation("For Government Agencies", summary.recommendations?.government)}
                  {renderRecommendation("For NGOs", summary.recommendations?.ngos)}
                  {renderRecommendation("For Individual Citizens", summary.recommendations?.citizens)}
                </div>
              </motion.section>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 