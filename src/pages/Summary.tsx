import React from 'react';
import { useLocation } from 'react-router-dom';

interface LocationState {
  summary: string;
  filters: {
    disasterType: string;
    location: string;
    timeframe: string;
  };
}

export const Summary = () => {
  const location = useLocation();
  const { summary, filters } = location.state as LocationState || {};

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-3xl font-heading font-bold mb-8">
        Disaster Summary
      </h1>
      <h2 className="text-xl font-bold mb-4">
        Filters: {filters.disasterType}, {filters.location}, {filters.timeframe}
      </h2>
      <p>{summary || 'No summary available'}</p>
    </div>
  );
};
